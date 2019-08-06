import {GQLReactAdminListParams} from "./GQLReactAdminListParams";
import {GQLReactAdminGetManyReferenceParams} from "./GQLReactAdminGetManyReferenceParams";

import {SelectQueryBuilder} from "typeorm";

export  abstract class ReactAdminDataProvider {
    abstract getList(
        params: GQLReactAdminListParams,
    ): any

    abstract async getOne(id: string): Promise<any>

    abstract async getMany(ids: number[]): Promise<any>

    abstract async getManyReference(params: GQLReactAdminGetManyReferenceParams): Promise<any>

    abstract async update(id: number, data: any): Promise<any>

    abstract async updateMany(ids: number[], data: any): Promise<any>

    abstract async create(data: any): Promise<any>

    abstract async delete(id: number): Promise<any>

    abstract async deleteMany(ids: number[]): Promise<any>

    abstract alterGetListQuery(
        qb: SelectQueryBuilder<any>,
        params: GQLReactAdminListParams,
    ): void
}
