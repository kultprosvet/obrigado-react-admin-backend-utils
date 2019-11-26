import { FileHandler } from "../types/FileHandler";
import { GQLFileInput } from "..";
export interface AwsFileHandlerConfig {
    awsKey: string;
    awsSecret: string;
    bucket: string;
    awsRegion: string;
    folder: string;
}
export declare class AwsS3FileHandler implements FileHandler {
    config: AwsFileHandlerConfig;
    constructor(conf: AwsFileHandlerConfig);
    deleteFile(path: string): Promise<void>;
    saveFile(data: GQLFileInput): Promise<string>;
}
