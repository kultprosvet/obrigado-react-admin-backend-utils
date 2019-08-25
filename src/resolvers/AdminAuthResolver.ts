import {Arg, Ctx, Mutation, Query} from "type-graphql";
import {GQLAdministrator} from "../types/GQLAdministrator";
import {Administrator} from "../models/Administrator";
import {ApolloError} from "apollo-server-errors";
import {getJWTToken} from "../utils/getJWTToken";
import bcrypt from 'bcrypt'
export class AdminAuthResolver{
    @Mutation(type=>GQLAdministrator)
    async adminLogin(@Arg('username') username:string,@Arg('password') password:string){
        const user = await Administrator.findOne({where:{ username }})
        if (user == null) {
            throw new ApolloError(
                'Wrong email or password',
                'WRONG_CREDENTIALS'
            )
        }
        if (!bcrypt.compareSync(password, user.password)) {
            throw new ApolloError(
                'Wrong email or password',
                'WRONG_CREDENTIALS'
            )
        }
        let secret = process.env['APP_SECRET']
        if (!secret) {
            throw new ApolloError('Please set env APP_SECRET')
        }
        let expire:number=parseInt(process.env.ADMINISTRATOR_SESSION_EXPIRE || '365')
        user.token = getJWTToken({ id: user.id ,type:'admin'},expire)

        return user
    }
    @Query(type=>GQLAdministrator)
    async adminCheck(@Ctx() context:any){
        if (!context.administrator) throw new ApolloError('Admin not authorized')
        return context.administrator

    }

}