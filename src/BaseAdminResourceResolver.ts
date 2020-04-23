import {
    Arg,
    Authorized,
    ClassType, Ctx,
    Field,
    Int,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from 'type-graphql'
import {
    BaseEntity,
    createQueryBuilder,
    EntityMetadata, EntitySchema, getRepository,
    In,
    ObjectLiteral,
    SelectQueryBuilder,
    ObjectType as TypeOrmObjectType
} from 'typeorm'


import { ApolloError } from 'apollo-server-errors'
import {EntityUpdateHelper, EntityUpdateHelperOptions} from './EntityUpdateHelper'
import {GQLReactAdminListParams} from "./types/GQLReactAdminListParams";
import {GQLReactAdminGetManyReferenceParams} from "./types/GQLReactAdminGetManyReferenceParams";
import {IdsList} from "./types/IdsList";
import {ReactAdminDataProvider} from "./types/ReactAdminDataProvider";
import {ReturnTypeFuncValue} from "type-graphql/dist/decorators/types"

/*
import {GQLAdministrator} from "./types/GQLAdministrator"
import {GQLAdministratorInput} from "./types/GQLAdministratorInput"
import {Administrator} from "./models/Administrator"
const ZZZ=createAdminResolver({
    return:GQLAdministrator,
    create:GQLAdministratorInput,
    entity:Administrator
})
class XXX extends ZZZ {
up
}*/




export function createBaseCrudResolver<
    ReturnType extends  ReturnTypeFuncValue,
    CreateType extends ReturnTypeFuncValue ,
    EntityType  extends TypeOrmObjectType<any> | EntitySchema<any>
>(objectTypeCls: ClassType<ReturnType>, inputTypeCls: ClassType<CreateType>, ORMEntity: EntityType, updateHelperOptions?:Partial<EntityUpdateHelperOptions>):ClassType<ReactAdminDataProvider<ReturnType,CreateType,CreateType>> {
return createAdminResolver({
    create:inputTypeCls,
    update:inputTypeCls,
    return:objectTypeCls,
    entity:ORMEntity,
    updateHelperOptions
})
}

export function createAdminResolver<ReturnType extends ReturnTypeFuncValue,
    CreateType extends ReturnTypeFuncValue,
    UpdateType extends ReturnTypeFuncValue,
    EntityType extends TypeOrmObjectType<any> | EntitySchema<any>>(config:{
    return:ReturnType,
    create:ClassType<CreateType>,
    update?: ClassType<UpdateType>,
    entity:EntityType,
    updateHelperOptions?:Partial<EntityUpdateHelperOptions>
}): ClassType<ReactAdminDataProvider<EntityType,CreateType,UpdateType>>{


    const ORMEntity=config.entity
    const ReturnGQLClass=config.return
    const CreateGQLClass=config.create
    const UpdateGQLClass=config.update || config.create
    // @ts-ignore
    const suffix =ORMEntity.name
    const updateHelperOptions=config.updateHelperOptions
    let entityAlias = suffix.toLowerCase()
    @ObjectType(`${suffix}List`)
    class OutList {
        @Field(type => [ReturnGQLClass], { nullable: true })
        data: any
        @Field(type => Int)
        total: number
    }


    @Resolver({ isAbstract: true })
    class BaseResolver extends ReactAdminDataProvider<EntityType,CreateType,UpdateType>{
        @Authorized('admin')
        @Query(type => OutList, {
            name: `admin${suffix}List`,
        })
        // GET LIST
        async getListQuery(
            @Arg('params', type => GQLReactAdminListParams)
                params: GQLReactAdminListParams,
            @Ctx() context:any
        ) {
            return this.getList(params,context)
        }
        async getList( params: GQLReactAdminListParams, @Ctx() context:any){
            const metadata =getRepository( ORMEntity)
                .metadata
            let query =getRepository( ORMEntity).createQueryBuilder( entityAlias)
            if (params.filter) {
                this.applyFilterToQuery(query, params, metadata,context)
            }
            this.alterGetListQuery(query, params)
            let total = await query.getCount()
            if (params.pagination) {
                query
                    .take(params.pagination.perPage)
                    .skip(
                        params.pagination.perPage *
                        (params.pagination.page - 1),
                    )
            }
            if (params.sort) {
                query.orderBy(
                    `${entityAlias}.${params.sort.field}`,
                    //@ts-ignore
                    params.sort.order,
                )
            }

            let data = await query.getMany()
            // @ts-ignore
            return { data: data || [], total }
        }
        // GET ONE
        @Authorized('admin')
        @Query(type => ReturnGQLClass, { name: `admin${suffix}GetOne` })
        async getOneQuery(
            @Arg('id')
                id: string,
            @Ctx() context:any
        ) {
            return this.getOne(id,context)
        }
        async getOne(id:string,context:any)
        {
            let where:ObjectLiteral={}
            where[this.primaryKey]=id
            // @ts-ignore
            return await getRepository(ORMEntity).findOne({ where })
        }
        // GET_MANY
        @Authorized('admin')
        @Query(type => [ReturnGQLClass], {
            name: `admin${suffix}GetMany`,
            nullable: true,
        })
        async getManyQuery(
            @Arg('ids', type => [Int])
                ids: number[],
            @Ctx() context:any
        ){
            return this.getMany(ids,context)
        }
        async getMany( ids: number[],context:any){
            let where:ObjectLiteral={}
            where[this.primaryKey]=In(ids)
            // @ts-ignore
            return await getRepository(ORMEntity).find({where})
        }
        // GET_MANY_REFERENCE
        @Authorized('admin')
        @Query(type => OutList, {
            name: `admin${suffix}GetManyReference`,
            nullable: true,
        })
        async getManyReferenceQuery(
            @Arg('params', type => GQLReactAdminGetManyReferenceParams)
                params: GQLReactAdminGetManyReferenceParams,
            @Ctx() context:any
        ) {
            return this.getManyReference(params,context)
        }
        async getManyReference(params: GQLReactAdminGetManyReferenceParams,context:any){
            let query =getRepository(ORMEntity).createQueryBuilder('entity').where(
                `entity.${params.target}=:id`,
                {id:params.id},
            )
            let total = await query.getCount()
            if (params.pagination) {
                query
                    .take(params.pagination.perPage)
                    .skip(
                        params.pagination.perPage *
                        (params.pagination.page - 1),
                    )
            }
            if (params.sort) {
                //@ts-ignore
                query.orderBy(params.sort.field, params.sort.order)
            }

            return await { total, data: await query.getMany() }
        }
        // UPDATE
        @Authorized('admin')
        @Mutation(type => ReturnGQLClass, { name: `admin${suffix}Update` })
        async updateMutation(
            @Arg('id', type => Int)
                id: number,
            @Arg('data', type => UpdateGQLClass)
                data: UpdateType,
            @Ctx() context:any
        ) {
            return await this.update(id,data,context)
        }
        async update(id: number, data: UpdateType, context:any) {
            let where:ObjectLiteral={}
            where[this.primaryKey]=id
            let entity = await getRepository(ORMEntity).findOne({ where })
            if (!entity)
                throw new ApolloError(
                    'Entity not found for id ' + id,
                    'NOT_FOUND',
                )
            await EntityUpdateHelper.update(entity, data,updateHelperOptions)
            await getRepository(ORMEntity).save(entity)
            return entity
        }
        //UPDATE_MANY
        @Authorized('admin')
        @Mutation(type => IdsList, { name: `admin${suffix}UpdateMany` })
        async updateManyMutation(
            @Arg('ids', type => [Int])
                ids: number[],
            @Arg('data', type => UpdateGQLClass)
                data: UpdateType,
            @Ctx() context:any
        ) {
            return this.updateMany(ids,data,context)
        }
        async updateMany( ids: number[],data: UpdateType,context:any){
            let list = await getRepository(ORMEntity).createQueryBuilder( entityAlias)
                .whereInIds(ids)
                .getMany()
            for (let entity of list) {
                await EntityUpdateHelper.update(entity, data,updateHelperOptions)
                await getRepository(ORMEntity).save(entity)
            }

            return { ids }
        }
        //CREATE
        @Authorized('admin')
        @Mutation(type => ReturnGQLClass, { name: `admin${suffix}Create` })
        async createMutation(@Arg('data', type => CreateGQLClass) data: CreateType, @Ctx() context:any) {
            return await this.create(data,context)
        }
        async create( data: CreateType, context:any) {
            let entity = getRepository(ORMEntity).create()
            await EntityUpdateHelper.update(entity, data,updateHelperOptions)
            await getRepository(ORMEntity).save(entity)
            return entity
        }
        // DELETE
        @Authorized('admin')
        @Mutation(type => ReturnGQLClass, { name: `admin${suffix}Delete` })
        async deleteMutation(
            @Arg('id', type => Int)
                id: number,
            @Ctx() context:any
        ) {
            return this.delete(id,context)
        }
        async delete(id:number,context:any){
            // @ts-ignore
            const entity = await validateEntityRelations(ORMEntity, id,this.primaryKey)
            let clonedEntity={...entity}
            // @ts-ignore
            await getRepository(ORMEntity).remove(entity)

            return clonedEntity
        }
        // DELETE_MANY
        @Authorized('admin')
        @Mutation(type => IdsList, { name: `admin${suffix}DeleteMany` })
        async deleteManyMutation(
            @Arg('ids', type => [Int])
                ids: number[],
            @Ctx() context:any
        ) {
            return this.deleteMany(ids,context)
        }
        async deleteMany( ids: number[],context:any){
            let errors:any[] = []
            let removedIds:any[] = []
            for (let id of ids) {
                try {
                    // @ts-ignore
                    let entity = await validateEntityRelations(ORMEntity, id,this.primaryKey)
                    //@ts-ignore
                    await getRepository(ORMEntity).remove(entity)
                    removedIds.push(id)
                } catch (e) {
                    errors.push(e.message)
                }
            }
            if (errors.length > 0) {
                throw new ApolloError(errors.join(';'), 'DELETION_FAILED')
            }
            return { ids: removedIds }
        }
        alterGetListQuery(
            qb: SelectQueryBuilder<any>,
            params: GQLReactAdminListParams,
        ) {}
        applyFilterToQuery(
            qb: SelectQueryBuilder<any>,
            params: GQLReactAdminListParams,
            metadata: EntityMetadata,
            context:any
        ) {
            if (params.filter) {
                let columnNames = metadata.columns.map(c => c.propertyName)
                for (let f of params.filter) {
                    if (columnNames.includes(f.field)) {
                        let value = {} as ObjectLiteral
                        value[f.field] = f.value
                        qb.andWhere(
                            `${entityAlias}.${f.field}=:${f.field}`,
                            value,
                        )
                    } else if (f.field === 'q') {
                        // build full text  query
                        let ftColumnNames = [] as string[]
                        for (let ind of metadata.indices) {
                            if (ind.isFulltext) {
                                for (let column of ind.columns) {
                                    ftColumnNames.push(
                                        `${entityAlias}.${column.propertyName}`,
                                    )
                                }
                            }
                        }

                        let searchValue = f.value
                        const specialCharacters = ['+', '*', '@', '%', '-', '(', ')', '"']
                        specialCharacters.forEach(char  => {
                            searchValue = searchValue.replace(char, '')
                        })

                        searchValue.length === 0 ? searchValue : searchValue = `${searchValue}*`

                        if (ftColumnNames.length > 0)
                            qb.andWhere(
                                `match(${ftColumnNames.join(
                                    ',',
                                )}) against (:ftQuery IN BOOLEAN MODE)`,
                                { ftQuery: searchValue },
                            )
                    }
                }
            }
        }
        get primaryKey(){
            const metadata = getRepository(ORMEntity).metadata
            return metadata.primaryColumns[0].databaseName
        }
    }
//@ts-ignore
    return BaseResolver
}


export async function validateEntityRelations<ORM extends BaseEntity>(
    entityClass: any,
    id: number,
    primaryKey:string
): Promise<ORM> {
    const metadata =getRepository(entityClass).metadata as EntityMetadata
    let errors:any[] = []
    let rQuery = await createQueryBuilder(entityClass, 'entity').where(
        `entity.${primaryKey}=:id`,
        { id },
    )

    for (let r of metadata.relations) {
        if (
            r.onDelete !== 'CASCADE' && !r.isCascadeRemove
            && !r.isManyToOne
        ) {
            rQuery.loadRelationCountAndMap(
                `entity.${r.propertyName}_count`,
                `entity.${r.propertyName}`,
            )
        }
    }
    let dataCounts = await rQuery.getOne()
    for (let r of metadata.relations) {
        //@ts-ignore
        if (
            !r.isCascadeRemove &&
            dataCounts &&
            // @ts-ignore
            dataCounts[`${r.propertyName}_count`] > 0
        ) {
            //@ts-ignore
            let count = dataCounts[`${r.propertyName}_count`]
            //@ts-ignore
            errors.push(`${r.type.name} (${count})`)
        }
    }
    if (errors.length > 0) {
        throw new ApolloError(
            `Entity ${id} has linked data : ${errors.join(
                ',',
            )}, unlink it first`,
            'DELETION_FAILED',
        )
    }
    //@ts-ignore
    return dataCounts
}
