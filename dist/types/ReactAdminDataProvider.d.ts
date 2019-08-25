import { GQLReactAdminListParams } from "./GQLReactAdminListParams";
import { GQLReactAdminGetManyReferenceParams } from "./GQLReactAdminGetManyReferenceParams";
import { SelectQueryBuilder } from "typeorm";
export declare abstract class ReactAdminDataProvider {
    getList(params: GQLReactAdminListParams): Promise<any>;
    getOne(id: string): Promise<any>;
    getMany(ids: number[]): Promise<any>;
    getManyReference(params: GQLReactAdminGetManyReferenceParams): Promise<any>;
    update(id: number, data: any): Promise<any>;
    updateMany(ids: number[], data: any): Promise<any>;
    create(data: any): Promise<any>;
    delete(id: number): Promise<any>;
    deleteMany(ids: number[]): Promise<any>;
    alterGetListQuery(qb: SelectQueryBuilder<any>, params: GQLReactAdminListParams): void;
}
