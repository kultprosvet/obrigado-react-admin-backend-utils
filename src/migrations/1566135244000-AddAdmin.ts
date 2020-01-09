import { MigrationInterface, QueryRunner } from 'typeorm'
import {Administrator} from "../models/Administrator";
import * as bcrypt from 'bcrypt'
export class AddAdmin1566135244000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {

        let admin=await Administrator.findOne({where:{username:'admin'}})
        if (admin==null) {
            admin = new Administrator()
            admin.first_name = "Admin"
            admin.last_name = 'Admin'
            admin.username = 'admin'
            admin.password = bcrypt.hashSync("admin#12345", 10)
            await admin.save()
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        let admin=await Administrator.findOneOrFail({where:{username:'admin'}})
        await admin.remove()
    }
}
