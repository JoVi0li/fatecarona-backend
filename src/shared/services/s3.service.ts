import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { FieldnameType, FilesUploadedResult } from './types';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import dotenv from "dotenv";

const s3Service = () => {
  dotenv.config();

  const bucketName = process.env.BUCKET_NAME!;
  const bucketRegion = process.env.BUCKET_REGION!;
  const accessKey = process.env.AWS_ACCESS_KEY!;
  const secretAccessKey = process.env.AWS_SECRET_KEY!;

  const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];

  const s3 = new S3Client({
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretAccessKey
    },
    region: bucketRegion
  });

  const uploadFile = async (file: any) => {
    if (!allowedFileTypes.includes(file.mimetype)) {
      throw new Error("Tipo do arquivo inválido");
    }

    const type = file.fieldname as FieldnameType;
    const buffer = await file.toBuffer();
    const mimetype = file.mimetype;
    const key = randomUUID();

    const command = new PutObjectCommand({
      Key: key,
      Bucket: bucketName,
      Body: buffer,
      ContentType: mimetype
    });

    await s3.send(command);

    return {
      key: key,
      type: type
    };
  }

  const uploadMultipleFiles = async (files: any) => {
    const uploadedFiles: FilesUploadedResult[] = [];

    for await (const file of files) {
      if (!allowedFileTypes.includes(file.mimetype)) {
        throw new Error("Tipo do arquivo inválido");
      }

      const type = file.fieldname as FieldnameType;
      const buffer = await file.toBuffer();
      const mimetype = file.mimetype;
      const key = randomUUID();

      const command = new PutObjectCommand({
        Key: key,
        Bucket: bucketName,
        Body: buffer,
        ContentType: mimetype,
      });

      await s3.send(command);

      uploadedFiles.push({
        key: key,
        type: type
      });
    }

    return uploadedFiles;
  }

  const getFile = async (key: string) => {
    const command =  new GetObjectCommand({
      Key: key,
      Bucket: bucketName
    });

    const file = await s3.send(command);

    return file.Body;
  }

  const getFileUrl = async (key: string) => {
    const command = new GetObjectCommand({
      Key: key,
      Bucket: bucketName,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 24 * 7 });

    return url;
  }

  return { uploadFile, uploadMultipleFiles, getFileUrl, getFile };
}

export default s3Service;