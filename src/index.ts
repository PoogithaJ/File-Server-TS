import express, {Request, Response} from 'express';
import multer from 'multer';
import swaggerUI from 'swagger-ui-express';
import { parse } from 'yaml';
import { readFileSync } from 'fs';
import { MongoClient, Db, Collection } from 'mongodb';
import { handleFileUpload } from './upload';
import { getFileById } from './get'
import { delFileById } from './delete';
import { updateById } from './update';
import { searchByTags } from './query';

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'fileuploads';
let db: Db

const app = express();

// Connect to MongoDB
async function connectToMongoDB() {
    try {
      const client = new MongoClient(mongoUrl);
      await client.connect();
      db = client.db(dbName);
      console.log(`Connected to database: ${dbName}`);
    } catch (err) {
      console.error('Failed to connect to MongoDB', err);
    }
  }

connectToMongoDB()


const swaggerDoc = parse(readFileSync('./swagger.yaml', 'utf8')); 
app.use(express.json());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// upload
app.post('/Files/upload', (req, res) => handleFileUpload(req, res, db));

// query
app.get('/Files/searchByTag', (req, res) => searchByTags(req, res, db));

// get
app.get('/Files/getById', (req, res) => getFileById(req, res, db));

// delete
app.delete('/Files/delById', (req, res) => delFileById(req, res, db));

// edit
app.put('/Files/updateById', (req, res) => updateById(req, res, db));



app.listen(5000, () => {
    console.log('Server is listening on port 5000');
});
