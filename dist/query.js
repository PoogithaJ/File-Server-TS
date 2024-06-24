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
exports.searchByTags = void 0;
const archiver_1 = __importDefault(require("archiver"));
const searchByTags = (req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    const tag = req.query.tag;
    try {
        const collection = db.collection('files');
        const fileMetadata = yield collection.find({ mimeType: tag });
        const fileMetaDataArray = yield fileMetadata.toArray();
        if (fileMetaDataArray.length === 0)
            return res.status(400).send(`There is no ${tag}`);
        else {
            res.setHeader('Content-Disposition', 'attachment; filename="files.zip"');
            res.setHeader('Content-Type', 'application/zip');
            const archive = (0, archiver_1.default)('zip', { zlib: { level: 9 } });
            archive.pipe(res);
            for (let i = 0; i < fileMetaDataArray.length; i++) {
                const buffer = Buffer.from(fileMetaDataArray[i].data, 'base64');
                archive.append(buffer, { name: fileMetaDataArray[i].originalName });
            }
            archive.finalize();
            return res.status(200);
        }
    }
    catch (err) {
        return res.status(400).send(`Error in finding ${tag}`);
    }
});
exports.searchByTags = searchByTags;
//# sourceMappingURL=query.js.map