import { Field, InputType, Text } from 'type-graphql'

@InputType('UserInput')
export class UserGraphQLInput {
    @Field(type => Text)
    email: string
    @Field(type => Text)
    password: string
}