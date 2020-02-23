import { createQueryBuilder, MigrationInterface, QueryRunner } from "typeorm";
import {Administrator} from "../models/Administrator";
import * as bcrypt from 'bcrypt'
export class AddAdmin1566135244000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        let admin=await createQueryBuilder(Administrator).select("username").where("username=:name",{name:'admin'}).getRawOne()
        if (admin==null) {
            await createQueryBuilder()
                .insert()
                .into(Administrator)
                .values({
                    first_name: 'Admin',
                    last_name: 'Admin',
                    username: 'admin',
                    password: bcrypt.hashSync('admin#12345', 10),
                }).execute()
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        let admin=await Administrator.findOneOrFail({where:{username:'admin'}})
        await admin.remove()
    }
}
