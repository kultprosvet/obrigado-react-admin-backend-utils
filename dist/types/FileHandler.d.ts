import { GQLFileInput } from "./GQLFileInput";
export interface FileHandler {
    saveFile(data: GQLFileInput): Promise<string>;
    deleteFile(path: string): Promise<void>;
}
