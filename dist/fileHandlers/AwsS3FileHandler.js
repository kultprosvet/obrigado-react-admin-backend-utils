"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const path = require("path");
const uuidv1 = require('uuid/v1');
class AwsS3FileHandler {
    constructor(conf) {
        this.config = conf;
    }
    deleteFile(path) {
        const s3 = new AWS.S3({
            accessKeyId: this.config.awsKey,
            secretAccessKey: this.config.awsSecret
        });
        const params = {
            Bucket: this.config.bucket,
            Key: path,
        };
        return new Promise((resolve, reject) => {
            s3.deleteObject(params, (err, s3Data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        return Promise.resolve();
    }
    saveFile(data) {
        const s3 = new AWS.S3({
            accessKeyId: this.config.awsKey,
            secretAccessKey: this.config.awsSecret
        });
        let buff = new Buffer(data.body.replace(/^data.*base64,/, ''), 'base64');
        let ext = path.extname(data.file_name);
        let fileName = `${this.config.folder}/${uuidv1()}${ext}`;
        // Setting up S3 upload parameters
        const params = {
            Bucket: this.config.bucket,
            Key: fileName,
            Body: buff
        };
        return new Promise((resolve, reject) => {
            s3.upload(params, function (err, s3Data) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(s3Data.Location);
            });
        });
    }
}
exports.AwsS3FileHandler = AwsS3FileHandler;
//# sourceMappingURL=AwsS3FileHandler.js.map