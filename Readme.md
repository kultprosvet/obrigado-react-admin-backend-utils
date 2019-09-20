Set of helpers for [React Admin](https://github.com/marmelab/react-admin)
# Requirments
+ Typeorm
+ Typegraphql
# Installation
Install package:
```
npm install git@github.com:kultprosvet/obrigado-react-admin-backend-utils.git
```
or
```
yarn add git@github.com:kultprosvet/obrigado-react-admin-backend-utils.git
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
    getAdministratorData,
} from 'obrigado-react-admin-backend-utils'
...
   const schema = await buildSchema({
        resolvers: [
            __dirname + '/graphql/resolvers/*.ts',
            __dirname + '/graphql/resolvers/admin/*.ts',
            AdminAuthResolver, //  <---
        ],
        authChecker,
    })
     const server = new ApolloServer({
        schema: schema,
        context: async (session: any) => {
            console.log('ADM', {
                ...getAdministratorData(session.req),
            })
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
# Generate resolver for your entity
To generate resolver class call\
 createBaseCrudResolver(GraphQLModelClass,GraphQLInputClass,TypeORMEntityClass)\
 example:
```javascript
import { createBaseCrudResolver } from 'obrigado-react-admin-backend-utils'
...
const EntityBaseResolver = createBaseCrudResolver(
    EntityGraphQL,
    EntityGraphQLInput,
    Entity
)
@Resolver()
export class _EntityResolver extends EntityBaseResolver {}    
```
This will generate resolver with following methods:\
+ adminEntityGetList
+ adminEntityGetOne
+ adminEntityCreate
+ adminEntityUpdate
+ adminEntityUpdateMany
+ adminEntityGetManyReference
+ adminEntityDelete
+ adminEntityDeleteMany

To speed up admin panel development use [obrigado frontend helpers](https://github.com/kultprosvet/obrigado-react-admin-frontend-utils)
