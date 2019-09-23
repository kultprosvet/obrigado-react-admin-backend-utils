import {createBaseCrudResolver} from "../BaseAdminResourceResolver";
import {Resolver} from "type-graphql";
import {GQLAdministrator} from "../types/GQLAdministrator";
import {GQLAdministratorInput} from "../types/GQLAdministratorInput";
import {Administrator} from "../models/Administrator";

const AdminDataBaseResolver = createBaseCrudResolver(
    GQLAdministrator,
    GQLAdministratorInput,
    Administrator
)
@Resolver()
export class AdminDataResolver extends AdminDataBaseResolver {}