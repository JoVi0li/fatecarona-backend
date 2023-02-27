import AWS from 'aws-sdk';
import { randomUUID } from 'crypto';

type BucketType = "documents" | "photos";

type FieldnameType = "IDENTITY_DOCUMENT_FRONT" | "IDENTITY_DOCUMENT_BACK" | "COLLEGE_DOCUMENT" | "PHOTO";

export interface FilesUploadedResult {
  file: AWS.S3.ManagedUpload.SendData,
  fileName: string,
  type: FieldnameType
}

const useS3 = () => {
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

  const uploadFile = async (file: any): Promise<FilesUploadedResult> => {
    /// file props: enconding, file, filename, fields, fieldname, mimetype, toBuffer
    if (!allowedFileTypes.includes(file.mimetype)) {
      throw new Error("Tipo do arquivo inválido");
    }
    const buffer = await file.toBuffer();
    const fieldname = file.fieldname as FieldnameType;
    const bucket = fieldname === "PHOTO" ? "photos" : "documents"
    const uploadedFile = await upload(buffer, bucket);
    return {
      file: uploadedFile,
      fileName: file.fieldname,
      type: file.fieldname
    };
  }

  const uploadMultipleFiles = async (files: any): Promise<FilesUploadedResult[]> => {
    const uploadedFiles: FilesUploadedResult[] = [];
    for await (const part of files) {
      if (!allowedFileTypes.includes(part.mimetype)) {
        throw new Error("Tipo do arquivo inválido");
      }
      const fileBuffer = await part.toBuffer();
      const fileType = part.fieldname as FieldnameType;
      const bucket = fileType === "PHOTO" ? "photos" : "documents";
      const file = await upload(fileBuffer, bucket);
      uploadedFiles.push({
        file: file,
        fileName: part.fieldname,
        type: fileType
      });
    }
    return uploadedFiles;
  }

  const getFile = async (key: string, bucket: BucketType) => {
    let file: AWS.S3.Body | undefined;
    s3.getObject({
      Bucket: `${process.env.BUCKET_AWS}/${bucket}`,
      Key: key
    }, (error, value) => {
      if (error) {
        throw new Error(error.message)
      }
      file = value.Body;
    });

    return file;
  }

  return { uploadFile, uploadMultipleFiles, getFile };
}

export default useS3;