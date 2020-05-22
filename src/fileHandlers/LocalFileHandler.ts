import {FileHandler} from "../types/FileHandler";
import {GQLFileInput} from "..";
import * as path from "path";
import * as fs from "fs";
interface LocalFileHandlerConfig {
    folder:string// absolute path to folder
}
const uuidv1 = require('uuid/v1')
export class LocalFileHandler implements FileHandler{

    config:LocalFileHandlerConfig;

    constructor(config:LocalFileHandlerConfig){
        if (config){
            this.config=config
        }else {
            const  path = require('path');
            //@ts-ignore
            const appDir = path.dirname(require.main.filename);
            this.config={
                folder:`${appDir}/files`
            }
        }

    }
    async deleteFile(fPath: string): Promise<void> {
        if (fs.existsSync(fPath)){
            fs.unlinkSync(fPath)
        }else {
            console.log(`File ${path.resolve(fPath)} not exists`)
        }
        return Promise.resolve();
    }

    async saveFile(file: GQLFileInput): Promise<string> {
        //@ts-ignore
        let ext = path.extname(file.file_name)

        let buff = new Buffer(file.body.replace(/^data.*base64,/, ''), 'base64')
        let dir = this.config.folder
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }

        let fileName = `${uuidv1()}${ext}`
        fs.writeFileSync(`${dir}/${fileName}`, buff)
        return Promise.resolve(`${dir}/${fileName}`);
    }


}