import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType('User')
export class UserGraphQL {
    @Field(type => Int)
    id: number
    @Field(type => Text)
    email: String
    @Field(type => Text, { nullable: true })
    token: string
}