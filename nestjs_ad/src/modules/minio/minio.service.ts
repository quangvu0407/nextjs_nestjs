import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private client: Minio.Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.client = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: parseInt(this.configService.get<string>('MINIO_PORT', '9000')),
      useSSL: this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true',
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY', ''),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY', ''),
    });
    this.bucket = this.configService.get<string>('MINIO_BUCKET', 'restaurants');
  }

  async onModuleInit() {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
      // Set bucket policy to public read
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucket}/*`],
          },
        ],
      };
      await this.client.setBucketPolicy(this.bucket, JSON.stringify(policy));
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    await this.client.putObject(this.bucket, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });
    const endpoint = this.configService.get<string>('MINIO_ENDPOINT');
    const port = this.configService.get<string>('MINIO_PORT');
    return `http://${endpoint}:${port}/${this.bucket}/${fileName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const fileName = fileUrl.split('/').pop();
    if (fileName) {
      await this.client.removeObject(this.bucket, fileName);
    }
  }
}
