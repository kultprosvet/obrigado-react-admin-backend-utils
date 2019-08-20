import {BaseEntity, Column, Entity, Index, PrimaryColumn} from "typeorm";
@Entity('administrators')
export class Administrator extends BaseEntity{
   @PrimaryColumn({unsigned:true})
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