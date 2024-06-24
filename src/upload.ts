import {Request, Response} from 'express';
import multer from 'multer';
import { Db, Collection } from 'mongodb';
import { FileMetadata } from './interface';
import { readFileSync } from 'fs';

const upload = multer({ dest: 'uploads/' }); 
  
export const uploadFile = (req: Request, res: Response) => {
    return new Promise<void>((resolve, reject) => {
        upload.single('file')(req, res, (err: any) => {
            if (err){
                reject(err);
            }else{
                resolve();
            }
        });
    });
};

export const handleFileUpload = async (req: Request, res: Response, db: Db) => {
    try {
        await uploadFile(req, res);
        if (!req.file)
            return res.status(400).send('No file uploaded');
        else{

            const fileMetaData: FileMetadata = {
                id: req?.query?.fileId as string,
                originalName: req.file.originalname,
                data: readFileSync(req.file.path).toString('base64'),
                mimeType: req.file.mimetype,
                size: req.file.size,
                path: req.file.path,
                uploadDate: new Date()
            };
            const collection: Collection<FileMetadata> = db.collection('files');
            await collection.insertOne(fileMetaData);
            return res.status(200).send('File has been uploaded successfully!');
        }
    }catch(err){
        return res.status(500).send('file upload failed')
    }
};