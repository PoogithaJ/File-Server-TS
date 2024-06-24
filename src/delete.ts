import {Request, Response} from 'express';
import { Db, Collection } from 'mongodb';
import { FileMetadata } from './interface';
import { join } from 'path';

export const delFileById = async (req: Request, res: Response, db:Db) => {
    const fileId = req?.query?.fileId;
    try{
        const collection: Collection<FileMetadata> = db.collection('files');
        const fileMetadata = await collection.findOne({ id: fileId });
        if (!fileMetadata)
            return res.status(400).send(`File with fileId: ${fileId} is not found.`)
        else{
            const filePath = join(__dirname, '..', fileMetadata.path);
            try{
                await collection.deleteOne({ id: fileId });
                return res.status(200).send('File deleted successfully');
            }catch(err){
                return res.status(500).send(`Unable to delete file with id: ${req.params.id}`)
            }
        }
    }catch (err){
        return res.status(500).send(`Unable to delete file with id: ${req.params.id}`);
    }
};