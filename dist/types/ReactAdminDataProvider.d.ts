import { GQLReactAdminListParams } from "./GQLReactAdminListParams";
import { GQLReactAdminGetManyReferenceParams } from "./GQLReactAdminGetManyReferenceParams";
import { SelectQueryBuilder } from "typeorm";
export declare abstract class ReactAdminDataProvider {
    abstract getList(params: GQLReactAdminListParams): any;
    abstract getOne(id: string): Promise<any>;
    abstract getMany(ids: number[]): Promise<any>;
    abstract getManyReference(params: GQLReactAdminGetManyReferenceParams): Promise<any>;
    abstract update(id: number, data: any): Promise<any>;
    abstract updateMany(ids: number[], data: any): Promise<any>;
    abstract create(data: any): Promise<any>;
    abstract delete(id: number): Promise<any>;
    abstract deleteMany(ids: number[]): Promise<any>;
    abstract alterGetListQuery(qb: SelectQueryBuilder<any>, params: GQLReactAdminListParams): void;
}
