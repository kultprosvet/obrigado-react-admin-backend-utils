Set of helpers for [React Admin](https://github.com/marmelab/react-admin)\
To speed up admin panel development use [obrigado frontend helpers](https://github.com/kultprosvet/obrigado-react-admin-frontend-utils)
# Requirments
+ Typeorm
+ Typegraphql
+ bcrypt (if you are goind to use auth )
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
    getAdministratorData,
} from 'obrigado-react-admin-backend-utils'
import { AdminDataResolver } from 'obrigado-react-admin-backend-utils/dist/resolvers/AdminDataResolver'
import { AdminAuthResolver } from 'obrigado-react-admin-backend-utils/dist/resolvers/AdminAuthResolver'
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
import { createAdminResolver } from 'obrigado-react-admin-backend-utils'
import { UserGraphQL } from '../graphql/UserGraphQL'
import { UserGraphQLInput } from "../graphql/UserGraphQLInput"
import { User } from '../models/UserEntity'

const UserBaseResolver == createAdminResolver(
                            {
                                entity:User,
                                return:UserGraphQL,
                                create:UserGraphQLInput,
                            }) 
@Resolver()
export class _UserResolver extends UserBaseResolver {}
```
This will generate a resolver with following graphql mutation and queries:
+ adminUserGetList
+ adminUserGetOne
+ adminUserCreate
+ adminUserUpdate
+ adminUserUpdateMany
+ adminUserGetManyReference
+ adminUserDelete
+ adminUserDeleteMany
### createAdminResolver config params
| param  | required |description   |
|---|---|------|
| entity  | yes   | TypeOrm entity class|
| return  | yes   | TypeGraphQL ObjectType returned by getList,getOne,getMany|
| create  | yes   | TypeGraphQL InputType param for create |
| update  | no    | TypeGraphQL InputType param for update, if not specified create is used|
| name    | no    | string name part of generated method, if not specified entity name is used. Example: admin\[Name\]UpdateMany
|updateHelperOptions| no| UpdateHelper options : {ignore,fileHandler}. ignore: string[] - list of fields to ignore. fileHandler - handler class for files processing|
### Overriding AdminResolver methods
createAdminResolver generates class with  the following methods
| definitions methods| implementation methods|
|--------------------|-----------------------|
| getListQuery       | getList               |
| getOneQuery        | getOne                |
| getManyQuery       | getMany               |
| getManyReferenceQuery| getManyReference    |
| createMutation     | create                |
| updateMutation     | update                |
| updateManyMutation | updateMany            |
| deleteMutation     | delete                |
| deleteManyMutation | deleteMany            |

"Defenition" methods calls implementations methods with same params and contains only typegraphql decorators.
So if you want to override logic override implementation methods (most of your cases):
```javascript
const UserBaseResolver == createAdminResolver(
                            {
                                entity:User,
                                return:UserGraphQL,
                                create:UserGraphQLInput,
                            }) 
@Resolver()
export class _UserResolver extends UserBaseResolver {
            async getList( params: GQLReactAdminListParams,  context:any){
            // your logic 
            }
}
```
As you can see you don't need to put typegraphl decorators.
If want to override method name in graphql, auth logic etc, then you need to override definition method:
```javascript
 export class _UserResolver extends UserBaseResolver {
        @Authorized('admin')
         @Query(type =>UserList, {
             name: `adminUserList`,
         })
         async getListQuery(
             @Arg('params', type => GQLReactAdminListParams)
                 params: GQLReactAdminListParams,
             @Ctx() context:any
         ) {
             return this.getList(params,context)
         }
          
 }
```
 if you want to alter filtering login in getList you don't need to override whole method, just override  alterGetListQuery
### Entities with file handling
If you want your entity to handle files as well you can pass options with File Handler to createBaseCrudResolver as a last argument. 

You can find more on how to configure available File Handlers here:
+ [File Handlers](doc/FileHandlers.md)

### Creating or re-defining resolver methods in AdminsResolvers

You can  re-define existing methods in AdminAuthResolver and AdminDataResolver to implement you own authentication logic.
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
