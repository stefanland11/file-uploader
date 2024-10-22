const { Router, request } = require("express");
const uploadRouter = Router();
const uploadController = require("../controllers/uploadController");
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

uploadRouter.get("/upload", uploadController.getUpload);
uploadRouter.post('/upload', upload.single('upload'), uploadController.postUpload);

module.exports = uploadRouter;