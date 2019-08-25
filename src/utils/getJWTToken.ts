import { ApolloError } from 'apollo-server-errors'
import * as jwt from 'jsonwebtoken'

export function getJWTToken(data: Object, expireDays = 360): string {
    const secret = process.env.APP_SECRET

    if (!secret) {
        throw new ApolloError(
            'Secret not provided, please provide set env `APP_SECRET`'
        )
    }
    return jwt.sign(
        {
            data,
            // @ts-ignore
        },
        secret,{
            expiresIn:`${expireDays} days`,
        }
    )
}
