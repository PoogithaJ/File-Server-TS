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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileById = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const getFileById = (req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const fileId = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.fileId;
    try {
        const collection = db.collection('files');
        const fileMetadata = yield collection.findOne({ id: fileId });
        if (!fileMetadata)
            return res.status(400).send(`File with fileId: ${fileId} is not found.`);
        else {
            const filePath = (0, path_1.join)(__dirname, '..', fileMetadata.path);
            res.setHeader('Content-Disposition', `attachment; filename="${fileMetadata.originalName}"`);
            res.setHeader('Content-Type', fileMetadata.mimeType);
            (0, fs_1.createReadStream)(filePath).pipe(res);
            return res.status(200).send(Buffer.from(fileMetadata.data, 'base64'));
        }
    }
    catch (err) {
        return res.status(400).send(`File with fileId: ${fileId} is not found.`);
    }
});
exports.getFileById = getFileById;
//# sourceMappingURL=get.js.map