import { FileHandler } from "../types/FileHandler";
import { GQLFileInput } from "../types/GQLFileInput";
export interface AwsFileHandlerConfig {
    awsKey: string;
    awsSecret: string;
    bucket: string;
    folder: string;
}
export declare class AwsS3FileHandler implements FileHandler {
    config: AwsFileHandlerConfig;
    constructor(conf: AwsFileHandlerConfig);
    deleteFile(path: string): Promise<void>;
    saveFile(data: GQLFileInput): Promise<string>;
}
