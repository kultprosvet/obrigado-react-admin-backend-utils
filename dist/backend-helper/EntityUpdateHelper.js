"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const saveFile_1 = require("./utils/saveFile");
const isObject_1 = require("./utils/isObject");
const apollo_server_1 = require("apollo-server");
class EntityUpdateHelper {
    constructor() { }
    static async update(entity, data, options) {
        const defaultOptions = { ignore: [], fileSavePath: null };
        let helper = new EntityUpdateHelper();
        helper.entity = entity;
        helper.EntityClass = entity.constructor;
        helper.data = data;
        helper.options = Object.assign(defaultOptions, options);
        //@ts-ignore
        return helper._updateEntity();
    }
    async _updateEntity() {
        let { EntityClass, entity, data, options } = this;
        const metadata = EntityClass.getRepository().metadata;
        this.metadata = metadata;
        let relations = {};
        //@ts-ignore
        let isNew = !this.entity.id;
        for (let r of metadata.relations) {
            relations[r.propertyName] = r;
        }
        let columnNames = this.metadata.columns.map(c => c.propertyName);
        this.relations = relations;
        //@ts-ignore
        for (let p in data) {
            if (options && options.ignore && options.ignore.includes(p))
                continue;
            let fieldName = this.getFieldName(p);
            if (p == 'id')
                continue;
            //handle file upload
            if (p.endsWith('_file')) {
                if (!data[p])
                    continue;
                this.saveFileField(p, data[p]);
                continue;
            }
            if (p.endsWith('_id') && !relations[fieldName].isCascadeUpdate) {
                await this.updateRelationById(p, data[p]);
                continue;
            }
            if (p.endsWith('_id') && relations[fieldName].isCascadeUpdate) {
                await this.updateRelationByIdCascade(p, data[p]);
                continue;
            }
            //update to many relation
            if (p.endsWith('_ids') && !relations[fieldName].isCascadeUpdate) {
                if (isNew) {
                    throw new apollo_server_1.ApolloError(`Unable to set non cascade relation ${this.metadata.name}.${p} for new entity. You need to save the entity first`, 'INVALID_DATA');
                }
                await this.updateRelatedEntitiesByIds(p, data[p]);
                continue;
            }
            if (p.endsWith('_ids') && relations[fieldName].isCascadeUpdate) {
                await this.updateRelatedEntitiesByIdsCascade(p, data[p]);
                continue;
            }
            if (Array.isArray(data[p])) {
                if (this.relations[fieldName].isCascadeUpdate) {
                    await this.updateRelationsEntitiesCascade(p, data[p]);
                }
                else {
                    if (isNew) {
                        throw new apollo_server_1.ApolloError(`Unable to set non cascade relation ${this.metadata.name}.${p} for new entity. You need to save the entity first`, 'INVALID_DATA');
                    }
                    await this.updateRelationsEntities(p, data[p]);
                }
                continue;
            }
            if (isObject_1.isObject(data[p])) {
                if (relations[fieldName].isCascadeUpdate) {
                    //@ts-ignore
                    entity[p] = data[p];
                }
                else {
                    if (isNew) {
                        throw new apollo_server_1.ApolloError(`Unable to set non cascade relation ${this.metadata.name}.${p} for new entity. You need to save the entity first`, 'INVALID_DATA');
                    }
                    await this.updateRelatedEntity(p, data[p]);
                }
                continue;
            }
            //set single property
            if (!columnNames.includes(p)) {
                throw new apollo_server_1.ApolloError(`Entity ${this.metadata.name}.${p} doesn't have column ${p}`, 'INVALID_DATA');
            }
            //@ts-ignore
            entity[p] = data[p];
        }
    }
    saveFileField(field, value) {
        let fieldName = field.substr(0, field.length - 5);
        if (!this.options.fileSavePath)
            throw new Error("Please specify filesSavePath in helper options");
        //@ts-ignore
        this.entity[fieldName] = saveFile_1.saveFile(value, `${this.options.fileSavePath}`);
    }
    async updateRelationById(field, value) {
        let fieldName = field.substr(0, field.length - 3);
        //update to One relation
        await typeorm_1.createQueryBuilder()
            .relation(this.EntityClass, fieldName)
            .of(this.entity)
            .set(value);
    }
    async updateRelationByIdCascade(field, value) {
        let fieldName = field.substr(0, field.length - 3);
        let relation = this.relations[fieldName];
        //@ts-ignore
        let newRelatedEntity = new relation.type();
        newRelatedEntity.id = value;
        //update to One relation
        this.setEntityRelationValue(fieldName, newRelatedEntity);
    }
    async updateRelatedEntitiesByIds(field, ids) {
        let fieldName = field.substr(0, field.length - 4);
        //update relation
        let currentRelations = await typeorm_1.createQueryBuilder()
            .relation(this.EntityClass, fieldName)
            .of(this.entity)
            .loadMany();
        let newIds = ids.map((id) => parseInt(id));
        let currentIds = currentRelations.map(r => parseInt(r.id));
        // id to add
        let idsToAdd = [];
        for (let id of newIds) {
            if (!currentIds.includes(id)) {
                idsToAdd.push(id);
            }
        }
        let idsToRemove = [];
        for (let id of currentIds) {
            if (!newIds.includes(id)) {
                idsToRemove.push(id);
            }
        }
        if (idsToAdd.length > 0)
            await typeorm_1.createQueryBuilder()
                .relation(this.EntityClass, fieldName)
                .of(this.entity)
                .add(idsToAdd.map(id => ({ id })));
        if (idsToRemove.length > 0)
            await typeorm_1.createQueryBuilder()
                .relation(this.EntityClass, fieldName)
                .of(this.entity)
                .remove(idsToRemove.map(id => ({ id })));
    }
    async updateRelatedEntitiesByIdsCascade(field, ids) {
        let fieldName = field.substr(0, field.length - 4);
        let relation = this.relations[fieldName];
        //update to One relation
        this.setEntityRelationValue(fieldName, ids.map(id => {
            //@ts-ignore
            let newRelatedEntity = new relation.type();
            newRelatedEntity.id = id;
            return newRelatedEntity;
        }));
    }
    async updateRelationsEntitiesCascade(field, value) {
        let relatedEntities;
        //@ts-ignore
        if (this.entity[field] instanceof Promise) {
            //@ts-ignore
            relatedEntities = await this.entity[field];
        }
        else {
            //@ts-ignore
            relatedEntities = this.entity[field];
        }
        relatedEntities = relatedEntities ? relatedEntities : [];
        let newIds = value.map((item) => parseInt(item.id));
        let currentIds = relatedEntities.map((r) => parseInt(r.id));
        let dataMap = this.arrayToObject(value);
        //remove entities
        relatedEntities = relatedEntities.filter((entity) => newIds.includes(parseInt(entity.id)));
        //update
        for (let entity of relatedEntities) {
            await EntityUpdateHelper.update(entity, dataMap[entity.id]);
        }
        //add new one
        for (let entity of value) {
            if (!currentIds.includes(entity.id)) {
                relatedEntities.push(entity);
            }
        }
        this.setEntityRelationValue(field, relatedEntities);
    }
    async updateRelationsEntities(field, value) {
        let relation = this.relations[field];
        let relatedEntities = await typeorm_1.createQueryBuilder()
            .relation(this.EntityClass, field)
            .of(this.entity)
            .loadMany();
        relatedEntities = relatedEntities ? relatedEntities : [];
        let newIds = value.map((item) => parseInt(item.id));
        let currentIds = relatedEntities.map(r => parseInt(r.id));
        // remove entities
        relatedEntities.filter(relatedEntity => {
            return newIds.includes(parseInt(relatedEntity.id));
        });
        let idsToRemove = [];
        for (let id of currentIds) {
            if (!newIds.includes(id)) {
                idsToRemove.push(id);
            }
        }
        if (idsToRemove.length > 0)
            await typeorm_1.createQueryBuilder(relation.type, 'r')
                .whereInIds(idsToRemove)
                .delete();
        //update current
        let dataToUpdate = this.arrayToObject(value);
        for (let relatedEntity of relatedEntities) {
            await EntityUpdateHelper.update(relatedEntity, dataToUpdate[relatedEntity.id]);
            await relatedEntity.save();
        }
        //add new one,
        for (let id of newIds) {
            if (!currentIds.includes(id)) {
                //@ts-ignore
                let newRelatedEntity = new relation.type();
                await EntityUpdateHelper.update(newRelatedEntity, dataToUpdate[id]);
                if (relation.inverseSidePropertyPath) {
                    throw new Error(
                    //@ts-ignore
                    `Please add inverse relation property for ${this.metadata.name} inside ${relation.type.name}`);
                }
                newRelatedEntity[relation.inverseSidePropertyPath] = this.entity;
                await newRelatedEntity.save();
            }
        }
    }
    async updateRelatedEntity(field, value) {
        let relation = this.relations[field];
        let relatedEntity = await typeorm_1.createQueryBuilder()
            .relation(this.EntityClass, field)
            .of(this.entity)
            .loadOne();
        if (!relatedEntity) {
            //@ts-ignore
            relatedEntity = new relation.type();
            await EntityUpdateHelper.update(relatedEntity, value);
            if (!relation.inverseSidePropertyPath) {
                throw new Error(
                //@ts-ignore
                `Please add inverse relation property for ${this.metadata.name}.${field} inside ${relation.type.name}`);
            }
            relatedEntity[relation.inverseSidePropertyPath] = this.entity;
            await relatedEntity.save();
        }
        else {
            await EntityUpdateHelper.update(relatedEntity, value);
        }
        this.setEntityRelationValue(field, relatedEntity);
    }
    setEntityRelationValue(field, value) {
        //@ts-ignore
        if (this.entity[field] instanceof Promise) {
            //@ts-ignore
            this.entity[field] = Promise.resolve(value);
        }
        else {
            //@ts-ignore
            this.entity[field] = value;
        }
    }
    arrayToObject(data, key = 'id') {
        let out = {};
        for (let item of data) {
            out[item[key]] = Object.assign({}, item);
        }
        return out;
    }
    getFieldName(f) {
        if (f.endsWith('_file')) {
            return f.substr(0, f.length - 5);
        }
        if (f.endsWith('_id')) {
            return f.substr(0, f.length - 3);
        }
        if (f.endsWith('_ids')) {
            return f.substr(0, f.length - 4);
        }
        return f;
    }
}
exports.EntityUpdateHelper = EntityUpdateHelper;
//# sourceMappingURL=EntityUpdateHelper.js.map