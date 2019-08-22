import { Administrator } from "../models/Administrator";
export declare class AdminAuthResolver {
    adminLogin(username: string, password: string): Promise<Administrator>;
}
