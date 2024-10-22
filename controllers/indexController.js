const db = require("../db/queries");

const getIndex = async (req, res) => {
  let mainFolder = null;

  if (req.user) {
    mainFolder = await db.getMainFolder(req.user.id);
  }
  console.log(mainFolder);
  res.render("index", {
    user: req.user,
    folder: mainFolder,
  });
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

module.exports = {
  getIndex,
  getFile,
  getFolder,
  postCreateFolder,
};
