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
exports.updateById = void 0;
const updateById = (req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const fileId = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.fileId;
    const updateFields = {
        originalName: req.query.Name,
    };
    try {
        const collection = db.collection('files');
        const fileMetadata = yield collection.updateOne({ id: fileId }, { $set: updateFields });
        if (!fileMetadata)
            return res.status(400).send(`File with fileId ${fileId} is not updated`);
        else {
            return res.status(200).send(`Successfully updated file with fileId ${fileId}`);
        }
    }
    catch (err) {
        return res.status(500).send(`Error in updating the file with fileId ${fileId}`);
    }
});
exports.updateById = updateById;
//# sourceMappingURL=update.js.map