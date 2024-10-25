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

module.exports = {
  getIndex,
};
