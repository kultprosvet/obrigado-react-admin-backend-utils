import { FileHandler } from "../types/FileHandler";
import { GQLFileInput } from "..";
interface LocalFileHandlerConfig {
    folder: string;
}
export declare class LocalFileHandler implements FileHandler {
    config: LocalFileHandlerConfig;
    constructor(config: LocalFileHandlerConfig);
    deleteFile(path: string): Promise<void>;
    saveFile(file: GQLFileInput): Promise<string>;
}
export {};
