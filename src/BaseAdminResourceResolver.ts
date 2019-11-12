import {
    Arg,
    Authorized,
    ClassType,
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
    EntityMetadata,
    In,
    ObjectLiteral,
    SelectQueryBuilder,
} from 'typeorm'


import { ApolloError } from 'apollo-server-errors'
import {EntityUpdateHelper, EntityUpdateHelperOptions} from './EntityUpdateHelper'
import {GQLReactAdminListParams} from "./types/GQLReactAdminListParams";
import {GQLReactAdminGetManyReferenceParams} from "./types/GQLReactAdminGetManyReferenceParams";
import {IdsList} from "./types/IdsList";
import {ReactAdminDataProvider} from "./types/ReactAdminDataProvider";

export function createBaseCrudResolver<
    T extends ClassType,
    T2 extends ClassType,
    O extends ClassType<BaseEntity>,
>(objectTypeCls: T, inputTypeCls: T2, ORMEntity: O,updateHelperOptions?:Partial<EntityUpdateHelperOptions>):ClassType<ReactAdminDataProvider> {

    //@ts-ignore
    const suffix = ORMEntity.name
    let entityAlias = suffix.toLowerCase()
    @ObjectType(`${suffix}List`)
    class OutList {
        @Field(type => [objectTypeCls], { nullable: true })
        data: any
        @Field(type => Int)
        total: number
    }

    @Resolver({ isAbstract: true })
    class BaseResolver extends ReactAdminDataProvider{
        @Authorized('admin')
        @Query(type => OutList, {
            name: `admin${suffix}List`,
        })
        // GET LIST
        async getList(
            @Arg('params', type => GQLReactAdminListParams)
            params: GQLReactAdminListParams,
        ) {
            //@ts-ignore
            const metadata = ORMEntity.getRepository()
                .metadata as EntityMetadata
            let query = createQueryBuilder(ORMEntity, entityAlias)
            if (params.filter) {
                this.applyFilterToQuery(query, params, metadata)
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
        @Query(type => objectTypeCls, { name: `admin${suffix}GetOne` })
        async getOne(
            @Arg('id')
            id: string,
        ) {
            let where:ObjectLiteral={}
            where[this.primaryKey]=id
            // @ts-ignore
            return await ORMEntity.findOne({ where })
        }
        // GET_MANY
        @Authorized('admin')
        @Query(type => [objectTypeCls], {
            name: `admin${suffix}GetMany`,
            nullable: true,
        })
        async getMany(
            @Arg('ids', type => [Int])
            ids: number[],
        ) {
            let where:ObjectLiteral={}
            where[this.primaryKey]=In(ids)
            // @ts-ignore
            return await ORMEntity.find({where})
        }
        // GET_MANY_REFERENCE
        @Authorized('admin')
        @Query(type => OutList, {
            name: `admin${suffix}GetManyReference`,
            nullable: true,
        })
        async getManyReference(
            @Arg('params', type => GQLReactAdminGetManyReferenceParams)
            params: GQLReactAdminGetManyReferenceParams,
        ) {
            let where:ObjectLiteral={}
            where[this.primaryKey]=params.id
            let query = createQueryBuilder(ORMEntity, 'entity').where(
                `entity.${params.target}=:${this.primaryKey}`,
                where,
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
        @Mutation(type => objectTypeCls, { name: `admin${suffix}Update` })
        async update(
            @Arg('id', type => Int)
            id: number,
            @Arg('data', type => inputTypeCls)
            data: T2,
        ) {
            let where:ObjectLiteral={}
            where[this.primaryKey]=id
            // @ts-ignore
            let entity = await ORMEntity.findOne({ where })
            if (!entity)
                throw new ApolloError(
                    'Entity not found for id ' + id,
                    'NOT_FOUND',
                )
            await EntityUpdateHelper.update(entity, data,updateHelperOptions)
            await entity.save()
            return entity
        }
        //UPDATE_MANY
        @Authorized('admin')
        @Mutation(type => IdsList, { name: `admin${suffix}UpdateMany` })
        async updateMany(
            @Arg('ids', type => [Int])
            ids: number[],
            @Arg('data', type => inputTypeCls)
            data: T2,
        ) {
            let list = await createQueryBuilder(ORMEntity, entityAlias)
                .whereInIds(ids)
                .getMany()
            for (let entity of list) {
                await EntityUpdateHelper.update(entity, data,updateHelperOptions)
                await entity.save()
            }

            return { ids }
        }
        //CREATE
        @Authorized('admin')
        @Mutation(type => objectTypeCls, { name: `admin${suffix}Create` })
        async create(@Arg('data', type => inputTypeCls) data: T2) {
            // @ts-ignore
            let entity = ORMEntity.create()
            await EntityUpdateHelper.update(entity, data,updateHelperOptions)
            await entity.save()
            return entity
        }
        // DELETE
        @Authorized('admin')
        @Mutation(type => objectTypeCls, { name: `admin${suffix}Delete` })
        async delete(
            @Arg('id', type => Int)
            id: number,
        ) {
            // @ts-ignore
            let entity = await validateEntityRelations(ORMEntity, id,this.primaryKey)
            await entity.remove()
            return entity
        }
        // DELETE_MANY
        @Authorized('admin')
        @Mutation(type => IdsList, { name: `admin${suffix}DeleteMany` })
        async deleteMany(
            @Arg('ids', type => [Int])
            ids: number[],
        ) {
            let errors = []
            let removedIds = []
            for (let id of ids) {
                try {
                    // @ts-ignore
                    let entity = await validateEntityRelations(ORMEntity, id,this.primaryKey)
                    await entity.remove()
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
                        if (ftColumnNames.length > 0)
                            qb.andWhere(
                                `match(${ftColumnNames.join(
                                    ',',
                                )}) against (:ftQuery IN BOOLEAN MODE)`,
                                { ftQuery: `${f.value}*` },
                            )
                    }
                }
            }
        }
        get primaryKey(){
            //@ts-ignore
            const metadata = ORMEntity.getRepository()
                .metadata as EntityMetadata
            return metadata.primaryColumns[0].databaseName
        }
    }

    return BaseResolver
}

export async function validateEntityRelations<ORM extends BaseEntity>(
    entityClass: any,
    id: number,
    primaryKey:string
): Promise<ORM> {
    const metadata = entityClass.getRepository().metadata
    let errors = []
    let rQuery = await createQueryBuilder(entityClass, 'entity').where(
        `entity.${primaryKey}=:id`,
        { id },
    )
    for (let r of metadata.relations) {
        if (
            r.onDelete !== 'CASCADE' &&
            !r.cascade &&
            (Array.isArray(r.cascade) && !r.cascade.includes('remove'))
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
