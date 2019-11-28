import {Field, InputType} from "type-graphql";

@InputType('FileInput')
export class GQLFileInput {
    @Field({nullable:true,description:"name of the file, set null if you want to delete current file"})
    file_name: string
    @Field({description:"File body in base64 encoding,set null if you want to delete current file",nullable:true})
    body: string
    @Field({defaultValue:false,description:"Set this to true if you want to leave current file unchanged"})
    skip:boolean
}