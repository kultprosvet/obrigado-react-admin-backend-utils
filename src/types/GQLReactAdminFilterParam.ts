import {Field, InputType} from "type-graphql";

@InputType('ReactAdminFilterParam')
export class GQLReactAdminFilterParam {
    @Field()
    field: string
    @Field()
    value: string
}