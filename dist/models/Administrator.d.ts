import { BaseEntity } from "typeorm";
export declare class Administrator extends BaseEntity {
    id: number;
    password: string;
    username: string;
    first_name: string;
    last_name: string;
    token: string;
}
