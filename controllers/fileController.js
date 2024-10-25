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

const getFile = async (req, res) => {
  file = await db.getFileInfo(parseInt(req.params.fileId), req.user.id);
  res.render("file", {
    user: req.user,
    file: file,
  });
};

const getFolder = async (req, res) => {
  folder = await db.getFolderInfo(parseInt(req.params.folderId), req.user.id);
  res.render("folder", {
    user: req.user,
    folder: folder,
  });
};

const postCreateFolder = async (req, res) => {
  const { folderName, parentId } = req.body;
  const userId = req.user.id;
  await db.newFolder(userId, parentId, folderName);

  res.redirect("back");
};

const postDeleteFolder = async (req, res) => {
  const { folderId } = req.body;
  const userId = req.user.id;
  await db.deleteFolder(parseInt(folderId), userId);
  res.redirect("/");
}

const postDeleteFile = async (req, res) => {
  const { fileId } = req.body;
  const userId = req.user.id;
  await db.deleteFile(parseInt(fileId), userId);
  res.redirect("/");
}

const postUpdateFolder = async (req, res) => {
  const { folderId, foldername } = req.body;
  const userId = req.user.id;
  await db.updateFolder(parseInt(folderId), userId, foldername);
  res.redirect("back");
}

const postUpdateFile = async (req, res) => {
  const { fileId, filename } = req.body;
  const userId = req.user.id;
  await db.updateFile(parseInt(fileId), userId, filename);
  res.redirect("back");
}

module.exports = {
  getUpload,
  postUpload,
  getFile,
  getFolder,
  postCreateFolder,
  postDeleteFolder,
  postDeleteFile,
  postUpdateFolder,
  postUpdateFile
};
