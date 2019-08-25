import {Field, ObjectType} from "type-graphql";

@ObjectType("LogoutResult")
export class GQLLogoutResult {
    @Field()
    message:string
    @Field()
    code:string
}