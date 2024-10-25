const { Router, request } = require("express");
const fileRouter = Router();
const fileController = require("../controllers/fileController");
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    public_id: (req, file) => file.originalname.split('.')[0] + '-' + Date.now() 
  },
});

const upload = multer({ storage: storage });

fileRouter.get("/upload", fileController.getUpload);
fileRouter.post('/upload', upload.single('upload'), fileController.postUpload);
fileRouter.get("/file/:fileId", fileController.getFile);
fileRouter.get("/folder/:folderId", fileController.getFolder);
fileRouter.post('/create-folder', fileController.postCreateFolder);
fileRouter.post('/delete-folder', fileController.postDeleteFolder);
fileRouter.post('/delete-file', fileController.postDeleteFile);
fileRouter.post('/update-file', fileController.postUpdateFile);
fileRouter.post('/update-folder', fileController.postUpdateFolder);

module.exports = fileRouter;