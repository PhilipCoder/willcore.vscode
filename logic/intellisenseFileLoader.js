var fs = require('fs');
var path = require('path');
class intellisenseFileLoader {
    constructor(basePath){
        this.basePath = basePath;
    }
    loadIntellisenseFiles(dirPath, arrayOfFiles) {
        let files = fs.readdirSync(dirPath)

        arrayOfFiles = arrayOfFiles || []

        files.forEach((file) => {
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = this.loadIntellisenseFiles(dirPath + "/" + file, arrayOfFiles)
            } else if (file === "intellisense.json") {
                arrayOfFiles.push(path.join(dirPath, "/", file))
            }else if (dirPath.indexOf("node_modules") ===-1 && path.extname(file) === ".css"){
                arrayOfFiles.push(path.join(dirPath, "/", file))
            }
        })

        return arrayOfFiles
    }
}

module.exports = intellisenseFileLoader;