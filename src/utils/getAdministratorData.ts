import { ApolloError } from 'apollo-server-errors'
import * as jwt from 'jsonwebtoken'

type TokenInfo = {
    id: string
    type: string
}
export const getAdministratorData = (req: any) => {
    try {
        let user: { [key: string]: any } | null
        user = null
        let token=null
        if (req.headers.authorization) {
            token = req.headers.authorization.replace('Bearer ', '')
        } else if (req.cookies.admin_token) {
            token = req.cookies.token
        }

        if (token) {
            const secret = process.env.APP_SECRET

            if (!secret) {
                throw new ApolloError(
                    'Secret is not provided, please provide set env `APP_SECRET`'
                )
            }
            if (jwt.verify(token, secret)) {
                const data = jwt.decode(token) as {
                    data: TokenInfo
                }
                user = data.data
                if (user.type!=='admin'){
                    user=null
                }
            }
        }
        return {administrator:user}
    } catch (e) {
        return null
    }
}
