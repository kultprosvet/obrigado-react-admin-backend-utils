import { GQLReactAdminListParams } from "./GQLReactAdminListParams";
import { GQLReactAdminGetManyReferenceParams } from "./GQLReactAdminGetManyReferenceParams";
import { EntityMetadata, SelectQueryBuilder } from "typeorm";
export declare abstract class ReactAdminDataProvider<OrmClass, GQLInput> {
    getList(params: GQLReactAdminListParams, context: any): Promise<any>;
    getOne(id: string, context?: any): Promise<any>;
    getMany(ids: number[], context?: any): Promise<any>;
    getManyReference(params: GQLReactAdminGetManyReferenceParams, context?: any): Promise<any>;
    update(id: number, data: GQLInput, context?: any): Promise<any>;
    updateMany(ids: number[], data: GQLInput, context?: any): Promise<any>;
    create(data: GQLInput, context?: any): Promise<any>;
    delete(id: number, context?: any): Promise<any>;
    deleteMany(ids: number[], context?: any): Promise<any>;
    alterGetListQuery(qb: SelectQueryBuilder<any>, params: GQLReactAdminListParams): void;
    applyFilterToQuery(qb: SelectQueryBuilder<OrmClass>, params: GQLReactAdminListParams, metadata: EntityMetadata, context: any): void;
}
