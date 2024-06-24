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
exports.handleFileUpload = exports.uploadFile = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = require("fs");
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const uploadFile = (req, res) => {
    return new Promise((resolve, reject) => {
        upload.single('file')(req, res, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.uploadFile = uploadFile;
const handleFileUpload = (req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        yield (0, exports.uploadFile)(req, res);
        if (!req.file)
            return res.status(400).send('No file uploaded');
        else {
            const fileMetaData = {
                id: (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.fileId,
                originalName: req.file.originalname,
                data: (0, fs_1.readFileSync)(req.file.path).toString('base64'),
                mimeType: req.file.mimetype,
                size: req.file.size,
                path: req.file.path,
                uploadDate: new Date()
            };
            const collection = db.collection('files');
            yield collection.insertOne(fileMetaData);
            return res.status(200).send('File has been uploaded successfully!');
        }
    }
    catch (err) {
        return res.status(500).send('file upload failed');
    }
});
exports.handleFileUpload = handleFileUpload;
//# sourceMappingURL=upload.js.map