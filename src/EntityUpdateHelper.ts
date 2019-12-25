import {
    BaseEntity,
    createQueryBuilder,
    EntityMetadata,
    ObjectLiteral,
} from 'typeorm'

import { RelationMetadata } from 'typeorm/metadata/RelationMetadata'
import { isObject } from './utils/isObject'
import { ApolloError } from 'apollo-server-errors'
import {GQLFileInput} from "./types/GQLFileInput";
import {FileHandler} from "./types/FileHandler";
export type EntityUpdateHelperOptions={
    ignore: Array<string>,
    fileHandler?:FileHandler
}
export class EntityUpdateHelper<ORM> {
    EntityClass: any
    entity: ORM
    data: any
    options: EntityUpdateHelperOptions
    relations: {
        [key: string]: RelationMetadata
    }
    metadata: EntityMetadata
    static async update<ORM extends BaseEntity>(
        entity: ORM,
        data: any,
        options?:Partial<EntityUpdateHelperOptions>,
    ): Promise<void> {
        const defaultOptions={ ignore: []  }
        let helper = new EntityUpdateHelper()
        helper.entity = entity
        helper.EntityClass = entity.constructor
        helper.data = data
        helper.options = Object.assign( defaultOptions,options || {})
        //@ts-ignore
        return helper._updateEntity()
    }

    constructor() {}
    async _updateEntity(): Promise<void> {
        let { EntityClass, entity, data, options } = this
        const metadata = EntityClass.getRepository().metadata
        this.metadata = metadata
        let relations: ObjectLiteral = {}
        //@ts-ignore
        let isNew = !this.entity.id
        for (let r of metadata.relations) {
            relations[r.propertyName] = r
        }
        let columnNames = this.metadata.columns.map(c => c.propertyName)
        this.relations = relations
        //@ts-ignore
        for (let p: string in data) {
            if (options && options.ignore && options.ignore.includes(p))
                continue
            let fieldName = this.getFieldName(p)
            if (p == 'id') continue
            //handle file upl oad
            if (isFileInput(data[p])){
                 let fileData=data[p] as GQLFileInput
                 if (fileData.skip) continue
                 if (this.options && this.options.fileHandler) {
                     //@ts-ignore
                     if (entity[p] ){
                         //@ts-ignore
                        await this.options.fileHandler.deleteFile(entity[p])
                        //@ts-ignore
                        entity[p]=null
                     }
                     if (fileData.file_name==null && fileData.body==null) continue
                     //@ts-ignore
                     entity[p]=await this.options.fileHandler.saveFile(fileData)
                 }else {
                     throw new Error("Please specify file handler in options")
                 }
                 continue
            }
            //update to many relation
            if (p.endsWith('_ids') && !this.getRelation(fieldName).isCascadeUpdate) {
                if (isNew) {
                    throw new ApolloError(
                        `Unable to set non cascade relation ${this.metadata.name}.${p} for new entity. You need to save the entity first`,
                        'INVALID_DATA',
                    )
                }
                await this.updateRelatedEntitiesByIds(p, data[p])
                continue
            }
            if (p.endsWith('_ids') && this.getRelation(fieldName).isCascadeUpdate) {
                await this.updateRelatedEntitiesByIdsCascade(p, data[p])
                continue
            }
            if (Array.isArray(data[p])) {
                if (this.getRelation(fieldName).isCascadeUpdate) {
                    await this.updateRelationsEntitiesCascade(p, data[p])
                } else {
                    if (isNew) {
                        throw new ApolloError(
                            `Unable to set non cascade relation ${this.metadata.name}.${p} for new entity. You need to save the entity first`,
                            'INVALID_DATA',
                        )
                    }
                    await this.updateRelationsEntities(p, data[p])
                }
                continue
            }
            if (isObject(data[p])) {
                if (this.getRelation(fieldName).isCascadeUpdate) {
                    //@ts-ignore
                    entity[p] = data[p]
                } else {
                    if (isNew) {
                        throw new ApolloError(
                            `Unable to set non cascade relation ${this.metadata.name}.${p} for new entity. You need to save the entity first`,
                            'INVALID_DATA',
                        )
                    }
                    await this.updateRelatedEntity(p, data[p])
                }
                continue
            }
            //set single property
            if (!columnNames.includes(p)) {
                throw new ApolloError(
                    `Entity ${this.metadata.name}.${p} doesn't have column ${p}`,
                    'INVALID_DATA',
                )
            }
            //@ts-ignore
            entity[p] = data[p]
        }
    }


    async updateRelatedEntitiesByIds(field: string, ids: []) {
        let fieldName = this.getFieldName(field)
        //update relation
        let currentRelations = await createQueryBuilder()
            .relation(this.EntityClass, fieldName)
            .of(this.entity)
            .loadMany()
        let newIds = ids.map((id: any) => parseInt(id))
        let currentIds = currentRelations.map(r => parseInt(r.id))
        // id to add
        let idsToAdd = []
        for (let id of newIds) {
            if (!currentIds.includes(id)) {
                idsToAdd.push(id)
            }
        }
        let idsToRemove = []
        for (let id of currentIds) {
            if (!newIds.includes(id)) {
                idsToRemove.push(id)
            }
        }
        if (idsToAdd.length > 0)
            await createQueryBuilder()
                .relation(this.EntityClass, fieldName)
                .of(this.entity)
                .add(idsToAdd.map(id => ({ id })))
        if (idsToRemove.length > 0)
            await createQueryBuilder()
                .relation(this.EntityClass, fieldName)
                .of(this.entity)
                .remove(idsToRemove.map(id => ({ id })))
    }
    async updateRelatedEntitiesByIdsCascade(field: string, ids: []) {
        let fieldName = this.getFieldName(field)
        let relation = this.getRelation(fieldName)
        //update to One relation
        this.setEntityRelationValue(
            fieldName,
            ids.map(id => {
                //@ts-ignore
                let newRelatedEntity = new relation.type()
                newRelatedEntity.id = id
                return newRelatedEntity
            }),
        )
    }
    async updateRelationsEntitiesCascade(field: string, value: any[]) {
        let relatedEntities: any
        //@ts-ignore
        if (this.entity[field] instanceof Promise) {
            //@ts-ignore
            relatedEntities = await this.entity[field]
        } else {
            //@ts-ignore
            relatedEntities = this.entity[field]
        }
        relatedEntities = relatedEntities ? relatedEntities : []
        let newIds = value.map((item: any) => parseInt(item.id))
        let currentIds = relatedEntities.map((r: any) => parseInt(r.id))
        let dataMap = this.arrayToObject(value)
        //remove entities
        relatedEntities = relatedEntities.filter((entity: any) =>
            newIds.includes(parseInt(entity.id)),
        )
        //update
        for (let entity of relatedEntities) {
            await EntityUpdateHelper.update(entity, dataMap[entity.id])
        }
        //add new one
        for (let entity of value) {
            if (!currentIds.includes(entity.id)) {
                relatedEntities.push(entity)
            }
        }
        this.setEntityRelationValue(field, relatedEntities)
    }
    async updateRelationsEntities(field: string, value: any[]) {
        let relation = this.getRelation(field)
        let relatedEntities = await createQueryBuilder()
            .relation(this.EntityClass, field)
            .of(this.entity)
            .loadMany()
        relatedEntities = relatedEntities ? relatedEntities : []
        let newIds = value.map((item: any) => parseInt(item.id))
        let currentIds = relatedEntities.map(r => parseInt(r.id))
        // remove entities
        relatedEntities.filter(relatedEntity => {
            return newIds.includes(parseInt(relatedEntity.id))
        })
        let idsToRemove = []
        for (let id of currentIds) {
            if (!newIds.includes(id)) {
                idsToRemove.push(id)
            }
        }
        if (idsToRemove.length > 0)
            await createQueryBuilder(relation.type, 'r')
                .whereInIds(idsToRemove)
                .delete()
        //update current
        let dataToUpdate = this.arrayToObject(value)
        for (let relatedEntity of relatedEntities) {
            await EntityUpdateHelper.update(
                relatedEntity,
                dataToUpdate[relatedEntity.id],
            )
            await relatedEntity.save()
        }
        //add new one,

        for (let id of newIds) {
            if (!currentIds.includes(id)) {
                //@ts-ignore
                let newRelatedEntity = new relation.type()
                await EntityUpdateHelper.update(
                    newRelatedEntity,
                    dataToUpdate[id],
                )
                if (relation.inverseSidePropertyPath) {
                    throw new Error(
                        //@ts-ignore
                        `Please add inverse relation property for ${this.metadata.name} inside ${relation.type.name}`,
                    )
                }
                newRelatedEntity[relation.inverseSidePropertyPath] = this.entity
                await newRelatedEntity.save()
            }
        }
    }
    async updateRelatedEntity(field: string, value: any) {
        let relation = this.getRelation(field)
        let relatedEntity = await createQueryBuilder()
            .relation(this.EntityClass, field)
            .of(this.entity)
            .loadOne()
        if (!relatedEntity) {
            //@ts-ignore
            relatedEntity = new relation.type()
            await EntityUpdateHelper.update(relatedEntity, value)
            if (!relation.inverseSidePropertyPath) {
                throw new Error(
                    //@ts-ignore
                    `Please add inverse relation property for ${this.metadata.name}.${field} inside ${relation.type.name}`,
                )
            }
            relatedEntity[relation.inverseSidePropertyPath] = this.entity
            await relatedEntity.save()
        } else {
            await EntityUpdateHelper.update(relatedEntity, value)
        }
        this.setEntityRelationValue(field, relatedEntity)
    }
    setEntityRelationValue(field: string, value: any) {
        //@ts-ignore
        if (this.entity[field] instanceof Promise) {
            //@ts-ignore
            this.entity[field] = Promise.resolve(value)
        } else {
            //@ts-ignore
            this.entity[field] = value
        }
    }
    arrayToObject(data: Array<any>, key: string = 'id') {
        let out: ObjectLiteral = {}
        for (let item of data) {
            out[item[key]] = Object.assign({}, item)
        }
        return out
    }
    getFieldName(f: string): string {
        if (f.endsWith('_file')) {
            return f.substr(0, f.length - 5)
        }
        if (f.endsWith('_id')) {
            return f.substr(0, f.length - 3)
        }
        if (f.endsWith('_ids')) {
            return f.substr(0, f.length - 4)
        }
        return f
    }
    getRelation(fieldName: string) {
        if (this.relations[fieldName]) {
            return this.relations[fieldName]
        }
        throw new Error(
            `Unable to find relation for ${fieldName} in ${this.metadata.name}`,
        )
    }
}
function isFileInput(obj: any): obj is GQLFileInput {
    if (!obj) return false
    if (typeof obj!=='object') return false
    const fileProps=['body','file_name','skip']
    for (let p in obj){
        if (!fileProps.includes(p)) return false
    }
    if (obj.body==undefined && obj.skip==undefined) return false;
    return true
}
