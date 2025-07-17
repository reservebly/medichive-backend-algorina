import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import * as mime from 'mime-types';
import * as dotenv from 'dotenv';

dotenv.config();

export class BlackbazeService {
  private s3: S3Client;
  private bucketName: string;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.B2_REGION || 'us-west-004',
      endpoint: process.env.B2_ENDPOINT || 'https://s3.us-west-004.backblazeb2.com',
      credentials: {
        accessKeyId: process.env.B2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.B2_SECRET_ACCESS_KEY!,
      },
    });

    this.bucketName = process.env.B2_BUCKET_NAME!;
  }

  // async uploadImage(file: Express.Multer.File, folder = 'uploads'): Promise<string> {
  //   const fileExt = mime.extension(file.mimetype) || 'jpg';
  //   const key = `${folder}/${uuid()}.${fileExt}`;

  //   const uploadParams = {
  //     Bucket: this.bucketName,
  //     Key: key,
  //     Body: file.buffer,
  //     ContentType: file.mimetype,
  //   };

  //   try {
  //     await this.s3.send(new PutObjectCommand(uploadParams));

  //     // Return public URL (assuming bucket is public)
  //     return `${process.env.B2_ENDPOINT}/${this.bucketName}/${key}`;
  //   } catch (error) {
  //     console.error('Error uploading file to B2:', error);
  //     throw new Error('Image upload failed');
  //   }
  // }
}
