import {BaseEntity, Column, Entity, Index,  PrimaryGeneratedColumn} from "typeorm";
@Entity('administrators')
@Index(["username","first_name","last_name"], { fulltext: true })
export class Administrator extends BaseEntity{
   @PrimaryGeneratedColumn ({unsigned:true})
    id:number
    @Column()
    password:string
    @Column()
    @Index({unique:true})
    username:string
    @Column({nullable:true})
    first_name:string
    @Column({nullable:true})
    last_name:string

    token:string


}