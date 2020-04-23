export type Role={
    id:string,
    name?:string,
    permissions:Array<string>
}
const roles:Array<Role>=[{id: 'admin',name:"Admin", permissions: ['block administrators']}]
export const RoleConfig={
    init(r:Array<Role>){
        for(const item of r) {
            if (item.id === 'admin') {
                roles[0].permissions=roles[0].permissions.concat(item.permissions);
                continue;
            }
            roles.push(item)
        }
    },
    getPermissions(role:string){
        if (!role){
            return roles[0].permissions;
        }
        for(const item of roles){
            if (item.name===role){
                return item.permissions
            }
        }
        return []
    },
    getRole(role:string) {
        if (!role){
            return roles[0];
        }
        for(const item of roles){
            if (item.id===role){
                return item
            }
        }
        return null
    },
    getRolesList() {
       return roles
    }
}