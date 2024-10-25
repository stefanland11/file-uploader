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

async function updateFile(fileId, userId, fileName) {
  try {
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
        folder: {
          userId: userId,
        },
      },
    });

    if (!file) {
      throw new Error("File not found or access denied.");
    }
    await prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        filename: fileName,
      },
    });
  } catch (error) {
    console.error("Error updating file:", error);
    throw error;
  }
}

async function updateFolder(folderId, userId, folderName) {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
        userId: userId,
      },
    });

    if (!folder) {
      throw new Error("Folder not found or access denied.");
    }

    await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name: folderName,
      },
    });
  } catch (error) {
    console.error("Error updating folder name:", error);
    throw error;
  }
}

async function deleteFile(fileId, userId) {
  try {
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
        folder: {
          userId: userId,
        },
      },
    });

    if (!file) {
      throw new Error("File not found or access denied.");
    }

    await prisma.file.delete({
      where: {
        id: fileId,
      },
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

async function deleteFolder(folderId, userId) {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
        userId: userId,
      },
      include: {
        subfolders: true,
      },
    });

    if (!folder) {
      throw new Error("Folder not found or access denied.");
    }

    await deleteSubfolders(folder.subfolders);

    await prisma.folder.delete({
      where: {
        id: folderId,
      },
    });

    console.log(`Folder with ID ${folderId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error;
  }
}

async function deleteSubfolders(subfolders) {
  for (const subfolder of subfolders) {
    const nestedSubfolders = await prisma.folder.findUnique({
      where: { id: subfolder.id },
      include: { subfolders: true },
    });

    if (nestedSubfolders) {
      await deleteSubfolders(nestedSubfolders.subfolders);
    }

    await prisma.folder.delete({
      where: { id: subfolder.id },
    });
  }
}

module.exports = {
  createUser,
  newFolder,
  uploadFile,
  getMainFolder,
  getFileInfo,
  getFolderInfo,
  updateFile,
  updateFolder,
  deleteFile,
  deleteFolder,
};
