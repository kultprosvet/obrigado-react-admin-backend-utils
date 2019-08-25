import {GQLReactAdminListParams} from "./GQLReactAdminListParams";
import {GQLReactAdminGetManyReferenceParams} from "./GQLReactAdminGetManyReferenceParams";

import {SelectQueryBuilder} from "typeorm";

export  abstract class ReactAdminDataProvider {
     async getList(
        params: GQLReactAdminListParams,
    ): Promise<any> {return  null}

     async getOne(id: string): Promise<any>{return  null}

     async getMany(ids: number[]): Promise<any>{return  null}

     async getManyReference(params: GQLReactAdminGetManyReferenceParams): Promise<any>{return  null}

     async update(id: number, data: any): Promise<any>{return  null}

     async updateMany(ids: number[], data: any): Promise<any>{return  null}

     async create(data: any): Promise<any>{return  null}

     async delete(id: number): Promise<any>{return  null}

     async deleteMany(ids: number[]): Promise<any>{return  null}

     alterGetListQuery(
        qb: SelectQueryBuilder<any>,
        params: GQLReactAdminListParams,
    ): void{return  }
}
