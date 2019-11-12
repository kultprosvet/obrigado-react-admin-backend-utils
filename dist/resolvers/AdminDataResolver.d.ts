import { GQLAdministratorInput } from "../types/GQLAdministratorInput";
import { Administrator } from "../models/Administrator";
declare const AdminDataBaseResolver: import("type-graphql").ClassType<import("../types/ReactAdminDataProvider").ReactAdminDataProvider>;
export declare class AdminDataResolver extends AdminDataBaseResolver {
    update(id: number, data: GQLAdministratorInput): Promise<Administrator>;
    create(data: GQLAdministratorInput): Promise<Administrator>;
}
export {};
