import { GQLAdministratorInput } from "../types/GQLAdministratorInput";
import { Administrator } from "../models/Administrator";
declare const AdminDataBaseResolver: import("type-graphql").ClassType<import("../types/ReactAdminDataProvider").ReactAdminDataProvider<typeof Administrator, typeof GQLAdministratorInput>>;
export declare class AdminDataResolver extends AdminDataBaseResolver {
    update1(id: number, data: GQLAdministratorInput, context: any): Promise<Administrator>;
    create(data: GQLAdministratorInput, context: any): Promise<Administrator>;
    getRoles(): Promise<String[]>;
    permissions(admin: Administrator): string[];
    role(admin: Administrator): Promise<string | never[]>;
}
export {};
