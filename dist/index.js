"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yaml_1 = require("yaml");
const fs_1 = require("fs");
const mongodb_1 = require("mongodb");
const upload_1 = require("./upload");
const get_1 = require("./get");
const delete_1 = require("./delete");
const update_1 = require("./update");
const query_1 = require("./query");
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'fileuploads';
let db;
const app = (0, express_1.default)();
function connectToMongoDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = new mongodb_1.MongoClient(mongoUrl);
            yield client.connect();
            db = client.db(dbName);
            console.log(`Connected to database: ${dbName}`);
        }
        catch (err) {
            console.error('Failed to connect to MongoDB', err);
        }
    });
}
connectToMongoDB();
const swaggerDoc = (0, yaml_1.parse)((0, fs_1.readFileSync)('./swagger.yaml', 'utf8'));
app.use(express_1.default.json());
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDoc));
app.post('/upload', (req, res) => (0, upload_1.handleFileUpload)(req, res, db));
app.get('/:id', (req, res) => (0, get_1.getFileByID)(req, res, db));
app.delete('/:id', (req, res) => (0, delete_1.delFileById)(req, res, db));
app.put('/:id', (req, res) => (0, update_1.updateById)(req, res, db));
app.get('/search', (req, res) => (0, query_1.serachByTags)(req, res, db));
app.listen(5000, () => {
    console.log('Server is listening on port 5000');
});
//# sourceMappingURL=index.js.map