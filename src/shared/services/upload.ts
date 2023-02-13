import AWS from 'aws-sdk';
import { randomUUID } from 'crypto';

type BucketType = "documents" | "photos";

export interface FilesUploadedResult {
  file: AWS.S3.ManagedUpload.SendData,
  fileName: string
}

const useUpload = () => {
  const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];

  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: String(process.env.AWS_ACCESS_KEY),
      secretAccessKey: String(process.env.AWS_SECRET_KEY)
    }
  });

  const upload = async (file: any, bucket: BucketType) => {
    return await s3.upload({
      Bucket: `${process.env.BUCKET_AWS}/${bucket}`,
      Key: randomUUID(),
      Body: file,
    }).promise();
  }

  const uploadFile = async (file: any, bucket: BucketType): Promise<FilesUploadedResult> => {
    if (!allowedFileTypes.includes(file.mimetype)) {
      throw new Error("Tipo do arquivo inválido");
    }
    const fileBuffer = await file.toBuffer();
    const uploadedFile = await upload(fileBuffer, bucket);
    return {
      file: uploadedFile,
      fileName: file.fieldname
    };
  }

  const uploadMultipleFiles = async (files: any, bucket: BucketType): Promise<FilesUploadedResult[]> => {
    const uploadedFiles: FilesUploadedResult[] = [];
    for await (const part of files) {
      if (!allowedFileTypes.includes(part.mimetype)) {
        throw new Error("Tipo do arquivo inválido");
      }
      const fileBuffer = await part.toBuffer()
      const file = await upload(fileBuffer,bucket);
      uploadedFiles.push({
        file: file,
        fileName: part.fieldname
      })
    }
    return uploadedFiles;
  }

  return { uploadFile, uploadMultipleFiles };
}

export default useUpload;