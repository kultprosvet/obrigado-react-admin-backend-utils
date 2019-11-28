"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const uuidv1 = require('uuid/v1');
class LocalFileHandler {
    constructor(config) {
        if (config) {
            this.config = config;
        }
        else {
            const path = require('path');
            //@ts-ignore
            const appDir = path.dirname(require.main.filename);
            this.config = {
                folder: `${appDir}/files`
            };
        }
    }
    async deleteFile(fPath) {
        if (fs.existsSync(fPath)) {
            fs.unlinkSync(fPath);
        }
        else {
            console.log(`File ${path.resolve(fPath)} not exists`);
        }
        return Promise.resolve();
    }
    async saveFile(file) {
        //@ts-ignore
        let ext = path.extname(file.file_name);
        let buff = new Buffer(file.body.replace(/^data.*base64,/, ''), 'base64');
        let dir = this.config.folder;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        let fileName = `${uuidv1()}${ext}`;
        fs.writeFileSync(`${dir}/${fileName}`, buff);
        return Promise.resolve(`${dir}/${fileName}`);
    }
}
exports.LocalFileHandler = LocalFileHandler;
//# sourceMappingURL=LocalFileHandler.js.map