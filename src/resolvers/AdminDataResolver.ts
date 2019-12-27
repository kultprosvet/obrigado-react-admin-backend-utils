import {createBaseCrudResolver} from "../BaseAdminResourceResolver";
import {Arg, Authorized, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root} from "type-graphql";
import {GQLAdministrator} from "../types/GQLAdministrator";
import {GQLAdministratorInput} from "../types/GQLAdministratorInput";
import {Administrator} from "../models/Administrator";
import {ApolloError} from "apollo-server-errors";
import {EntityUpdateHelper} from "../EntityUpdateHelper";
import * as bcrypt from "bcrypt";
import {RoleConfig} from "../roles/RoleConfig";

const AdminDataBaseResolver = createBaseCrudResolver(
    GQLAdministrator,
    GQLAdministratorInput,
    Administrator
)
@Resolver(type=>GQLAdministrator)
export class AdminDataResolver extends AdminDataBaseResolver {

    @Authorized('admin')
    @Mutation(type => GQLAdministrator, { name: `adminAdministratorUpdate` })
    async update1(
        @Arg('id', type => Int)
            id: number,
        @Arg('data', type => GQLAdministratorInput)
            data: GQLAdministratorInput,
        @Ctx() context:any
    ) {
        // @ts-ignore
        let entity = await Administrator.findOne({ where: { id } })
        if (!entity)
            throw new ApolloError(
                'Entity not found for id ' + id,
                'NOT_FOUND',
            )
        await EntityUpdateHelper.update(entity, data,{ignore:['password']})
        if (data.password)
            entity.password=bcrypt.hashSync(data.password,10)
        await entity.save()
        return entity
    }
    @Authorized('admin')
    @Mutation(type => GQLAdministrator, { name: `adminAdministratorCreate` })
    async create(@Arg('data', type => GQLAdministratorInput) data: GQLAdministratorInput,@Ctx() context:any) {
        // @ts-ignore
        let entity = new Administrator()
        await EntityUpdateHelper.update(entity, data,{ignore:['password']})
        if (data.password)
            entity.password=bcrypt.hashSync(data.password,10)
        await entity.save()
        return entity
    }
    @Authorized('admin')
    @Query(type=>[String])
    async getRoles(){
        return RoleConfig.getRolesList()
    }

    @FieldResolver(type=>[String])
    permissions(@Root() admin:Administrator){
        return RoleConfig.getPermissions(admin.role)
    }

    @FieldResolver(type=>String)
    async role(@Root() admin:Administrator) {
        return RoleConfig.getRole(admin.role)
    }


}
