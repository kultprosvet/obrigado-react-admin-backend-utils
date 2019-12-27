import {GQLReactAdminListParams} from "./GQLReactAdminListParams";
import {GQLReactAdminGetManyReferenceParams} from "./GQLReactAdminGetManyReferenceParams";

import {EntityMetadata, SelectQueryBuilder} from "typeorm";

export  abstract class ReactAdminDataProvider<OrmClass,GQLInput> {
    async getList(
        params: GQLReactAdminListParams,
        context: any
    ): Promise<any> {
        return null
    }

    async getOne(id: string, context?: any): Promise<any> {
        return null
    }

    async getMany(ids: number[], context?: any): Promise<any> {
        return null
    }

    async getManyReference(params: GQLReactAdminGetManyReferenceParams, context?: any): Promise<any> {
        return null
    }

    async update(id: number, data: GQLInput, context?: any): Promise<any> {
        return null
    }

    async updateMany(ids: number[], data: GQLInput, context?: any): Promise<any> {
        return null
    }

    async create(data: GQLInput, context?: any): Promise<any> {
        return null
    }

    async delete(id: number, context?: any): Promise<any> {
        return null
    }

    async deleteMany(ids: number[], context?: any): Promise<any> {
        return null
    }

    alterGetListQuery(
        qb: SelectQueryBuilder<any>,
        params: GQLReactAdminListParams,
    ): void {
        return
    }

   applyFilterToQuery(
        qb: SelectQueryBuilder<OrmClass>,
        params: GQLReactAdminListParams,
        metadata: EntityMetadata,
        context: any
    ): void{

   }

}
