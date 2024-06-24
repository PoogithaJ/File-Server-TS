import {Request, Response} from 'express';
import { Db, Collection } from 'mongodb';
import { FileMetadata } from './interface';
import { join } from 'path';
import { createReadStream } from 'fs';

export const getFileById = async (req: Request, res: Response, db:Db) => {
    const fileId = req?.query?.fileId;
    // console.log(fileId);
    try{
        const collection: Collection<FileMetadata> = db.collection('files');
        const fileMetadata = await collection.findOne({ id: fileId });
        if (!fileMetadata)
            return res.status(400).send(`File with fileId: ${fileId} is not found.`)
        else{
            const filePath = join(__dirname, '..', fileMetadata.path);
            res.setHeader('Content-Disposition', `attachment; filename="${fileMetadata.originalName}"`);
            res.setHeader('Content-Type', fileMetadata.mimeType);
            createReadStream(filePath).pipe(res);
            // return res.status(200).send('File found');
            return res.status(200).send(Buffer.from(fileMetadata.data, 'base64'));
        }
    }catch (err){
        return res.status(400).send(`File with fileId: ${fileId} is not found.`);
    }
};