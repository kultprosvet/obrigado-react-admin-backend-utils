import { ApolloError } from 'apollo-server-errors'
import * as jwt from 'jsonwebtoken'

type TokenInfo = {
    id: string
    type: string
}
export const getAdministratorData = (req: any) => {
    try {
        const authorization = req.headers.authorization
        let user: { [key: string]: any } | null
        user = null
        if (authorization) {
            const token = authorization.replace('Bearer ', '')

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
