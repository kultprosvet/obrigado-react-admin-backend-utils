import * as path from 'path'
import * as fs from 'fs'
import {GQLFileInput} from "../types/GQLFileInput";
const uuidv1 = require('uuid/v1')
export const saveFile = (file: GQLFileInput, folder: string) => {
    //@ts-ignore
    let ext = path.extname(file.file_name)

    let buff = new Buffer(file.body.replace(/^data.*base64,/, ''), 'base64')
    let dir = folder
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }

    let fileName = `${uuidv1()}${ext}`
    fs.writeFileSync(`${dir}/${fileName}`, buff)
    return fileName
}
