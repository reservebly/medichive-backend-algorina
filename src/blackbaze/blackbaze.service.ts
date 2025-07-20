// src/blackblaze/blackblaze.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BlackblazeService {
  private readonly s3: AWS.S3;
  private readonly bucketName: string;

  constructor(    private configService: ConfigService,) {
    this.s3 = new AWS.S3({
      endpoint: this.configService.get('B2_ENDPOINT'),//'https://s3.us-west-002.backblazeb2.com', Replace with your region
      accessKeyId: this.configService.get('B2_KEY_ID'),
      secretAccessKey: this.configService.get('B2_APPLICATION_KEY'),
      region: 'us-east-005',
      signatureVersion: 'v4',
    });

    this.bucketName = this.configService.get('B2_BUCKET_NAME') as string;
  }

  async uploadImage(file: { originalname: any; buffer: any; mimetype: any; }): Promise<string> {
    console.log(this.bucketName);
    const fileKey = `${uuid()}-${file.originalname}`;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const data: ManagedUpload.SendData = await this.s3.upload(params).promise();
      return data.Location;
    } catch (error) {
      console.error('Backblaze Upload Error:', error);
      throw new InternalServerErrorException('Failed to upload image to Backblaze');
    }
  }

    async getSignedUrl(fileName: string): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Expires: 60 * 60, // 1 hour
    };

    return this.s3.getSignedUrlPromise('getObject', params);
  }
}
