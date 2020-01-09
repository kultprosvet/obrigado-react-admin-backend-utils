declare type Role = {
    name: string;
    permissions: Array<string>;
};
export declare const RoleConfig: {
    init(r: Role[]): void;
    getPermissions(role: string): string[];
    getRole(role: string): string | never[];
    getRolesList(): String[];
};
export {};
