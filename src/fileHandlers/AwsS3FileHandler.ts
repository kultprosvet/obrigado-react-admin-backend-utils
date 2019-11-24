import {FileHandler} from "../types/FileHandler";
import {GQLFileInput} from "..";
import * as AWS from 'aws-sdk'
import * as path from "path";
const uuidv1 = require('uuid/v1')

export interface AwsFileHandlerConfig {
    awsKey:string,
    awsSecret:string,
    bucket:string,
    awsRegion:string
    folder:string
}
export class AwsS3FileHandler implements FileHandler{
    config:AwsFileHandlerConfig
    constructor(conf:AwsFileHandlerConfig){
        this.config=conf
    }
    deleteFile(path: string): Promise<void> {
        const s3 = new AWS.S3({
            accessKeyId: this.config.awsKey,
            secretAccessKey: this.config.awsSecret
        });
        const params = {
            Bucket: this.config.bucket,
            Key: path, // File name you want to save as in S3

        };
        return new Promise((resolve,reject)=>{
            s3.deleteObject(params,(err:Error,s3Data:AWS.S3.Types.DeleteObjectOutput)=>{
                if (err) {
                    reject(err)
                    return
                }
                resolve()
            })
        })

        return Promise.resolve();
    }

    saveFile(data: GQLFileInput): Promise<string> {
        const s3 = new AWS.S3({
            accessKeyId: this.config.awsKey,
            secretAccessKey: this.config.awsSecret
        });
        let buff = new Buffer(data.body.replace(/^data.*base64,/, ''), 'base64')
        let ext = path.extname(data.file_name)
        let fileName = `${this.config.folder}/${uuidv1()}${ext}`
        // Setting up S3 upload parameters
        const params = {
            Bucket: this.config.bucket,
            Key: fileName, // File name you want to save as in S3
            Body: buff
        };
        return new Promise((resolve,reject)=>{
            s3.upload(params, function(err:Error, s3Data: AWS.S3.ManagedUpload.SendData) {
                if (err) {
                    reject(err)
                    return
                }
                resolve(s3Data.Location)
            });
        })

    }

}