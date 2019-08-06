import { ClassType } from 'type-graphql';
import { BaseEntity } from 'typeorm';
import { ReactAdminDataProvider } from "./types/ReactAdminDataProvider";
export declare function createBaseCrudResolver<T extends ClassType, T2 extends ClassType, O extends ClassType<BaseEntity>>(objectTypeCls: T, inputTypeCls: T2, ORMEntity: O, fileSavePath?: string): typeof ReactAdminDataProvider;
export declare function validateEntityRelations<ORM extends BaseEntity>(entityClass: any, id: number): Promise<ORM>;
