type Role={
    name:string,
    permissions:Array<string>
}
const roles:Array<Role>=[{name: 'admin', permissions: ['block administrators']}]
export const RoleConfig={
    init(r:Array<Role>){
        for(const item of r) {
            if (item.name === 'admin') {
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
            return roles[0].name;
        }
        for(const item of roles){
            if (item.name===role){
                return item.name
            }
        }
        return []
    },
    getRolesList() {
        let rolesList:Array<String> = []
        for(const item of roles) {
            rolesList.push(item.name)
        }
        return rolesList
    }
}