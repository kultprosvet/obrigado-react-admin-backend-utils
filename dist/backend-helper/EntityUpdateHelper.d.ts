import { BaseEntity, EntityMetadata, ObjectLiteral } from 'typeorm';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
declare type HelperOptions = {
    ignore: Array<string>;
    fileSavePath: string | null;
};
export declare class EntityUpdateHelper<ORM> {
    EntityClass: any;
    entity: ORM;
    data: any;
    options: HelperOptions;
    relations: {
        [key: string]: RelationMetadata;
    };
    metadata: EntityMetadata;
    static update<ORM extends BaseEntity>(entity: ORM, data: any, options?: Partial<HelperOptions>): Promise<void>;
    constructor();
    _updateEntity(): Promise<void>;
    saveFileField(field: string, value: any): void;
    updateRelationById(field: string, value: any): Promise<void>;
    updateRelationByIdCascade(field: string, value: any): Promise<void>;
    updateRelatedEntitiesByIds(field: string, ids: []): Promise<void>;
    updateRelatedEntitiesByIdsCascade(field: string, ids: []): Promise<void>;
    updateRelationsEntitiesCascade(field: string, value: any[]): Promise<void>;
    updateRelationsEntities(field: string, value: any[]): Promise<void>;
    updateRelatedEntity(field: string, value: any): Promise<void>;
    setEntityRelationValue(field: string, value: any): void;
    arrayToObject(data: Array<any>, key?: string): ObjectLiteral;
    getFieldName(f: string): string;
}
export {};
