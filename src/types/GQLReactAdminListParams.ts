import {Field, InputType} from "type-graphql";
import {GQLReactAdminPagination} from "./GQLReactAdminPagination";
import {GQLReactAdminSort} from "./GQLReactAdminSort";
import {GQLReactAdminFilterParam} from "./GQLReactAdminFilterParam";


@InputType('ReactAdminListParams')
export class GQLReactAdminListParams {
    @Field(type => GQLReactAdminPagination)
    pagination: GQLReactAdminPagination
    @Field(type => GQLReactAdminSort)
    sort: GQLReactAdminSort
    @Field(type => [GQLReactAdminFilterParam], { nullable: true })
    filter: GQLReactAdminFilterParam[]
}