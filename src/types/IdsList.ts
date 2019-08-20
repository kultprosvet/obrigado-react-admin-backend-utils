import {Field, Int, ObjectType} from "type-graphql";

@ObjectType('IdsList')
export class IdsList {
    @Field(type => [Int])
    ids: number
}
