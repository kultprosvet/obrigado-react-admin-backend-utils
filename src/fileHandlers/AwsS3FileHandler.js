"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = require("aws-sdk");
var path = require("path");
var uuidv1 = require('uuid/v1');
var AwsS3FileHandler = /** @class */ (function () {
    function AwsS3FileHandler(conf) {
        this.config = conf;
    }
    AwsS3FileHandler.prototype.deleteFile = function (path) {
        var s3 = new AWS.S3({
            accessKeyId: this.config.awsKey,
            secretAccessKey: this.config.awsSecret,
            region: this.config.region
        });
        var fileKeyRegEx = new RegExp(this.config.folder + "(.*)");
        var result = fileKeyRegEx.exec(path);
        if (!result)
            throw new Error("Unable to extract file key from path " + path + " and folder " + this.config.folder);
        var fileKey = result[0];
        var params = {
            Bucket: this.config.bucket,
            Key: fileKey,
        };
        return new Promise(function (resolve, reject) {
            s3.deleteObject(params, function (err, s3Data) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        return Promise.resolve();
    };
    AwsS3FileHandler.prototype.saveFile = function (data) {
        var s3 = new AWS.S3({
            accessKeyId: this.config.awsKey,
            secretAccessKey: this.config.awsSecret,
            region: this.config.region
        });
        var buff = new Buffer(data.body.replace(/^data.*base64,/, ''), 'base64');
        var ext = path.extname(data.file_name);
        var fileName = this.config.folder + "/" + uuidv1() + ext;
        // Setting up S3 upload parameters
        var params = {
            Bucket: this.config.bucket,
            Key: fileName,
            Body: buff,
            ACL: 'public-read',
        };
        return new Promise(function (resolve, reject) {
            s3.upload(params, function (err, s3Data) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(s3Data.Location);
            });
        });
    };
    return AwsS3FileHandler;
}());
exports.AwsS3FileHandler = AwsS3FileHandler;
