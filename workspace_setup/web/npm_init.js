const vscode = require('vscode');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const workspace = require("../../logic/intellisenseWorkspace.js");
const path = require("path");
const folderOutput = require("../../logic/folderOutput.js");

const npm_init = async (cssProviderInstance, assignableJSProviderInstance) => {
    vscode.window.showInformationMessage("Setting up WillCore web environment.");
    try {
        let files = workspace(path.join(__dirname, "files"), [".js", ".html", "folder", ".json",".css"], [], true);
        folderOutput(vscode.workspace.rootPath, path.join(__dirname, "files"), files);
        vscode.window.setStatusBarMessage("Installing WillCore.Server Package.", 8000);
        
        await exec(`cd "${vscode.workspace.rootPath}" && npm install willcore.server`);
        vscode.window.setStatusBarMessage("Installing WillCore.UI Package.", 8000);

        await exec(`cd "${vscode.workspace.rootPath}" && npm install willcore.ui`);
        vscode.window.setStatusBarMessage("Installing WillCore.Bootstrap Package.", 8000);

        await exec(`cd "${vscode.workspace.rootPath}" && npm install willcore.bootstrap`);
        vscode.window.setStatusBarMessage("Installing WillCore.Session Package.", 8000);

        await exec(`cd "${vscode.workspace.rootPath}" && npm install willcore.session`);
    } catch (e) {
        vscode.window.showErrorMessage(e.message);
        debugger;
    }
    cssProviderInstance.repopulate();
    assignableJSProviderInstance.repopulate();
    vscode.window.showInformationMessage("Success! Done setting up WillCore environment.");
    
};

module.exports = npm_init;