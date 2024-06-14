import express, {Request, Response} from 'express';
import multer from 'multer';
import swaggerUI from 'swagger-ui-express';
import { parse } from 'yaml';
import { readFileSync } from 'fs';
import { MongoClient, Db, Collection } from 'mongodb';
import { handleFileUpload } from './upload';
import { getFileByID } from './get'
import { delFileById } from './delete';
import { updateById } from './update';
import { serachByTags } from './query';

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
app.post('/upload', (req, res) => handleFileUpload(req, res, db));

// get
app.get('/:id', (req, res) => getFileByID(req, res, db));

// delete
app.delete('/:id', (req, res) => delFileById(req, res, db));

// edit
app.put('/:id', (req, res) => updateById(req, res, db));

// query
app.get('/search', (req, res) => serachByTags(req, res, db))

app.listen(5000, () => {
    console.log('Server is listening on port 5000');
});
