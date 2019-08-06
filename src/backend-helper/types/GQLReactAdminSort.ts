import {Field, InputType} from "type-graphql";

@InputType('ReactAdminSort')
export class GQLReactAdminSort {
    @Field()
    field: string
    @Field()
    order: string
}