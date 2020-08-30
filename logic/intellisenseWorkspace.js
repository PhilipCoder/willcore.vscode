var fs = require('fs');
var path = require('path');


const loadIntellisenseWorkspace = (workspaceDirectory, extensions, fileNames, includeVsCode) => {
    const result = {
        modules: {}
    };
    extensions.forEach(extension => result[extension] = []);

    const loadDirectory = (directory, context) => {
        let files = fs.readdirSync(directory);
        files.forEach((file) => {
            if (file.indexOf(".vscode") >-1 && !includeVsCode) return;
            if (fs.statSync(directory + "/" + file).isDirectory()) {
                if (extensions.indexOf("folder") > -1){
                    result["folder"] = result["folder"] || [];
                    result["folder"].push(path.join(directory, "/", file));
                }
                loadDirectory(directory + "/" + file, context)
            } 
            else if (fileNames.indexOf(file) > -1) {
                result.modules[file] = result.modules[file] || [];
                result.modules[file].push(path.join(directory, "/", file));
            } 
            else if (directory.indexOf("node_modules") === -1 && extensions.indexOf(path.extname(file)) > -1) {
                context[path.extname(file)].push(path.join(directory, "/", file));
            }
        })
    };
    loadDirectory(workspaceDirectory,result);
    return result;
};

module.exports = loadIntellisenseWorkspace;