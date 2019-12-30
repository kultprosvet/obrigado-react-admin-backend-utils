import { Field, Int, ObjectType } from "type-graphql";

@ObjectType("Administrator")
export class GQLAdministrator {
  @Field(type => Int)
  id: number;
  @Field()
  username: string;
  @Field({ nullable: true })
  last_name: string;
  @Field({ nullable: true })
  first_name: string;
  @Field({ nullable: true })
  token: string;
  @Field(type => [String], { defaultValue: [] })
  permissions: string[];
  @Field()
  isBlocked: boolean;
}
