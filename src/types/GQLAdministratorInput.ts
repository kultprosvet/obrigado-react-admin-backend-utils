import {Field, InputType} from "type-graphql";

@InputType('AdministratorInput')
export class GQLAdministratorInput {
    @Field()
    username:string
    @Field({nullable:true})
    last_name:string
    @Field({nullable:true})
    first_name:string
}