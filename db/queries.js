const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createUser(username, email, password) {
  try {
    await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: password,
        folders: {
          create: {
            name: "main",
          },
        },
      },
    });

    console.log("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function newFolder(userId, parentFolderId, folderName) {
  try {
    await prisma.folder.create({
      data: {
        name: folderName,
        user: {
          connect: { id: userId },
        },
        parent: {
          connect: { id: parseInt(parentFolderId) },
        },
      },
    });
  } catch (error) {
    console.error("Error creating new subfolder:", error);
    throw error;
  }
}

async function uploadFile(filename, url, type, size, folderId) {
  try {
    const log = await prisma.file.create({
      data: {
        filename: filename,
        url: url,
        mimetype: type,
        size: size,
        folderId: folderId,
      },
    });
    console.log(log);
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

async function getMainFolder(userId) {
  try {
    const mainFolder = await prisma.folder.findFirst({
      where: {
        userId: userId,
        name: "main",
      },
      include: {
        subfolders: true,
        files: true,
      },
    });
    return mainFolder;
  } catch (error) {
    console.error("Error fetching main folder:", error);
    throw error;
  }
}

async function getFileInfo(fileId, userId) {
  try {
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
        folder: {
          userId: userId,
        },
      },
    });
    return file;
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
}

async function getFolderInfo(folderId, userId) {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
        userId: userId,
      },
      include: {
        subfolders: true,
        files: true,
      },
    });
    return folder;
  } catch (error) {
    console.error("Error fetching folder:", error);
    throw error;
  }
}

module.exports = {
  createUser,
  newFolder,
  uploadFile,
  getMainFolder,
  getFileInfo,
  getFolderInfo,
};
