const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");

indexRouter.get("/", indexController.getIndex);
indexRouter.get("/file/:fileId", indexController.getFile);
indexRouter.get("/folder/:folderId", indexController.getFolder);
indexRouter.post('/create-folder', indexController.postCreateFolder);

module.exports = indexRouter;