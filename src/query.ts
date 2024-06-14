import {Request, Response} from 'express';
import { Db, Collection } from 'mongodb';
import { FileMetadata } from './interface';
import { join } from 'path';
import { createReadStream } from 'fs';

export const serachByTags = async (req: Request, res: Response, db:Db) => {
    const tag = req?.query?.mimeType;
    try{
        const collection: Collection<FileMetadata> = db.collection('files');
        const fileMetadata = await collection.findOne({ mimeType: tag });
        if (!fileMetadata)
            return res.status(400).send(`There is no ${tag}`)
        else{
            const filePath = join(__dirname, '..', fileMetadata.path);
            res.setHeader('Content-Disposition', `attachment; filename="${fileMetadata.originalName}"`);
            res.setHeader('Content-Type', fileMetadata.mimeType);
            createReadStream(filePath).pipe(res);
            return res.status(200).send('Files found');
        }
    }catch (err){
        return res.status(400).send(`Error in finding ${tag}`);
    }
};