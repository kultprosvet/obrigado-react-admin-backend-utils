import {createBaseCrudResolver} from "../BaseAdminResourceResolver";
import {Arg, Authorized, Int, Mutation, Resolver} from "type-graphql";
import {GQLAdministrator} from "../types/GQLAdministrator";
import {GQLAdministratorInput} from "../types/GQLAdministratorInput";
import {Administrator} from "../models/Administrator";
import {ApolloError} from "apollo-server-errors";
import {EntityUpdateHelper} from "../EntityUpdateHelper";
import * as bcrypt from "bcrypt";

const AdminDataBaseResolver = createBaseCrudResolver(
    GQLAdministrator,
    GQLAdministratorInput,
    Administrator
)
@Resolver()
export class AdminDataResolver extends AdminDataBaseResolver {
    @Authorized('admin')
    @Mutation(type => GQLAdministrator, { name: `adminAdministratorUpdate` })
    async update(
        @Arg('id', type => Int)
            id: number,
        @Arg('data', type => GQLAdministratorInput)
            data: GQLAdministratorInput,
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
    async create(@Arg('data', type => GQLAdministratorInput) data: GQLAdministratorInput) {
        // @ts-ignore
        let entity = new Administrator()
        await EntityUpdateHelper.update(entity, data,{ignore:['password']})
        if (data.password)
            entity.password=bcrypt.hashSync(data.password,10)
        await entity.save()
        return entity
    }
}