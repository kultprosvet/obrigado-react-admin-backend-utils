import { BaseEntity, EntityMetadata } from 'typeorm';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import { FileHandler } from "./types/FileHandler";
export declare type EntityUpdateHelperOptions = {
    ignore: Array<string>;
    fileHandler?: FileHandler;
};
export declare class EntityUpdateHelper<ORM> {
    EntityClass: any;
    entity: ORM;
    data: any;
    options: EntityUpdateHelperOptions;
    relations: {
        [key: string]: RelationMetadata;
    };
    metadata: EntityMetadata;
    static update<ORM extends BaseEntity>(entity: ORM, data: any, options?: Partial<EntityUpdateHelperOptions>): Promise<void>;
    constructor();
    _updateEntity(): Promise<void>;
    updateRelatedEntitiesByIds(field: string, ids: []): Promise<void>;
    updateRelatedEntitiesByIdsCascade(field: string, ids: []): Promise<void>;
    updateRelationsEntitiesCascade(field: string, value: any[]): Promise<void>;
    updateRelationsEntities(field: string, value: any[]): Promise<void>;
    updateRelatedEntity(field: string, value: any): Promise<void>;
    setEntityRelationValue(field: string, value: any): void;
    arrayToObject(data: Array<any>, key?: string): any;
    getFieldName(f: string): string;
    getRelation(fieldName: string): any;
}
