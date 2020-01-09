import { ApolloError } from 'apollo-server-errors'
import * as jwt from 'jsonwebtoken'
import cookie = require('cookie');

'cookie'
type TokenInfo = {
    id: string
    type: string
}
export const getAdministratorData = (req: any) => {
    if (!req) return {administrator:null}
    try {
        let user: { [key: string]: any } | null
        user = null
        let token=null
        let cookies:any={}
        if ((typeof req.headers.cookie)==='string'){
             cookies= cookie.parse(req.headers.cookie || '');
        }else{
            cookies=req.headers.cookie
        }

        if (req.headers.authorization) {
            token = req.headers.authorization.replace('Bearer ', '')
        } else if (cookies && cookies.admin_token) {
            token = cookies.admin_token
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
        console.log('admin auth error',e)
        return {administrator:null}
    }
}
