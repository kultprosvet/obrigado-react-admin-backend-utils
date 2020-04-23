import {Field, ObjectType} from "type-graphql";

@ObjectType("AdminRole")
export class GQLAdminRole {
    @Field()
    id:string
    @Field({nullable:true})
    name:string
}