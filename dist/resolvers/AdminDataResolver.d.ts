import { GQLAdministratorInput } from "../types/GQLAdministratorInput";
import { Administrator } from "../models/Administrator";
declare const AdminDataBaseResolver: any;
export declare class AdminDataResolver extends AdminDataBaseResolver {
    update(id: number, data: GQLAdministratorInput, context: any): Promise<any>;
    create(data: GQLAdministratorInput, context: any): Promise<Administrator>;
    getRoles(): Promise<String[]>;
    permissions(admin: Administrator): string[];
    role(admin: Administrator): Promise<string | never[]>;
}
export {};
