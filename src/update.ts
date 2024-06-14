import {Request, Response} from 'express';
import { Db, Collection } from 'mongodb';
import { FileMetadata } from './interface';

export const updateById = async (req: Request, res: Response, db: Db) => {
    const fileId = req?.query?.fileId;
    const updateFields = {
        originalName: req.query.Name as string,
    };
    try {
        const collection: Collection<FileMetadata> = db.collection('files');
        const fileMetadata = await collection.updateOne({ id: fileId }, {$set: updateFields});
        if (!fileMetadata)
            return res.status(400).send(`File with fileId ${fileId} is not updated`);
        else{
            return res.status(200).send(`Successfully updated file with fileId ${fileId}`);
        }
    } catch (err){
            return res.status(500).send(`Error in updating the file with fileId ${fileId}`);
    }
}