import { createQueryBuilder, MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt'
import {getConnection} from "typeorm/index"
export class AddAdmin1566135244000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        const isPostgres=queryRunner.connection.options.type=='postgres'
        let dbParamFmt = isPostgres ? "$1" : "?";
    //    let admin=await createQueryBuilder().from('administrators','admins').select("username").where("username=:name",{name:'admin'}).getRawOne()
     const admin=await queryRunner.query(`SELECT username FROM administrators WHERE username=${dbParamFmt}`,[
         'admin'
     ])
       console.log(admin)
        if (admin==null) {
            await queryRunner.query(
                `insert into administrators (first_name,last_name,username,password)
VALUES ('Admin','Admin','admin','${bcrypt.hashSync('admin#12345', 10)}')`,
            )
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {

       // let admin=await Administrator.findOneOrFail({where:{username:'admin'}})
        //await admin.remove()
    }
}
