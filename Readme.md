Set of helpers for [React Admin](https://github.com/marmelab/react-admin)\
To speed up admin panel development use [obrigado frontend helpers](https://github.com/kultprosvet/obrigado-react-admin-frontend-utils)
# Requirments
+ Typeorm
+ Typegraphql
# Installation
Install package:
```
npm install obrigado-react-admin-backend-utils
```
or
```
yarn add obrigado-react-admin-backend-utils
```
# Authorization setup
If want to use default auth 
1. Configure typeorm:\
Add path to entities:\
node_modules/obrigado-react-admin-backend-utils/dist/models/\*.js\
example:
```javascript
entities: ['app/database/models/*.ts',
'node_modules/obrigado-react-admin-backend-utils/dist/models/*.js'] 
```
2. Add path to migrations:\
*node_modules/obrigado-react-admin-backend-utils/dist/migrations/\*.js*   
example:
```javascript
  migrations:[ 'app/database/migrations/*.ts',
  'node_modules/obrigado-react-admin-backend-utils/dist/migrations/*.js'], 
```
3. Add helpers to server config 
```javascript
import {
    AdminAuthResolver,
    AdminDataResolver,
    getAdministratorData,
} from 'obrigado-react-admin-backend-utils'
...
   const schema = await buildSchema({
        resolvers: [
            __dirname + '/graphql/resolvers/*.ts',
            __dirname + '/graphql/resolvers/admin/*.ts',
            AdminAuthResolver,AdminDataResolver //  <---
        ],
        authChecker,
    })
     const server = new ApolloServer({
        schema: schema,
        cors: {
            credentials: true,
            origin: function(origin, callback) {
                callback(null, true)
            },
        },
        context: async (session: any) => {
            return {
                session,
                user: getUserInfo(session.req),
                ...getAdministratorData(session.req), // <----
            }
        },
    })
```
4. Add  admin user checks to auth checker
```javascript
import { AuthChecker } from 'type-graphql'
import { authCheckerAdmin } from 'obrigado-react-admin-backend-utils'

export const authChecker: AuthChecker<any> = (
    { root, args, context, info },
    roles
) => {
    // Verify admin user permissions
    if (authCheckerAdmin({ root, args, context, info }, roles)) {
        return true
    }
    if (!context.user && !context.administrator) return false

    if (!roles || roles.length == 0) {
        return true
    }

    return roles.includes(context.user.type)
}
```
# Generating resolvers for your entities
The obrigado-react-admin-backend-utils package allows you to automatically create all necessary resolvers for React Admin with the help of createBaseCrudResolver function. It takes your GraphQL object and input types and TypeORM entity as arguments.

Let's say you want to create a User entity in your project.
You will need to create an object GraphQL type (GraphQLModelClass) that will be used for information output:
```javascript
import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType('User')
export class UserGraphQL {
    @Field(type => Int)
    id: number
    @Field(type => Text)
    email: string
    @Field(type => Text, { nullable: true })
    token: string
}
```
You also need to create an input GraphQL type (GraphQLInputClass) that describes incoming data:
```javascript
import { Field, InputType, Text } from 'type-graphql'

@InputType('UserInput')
export class UserGraphQLInput {
    @Field(type => Text)
    email: string
    @Field(type => Text)
    password: string
}
```
Finally, create a TypeORM entity (TypeORMEntityClass) that describes how User is stored in your database:
```javascript
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    email: string
    @Column()
    password: string
}
```
  
Now you can call createBaseCrudResolver(GraphQLModelClass, GraphQLInputClass, TypeORMEntityClass) to generate resolver class for User entity:
```javascript
import { Resolver } from 'type-graphql'
import { createBaseCrudResolver } from 'obrigado-react-admin-backend-utils'
import { UserGraphQL } from '../graphql/UserGraphQL'
import { UserGraphQLInput } from "../graphql/UserGraphQLInput"
import { User } from '../models/UserEntity'

const UserBaseResolver = createBaseCrudResolver(
    UserGraphQL,
    UserGraphQLInput,
    User
)
@Resolver()
export class _UserResolver extends UserBaseResolver {}
```
This will generate a resolver with following methods:
+ adminUserGetList
+ adminUserGetOne
+ adminUserCreate
+ adminUserUpdate
+ adminUserUpdateMany
+ adminUserGetManyReference
+ adminUserDelete
+ adminUserDeleteMany

### Entities with file handling
If you want your entity to handle files as well you can pass options with File Handler to createBaseCrudResolver as a last argument. 

You can find more on how to configure available File Handlers here:
+ [File Handlers](doc/FileHandlers.md)

### Creating or re-defining resolver methods
On top of the existing methods you can add your own methods or re-define already existing ones.

If you want to implement your own filter logic you can redefine applyFilterToQuery method that is added to your entity by createBaseCrudResolver function. By default this method does full-text search.

You can also re-define existing methods in AdminAuthResolver and AdminDataResolver to implement you own authentication logic.

AdminAuthResolver and AdminDataResolver have the following methods:
+ adminLogin
+ adminCheck
+ adminLogOut
+ update
+ create

By default admin is authorized by JWT token that is saved in cookies.

### Roles & permissions
You can define roles and permissions in RoleConfig. Pass an array of objects containing roles and arrays with permissions to initialize it. 

```javascript
import {RoleConfig} from 'obrigado-react-admin-backend-utils'
const roles:Array<Role>=[
    {name: 'admin', permissions: ['create administrators', 'edit administrators']},
    {name: 'moderator', permissions: ['edit something']},
    {name: 'user', permissions: ['view something']}
    ]
RoleConfig.init(roles)    
```

If the admin's role is not specified RoleConfig will assign them the first role of the array ("amdin" role by default).

The following resolvers are available in AdminDataResolver:
+ getRoles (returns a list of all existing roles);
+ permissions (returns an array of admin's permissions);
+ role (returns admin's role).
