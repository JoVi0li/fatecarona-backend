import AWS from 'aws-sdk';

type BucketType = "documents" | "photos"

const useUpload = () => {
  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: String(process.env.AWS_ACCESS_KEY),
      secretAccessKey: String(process.env.AWS_SECRET_KEY)
    }
  });

  const uploadFile = async (key: string, bucket: BucketType, base64: string) => {
    const uploadedImage = await s3.upload({
      Bucket: `${process.env.BUCKET_AWS}/${bucket}`,
      Key: key,
      Body: base64,
      ACL: "READ"
    }).promise();

    return uploadedImage;
  }

  const getFile = async (key: string) => {
  }


  return { uploadFile, getFile };
}

export default useUpload;