import {createAdminResolver, createBaseCrudResolver} from "../BaseAdminResourceResolver"
import {Arg, Authorized, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root} from "type-graphql";
import {GQLAdministrator} from "../types/GQLAdministrator";
import {GQLAdministratorInput} from "../types/GQLAdministratorInput";
import {Administrator} from "../models/Administrator";
import {ApolloError} from "apollo-server-errors";
import {EntityUpdateHelper} from "../EntityUpdateHelper";
import * as bcrypt from "bcrypt";
import {RoleConfig} from "../roles/RoleConfig";
import {GQLAdminRole} from ".."

const AdminDataBaseResolver = createAdminResolver(
    {
        entity:Administrator,
        return:GQLAdministrator,
        create:GQLAdministratorInput,
        update:GQLAdministratorInput
    })

@Resolver(type=>GQLAdministrator)
export class AdminDataResolver extends AdminDataBaseResolver {

    async update(
            id: number,
            data: GQLAdministratorInput,
        context:any
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

    async create(data: GQLAdministratorInput, context:any) {
        // @ts-ignore
        let entity = new Administrator()
        await EntityUpdateHelper.update(entity, data,{ignore:['password']})
        if (data.password)
            entity.password=bcrypt.hashSync(data.password,10)
        await entity.save()
        return entity
    }

    @FieldResolver(type=>[String])
    permissions(@Root() admin:Administrator){
        return RoleConfig.getPermissions(admin.role)
    }
    @Authorized('admin')
    @Query((type) => [GQLAdminRole])
    async getRoles() {
        return RoleConfig.getRolesList()
    }

    @FieldResolver((type) => String,{nullable:true})
    async role(@Root() admin: Administrator) {
        return RoleConfig.getRole(admin.role)?.id
    }


}
