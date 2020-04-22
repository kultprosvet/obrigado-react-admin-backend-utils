import {BaseEntity, Column, Entity, Index,  PrimaryGeneratedColumn} from "typeorm";
@Entity('administrators')
@Index('IDX_FULL_TEXT',["username","first_name","last_name"], { fulltext: true })
export class Administrator extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    password:string
    @Column()
    @Index('IDX_QUESTION_USERNAME',{unique:true})
    username:string
    @Column({nullable:true})
    first_name:string
    @Column({nullable:true})
    last_name:string

    @Column({nullable:true})
    role:string

    @Column({type:'tinyint',default:0})
    isBlocked: boolean

    @Column({nullable:true,type:'varchar',length:200})
    email:string

    token:string


}
