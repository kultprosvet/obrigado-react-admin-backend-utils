import { GQLAdministratorInput } from "../types/GQLAdministratorInput";
import { Administrator } from "../models/Administrator";
declare const AdminDataBaseResolver: any;
export declare class AdminDataResolver extends AdminDataBaseResolver {
    update(id: number, data: GQLAdministratorInput): Promise<any>;
    create(data: GQLAdministratorInput): Promise<Administrator>;
}
export {};
