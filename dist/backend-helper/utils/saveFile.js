"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const uuidv1 = require('uuid/v1');
exports.saveFile = (file, folder) => {
    //@ts-ignore
    let mainPath = path.dirname(require.main.filename);
    let appPath = path.normalize(`${mainPath}/..`);
    let ext = path.extname(file.file_name);
    let buff = new Buffer(file.body.replace(/^data.*base64,/, ''), 'base64');
    let dir = `${appPath}/frontend/static/content`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    dir = `${appPath}/frontend/static/content/${folder}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    let fileName = `${uuidv1()}${ext}`;
    fs.writeFileSync(`${dir}/${fileName}`, buff);
    return `/static/content/${folder}/${fileName}`;
};
//# sourceMappingURL=saveFile.js.map