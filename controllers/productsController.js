const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const fs = require('fs');
const dotenv=require("dotenv");
dotenv.config();

const bucket = 'andrus-e-commerce';
async function uploadToS3(path, originalFilename, mimetype) {
    const client = new S3Client({
      region: 'eu-north-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
    const parts = originalFilename.split('.');
    const ext = parts[parts.length - 1];
    const newFilename = Date.now() + '.' + ext;
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newFilename,
      ContentType: mimetype,
      ACL: 'public-read',
    }));
    return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}

exports.addProduct = async (req, res) => {
    try {
        const uploadedFiles = [];
        for (let i = 0; i < req.files.length; i++) {
          const {path,originalname,mimetype} = req.files[i];
          const url = await uploadToS3(path, originalname, mimetype);
          uploadedFiles.push(url);
        }
        res.status(200).json(uploadedFiles);    
    } catch (error) {
        console.error("Error uploading files:", error);
        res.status(500).json({ message: "Server Error" });
    }
}
