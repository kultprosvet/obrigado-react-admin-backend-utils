import {Field, InputType} from "type-graphql";
import {GQLReactAdminPagination} from "./GQLReactAdminPagination";
import {GQLReactAdminSort} from "./GQLReactAdminSort";
import {GQLReactAdminFilterParam} from "./GQLReactAdminFilterParam";

@InputType('ReactAdminGetManyReferenceParams')
export class GQLReactAdminGetManyReferenceParams {
    @Field()
    id: number
    @Field()
    target: string
    @Field(type => GQLReactAdminPagination)
    pagination: GQLReactAdminPagination
    @Field(type => GQLReactAdminSort)
    sort: GQLReactAdminSort
    @Field(type => [GQLReactAdminFilterParam], { nullable: true })
    filter: GQLReactAdminFilterParam
    @Field({nullable:true,deprecationReason:"This parameter is present for compatibility with react admin v2 "})
    source:string
}
