import {Request, Response} from 'express';
import { Db, Collection } from 'mongodb';
import { FileMetadata } from './interface';
import { join } from 'path';
import archiver from 'archiver';

export const searchByTags = async (req: Request, res: Response, db:Db) => {
    const tag = req.query.tag as string;
    try{
        const collection: Collection<FileMetadata> = db.collection('files');
        const fileMetadata = await collection.find({ mimeType: tag });
        const fileMetaDataArray = await fileMetadata.toArray();
        // console.log(fileMetaDataArray.length);
        if (fileMetaDataArray.length === 0)
            return res.status(400).send(`There is no ${tag}`);
        else{
            res.setHeader('Content-Disposition', 'attachment; filename="files.zip"');
            res.setHeader('Content-Type', 'application/zip');

            const archive = archiver('zip', { zlib: { level: 9 } });
            archive.pipe(res);

            for (let i=0; i< fileMetaDataArray.length; i++){
                const buffer = Buffer.from(fileMetaDataArray[i].data, 'base64');
                archive.append(buffer, {name: fileMetaDataArray[i].originalName})
            }
            archive.finalize();
            return res.status(200);
        }
    }catch (err){
        return res.status(400).send(`Error in finding ${tag}`);
    }
};
