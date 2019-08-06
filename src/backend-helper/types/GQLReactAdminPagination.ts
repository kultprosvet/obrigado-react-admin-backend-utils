import {Field, InputType, Int} from "type-graphql";

@InputType('ReactAdminPagination')
export class GQLReactAdminPagination {
    @Field(type => Int)
    page: number
    @Field(type => Int)
    perPage: number
}