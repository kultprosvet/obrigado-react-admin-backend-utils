import {Field, InputType} from "type-graphql";

@InputType('FileInput')
export class GQLFileInput {
    @Field({nullable:true})
    file_name: string
    @Field()
    body: string
}