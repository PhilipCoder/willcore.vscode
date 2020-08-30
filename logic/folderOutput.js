const path = require("path");
const fs = require("fs");

const folderOutput = (outputPath, filePath, fileContainer) => {
    fileContainer["folder"].forEach(folder => {
        let relativePath = path.relative(filePath, folder);
        let createPath = path.join(outputPath, relativePath);
        if (!fs.existsSync(createPath)) {
            fs.mkdirSync(createPath);
        }
    });

    Object.keys(fileContainer).forEach(key => {
        if (Array.isArray(fileContainer[key]) && key !== "folder"){
            fileContainer[key].forEach(file => {
                let relativePath = path.relative(filePath, file);
                let createPath = path.join(outputPath, relativePath);
                fs.copyFileSync(file, createPath);
            });
        }
    });
};

module.exports = folderOutput;