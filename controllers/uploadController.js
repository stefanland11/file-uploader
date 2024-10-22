const db = require("../db/queries");

const getUpload = (req, res) => {
  res.render("upload", {
    user: req.user,
    folderId: req.query.folderId,
  });
};

const postUpload = async (req, res, next) => {
  await db.uploadFile(
    req.file.originalname,
    req.file.path,
    req.file.mimetype,
    req.file.size,
    parseInt(req.body.folderId)
  );

  res.send("File uploaded successfully: " + req.file.filename);
};

module.exports = {
  getUpload,
  postUpload,
};
