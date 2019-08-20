import { AuthChecker } from 'type-graphql'

export const authChecker: AuthChecker<any> = (
    { root, args, context, info },
    roles
) => {
    if (roles.includes('admin')) return false
    if (!context.administrator) return false
    return true
}
