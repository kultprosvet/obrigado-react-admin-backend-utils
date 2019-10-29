"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const apollo_server_errors_1 = require("apollo-server-errors");
const EntityUpdateHelper_1 = require("./EntityUpdateHelper");
const GQLReactAdminListParams_1 = require("./types/GQLReactAdminListParams");
const GQLReactAdminGetManyReferenceParams_1 = require("./types/GQLReactAdminGetManyReferenceParams");
const IdsList_1 = require("./types/IdsList");
const ReactAdminDataProvider_1 = require("./types/ReactAdminDataProvider");
function createBaseCrudResolver(objectTypeCls, inputTypeCls, ORMEntity, updateHelperOptions) {
    //@ts-ignore
    const suffix = ORMEntity.name;
    let entityAlias = suffix.toLowerCase();
    let OutList = class OutList {
    };
    __decorate([
        type_graphql_1.Field(type => [objectTypeCls], { nullable: true }),
        __metadata("design:type", Object)
    ], OutList.prototype, "data", void 0);
    __decorate([
        type_graphql_1.Field(type => type_graphql_1.Int),
        __metadata("design:type", Number)
    ], OutList.prototype, "total", void 0);
    OutList = __decorate([
        type_graphql_1.ObjectType(`${suffix}List`)
    ], OutList);
    let BaseResolver = class BaseResolver extends ReactAdminDataProvider_1.ReactAdminDataProvider {
        // GET LIST
        async getList(params) {
            //@ts-ignore
            const metadata = ORMEntity.getRepository()
                .metadata;
            let query = typeorm_1.createQueryBuilder(ORMEntity, entityAlias);
            if (params.filter) {
                this.applyFilterToQuery(query, params, metadata);
            }
            this.alterGetListQuery(query, params);
            let total = await query.getCount();
            if (params.pagination) {
                query
                    .take(params.pagination.perPage)
                    .skip(params.pagination.perPage *
                    (params.pagination.page - 1));
            }
            if (params.sort) {
                query.orderBy(`${entityAlias}.${params.sort.field}`, 
                //@ts-ignore
                params.sort.order);
            }
            let data = await query.getMany();
            // @ts-ignore
            return { data: data || [], total };
        }
        // GET ONE
        async getOne(id) {
            let where = {};
            where[this.primaryKey] = id;
            // @ts-ignore
            return await ORMEntity.findOne({ where });
        }
        // GET_MANY
        async getMany(ids) {
            let where = {};
            where[this.primaryKey] = typeorm_1.In(ids);
            // @ts-ignore
            return await ORMEntity.find({ where });
        }
        // GET_MANY_REFERENCE
        async getManyReference(params) {
            let where = {};
            where[this.primaryKey] = params.id;
            let query = typeorm_1.createQueryBuilder(ORMEntity, 'entity').where(`entity.${params.target}=:${this.primaryKey}`, where);
            let total = await query.getCount();
            if (params.pagination) {
                query
                    .take(params.pagination.perPage)
                    .skip(params.pagination.perPage *
                    (params.pagination.page - 1));
            }
            if (params.sort) {
                //@ts-ignore
                query.orderBy(params.sort.field, params.sort.order);
            }
            return await { total, data: await query.getMany() };
        }
        // UPDATE
        async update(id, data) {
            let where = {};
            where[this.primaryKey] = id;
            // @ts-ignore
            let entity = await ORMEntity.findOne({ where });
            if (!entity)
                throw new apollo_server_errors_1.ApolloError('Entity not found for id ' + id, 'NOT_FOUND');
            await EntityUpdateHelper_1.EntityUpdateHelper.update(entity, data, updateHelperOptions);
            await entity.save();
            return entity;
        }
        //UPDATE_MANY
        async updateMany(ids, data) {
            let list = await typeorm_1.createQueryBuilder(ORMEntity, entityAlias)
                .whereInIds(ids)
                .getMany();
            for (let entity of list) {
                await EntityUpdateHelper_1.EntityUpdateHelper.update(entity, data, updateHelperOptions);
                await entity.save();
            }
            return { ids };
        }
        //CREATE
        async create(data) {
            // @ts-ignore
            let entity = ORMEntity.create();
            await EntityUpdateHelper_1.EntityUpdateHelper.update(entity, data, updateHelperOptions);
            await entity.save();
            return entity;
        }
        // DELETE
        async delete(id) {
            // @ts-ignore
            let entity = await validateEntityRelations(ORMEntity, id, primaryKey);
            await entity.remove();
            return entity;
        }
        // DELETE_MANY
        async deleteMany(ids) {
            let errors = [];
            let removedIds = [];
            for (let id of ids) {
                try {
                    // @ts-ignore
                    let entity = await validateEntityRelations(ORMEntity, id, this.primaryKey);
                    await entity.remove();
                    removedIds.push(id);
                }
                catch (e) {
                    errors.push(e.message);
                }
            }
            if (errors.length > 0) {
                throw new apollo_server_errors_1.ApolloError(errors.join(';'), 'DELETION_FAILED');
            }
            return { ids: removedIds };
        }
        alterGetListQuery(qb, params) { }
        applyFilterToQuery(qb, params, metadata) {
            if (params.filter) {
                let columnNames = metadata.columns.map(c => c.propertyName);
                for (let f of params.filter) {
                    if (columnNames.includes(f.field)) {
                        let value = {};
                        value[f.field] = f.value;
                        qb.andWhere(`${entityAlias}.${f.field}=:${f.field}`, value);
                    }
                    else if (f.field === 'q') {
                        // build full text  query
                        let ftColumnNames = [];
                        for (let ind of metadata.indices) {
                            if (ind.isFulltext) {
                                for (let column of ind.columns) {
                                    ftColumnNames.push(`${entityAlias}.${column.propertyName}`);
                                }
                            }
                        }
                        if (ftColumnNames.length > 0)
                            qb.andWhere(`match(${ftColumnNames.join(',')}) against (:ftQuery IN BOOLEAN MODE)`, { ftQuery: `${f.value}*` });
                    }
                }
            }
        }
        get primaryKey() {
            //@ts-ignore
            const metadata = ORMEntity.getRepository()
                .metadata;
            return metadata.primaryColumns[0].databaseName;
        }
    };
    __decorate([
        type_graphql_1.Authorized('admin'),
        type_graphql_1.Query(type => OutList, {
            name: `admin${suffix}List`,
        }),
        __param(0, type_graphql_1.Arg('params', type => GQLReactAdminListParams_1.GQLReactAdminListParams)),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [GQLReactAdminListParams_1.GQLReactAdminListParams]),
        __metadata("design:returntype", Promise)
    ], BaseResolver.prototype, "getList", null);
    __decorate([
        type_graphql_1.Authorized('admin'),
        type_graphql_1.Query(type => objectTypeCls, { name: `admin${suffix}GetOne` }),
        __param(0, type_graphql_1.Arg('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], BaseResolver.prototype, "getOne", null);
    __decorate([
        type_graphql_1.Authorized('admin'),
        type_graphql_1.Query(type => [objectTypeCls], {
            name: `admin${suffix}GetMany`,
            nullable: true,
        }),
        __param(0, type_graphql_1.Arg('ids', type => [type_graphql_1.Int])),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], BaseResolver.prototype, "getMany", null);
    __decorate([
        type_graphql_1.Authorized('admin'),
        type_graphql_1.Query(type => OutList, {
            name: `admin${suffix}GetManyReference`,
            nullable: true,
        }),
        __param(0, type_graphql_1.Arg('params', type => GQLReactAdminGetManyReferenceParams_1.GQLReactAdminGetManyReferenceParams)),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [GQLReactAdminGetManyReferenceParams_1.GQLReactAdminGetManyReferenceParams]),
        __metadata("design:returntype", Promise)
    ], BaseResolver.prototype, "getManyReference", null);
    __decorate([
        type_graphql_1.Authorized('admin'),
        type_graphql_1.Mutation(type => objectTypeCls, { name: `admin${suffix}Update` }),
        __param(0, type_graphql_1.Arg('id', type => type_graphql_1.Int)),
        __param(1, type_graphql_1.Arg('data', type => inputTypeCls)),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Object]),
        __metadata("design:returntype", Promise)
    ], BaseResolver.prototype, "update", null);
    __decorate([
        type_graphql_1.Authorized('admin'),
        type_graphql_1.Mutation(type => IdsList_1.IdsList, { name: `admin${suffix}UpdateMany` }),
        __param(0, type_graphql_1.Arg('ids', type => [type_graphql_1.Int])),
        __param(1, type_graphql_1.Arg('data', type => inputTypeCls)),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Object]),
        __metadata("design:returntype", Promise)
    ], BaseResolver.prototype, "updateMany", null);
    __decorate([
        type_graphql_1.Authorized('admin'),
        type_graphql_1.Mutation(type => objectTypeCls, { name: `admin${suffix}Create` }),
        __param(0, type_graphql_1.Arg('data', type => inputTypeCls)),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BaseResolver.prototype, "create", null);
    __decorate([
        type_graphql_1.Authorized('admin'),
        type_graphql_1.Mutation(type => objectTypeCls, { name: `admin${suffix}Delete` }),
        __param(0, type_graphql_1.Arg('id', type => type_graphql_1.Int)),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", Promise)
    ], BaseResolver.prototype, "delete", null);
    __decorate([
        type_graphql_1.Authorized('admin'),
        type_graphql_1.Mutation(type => IdsList_1.IdsList, { name: `admin${suffix}DeleteMany` }),
        __param(0, type_graphql_1.Arg('ids', type => [type_graphql_1.Int])),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], BaseResolver.prototype, "deleteMany", null);
    BaseResolver = __decorate([
        type_graphql_1.Resolver({ isAbstract: true })
    ], BaseResolver);
    return BaseResolver;
}
exports.createBaseCrudResolver = createBaseCrudResolver;
async function validateEntityRelations(entityClass, id, primaryKey) {
    const metadata = entityClass.getRepository().metadata;
    let errors = [];
    let rQuery = await typeorm_1.createQueryBuilder(entityClass, 'entity').where(`entity.${primaryKey}=:id`, { id });
    for (let r of metadata.relations) {
        if (r.onDelete !== 'CASCADE' &&
            !r.cascade &&
            (Array.isArray(r.cascade) && !r.cascade.includes('remove'))) {
            rQuery.loadRelationCountAndMap(`entity.${r.propertyName}_count`, `entity.${r.propertyName}`);
        }
    }
    let dataCounts = await rQuery.getOne();
    for (let r of metadata.relations) {
        //@ts-ignore
        if (!r.isCascadeRemove &&
            dataCounts &&
            // @ts-ignore
            dataCounts[`${r.propertyName}_count`] > 0) {
            //@ts-ignore
            let count = dataCounts[`${r.propertyName}_count`];
            errors.push(`${r.type.name} (${count})`);
        }
    }
    if (errors.length > 0) {
        throw new apollo_server_errors_1.ApolloError(`Entity ${id} has linked data : ${errors.join(',')}, unlink it first`, 'DELETION_FAILED');
    }
    //@ts-ignore
    return dataCounts;
}
exports.validateEntityRelations = validateEntityRelations;
//# sourceMappingURL=BaseAdminResourceResolver.js.map