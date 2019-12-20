import { Resolver } from 'type-graphql'
import { createBaseCrudResolver } from '../../src/BaseAdminResourceResolver'
import { UserGraphQL } from '../graphql/UserGraphQL'
import { UserGraphQLInput } from "../graphql/UserGraphQLInput"
import { User } from '../models/UserEntity'

const UserBaseResolver = createBaseCrudResolver(
    UserGraphQL,
    UserGraphQLInput,
    User
)
@Resolver()
export class _AdminUserResolver extends UserBaseResolver {}