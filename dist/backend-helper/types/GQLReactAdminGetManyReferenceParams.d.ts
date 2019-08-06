import { GQLReactAdminPagination } from "./GQLReactAdminPagination";
import { GQLReactAdminSort } from "./GQLReactAdminSort";
import { GQLReactAdminFilterParam } from "./GQLReactAdminFilterParam";
export declare class GQLReactAdminGetManyReferenceParams {
    id: number;
    target: string;
    pagination: GQLReactAdminPagination;
    sort: GQLReactAdminSort;
    filter: GQLReactAdminFilterParam;
}
