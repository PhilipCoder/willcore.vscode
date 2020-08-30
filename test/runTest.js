const moduleInfoFactory = require("../logic/moduleInfoFactory.js");
const loadIntellisenseWorkspace = require("../logic/intellisenseWorkspace.js");
const path = require('path');
const intellisense = require("../logic/intellisense.js");
const fs = require("fs");

const amdExport = `const view = (model, server) => {
    let one = 1;
}
module.exports = view;`;

const es6Export = `const view = (model, server) => {
    let one = 1;
}
export { view };`;

const es6ExportMulti = `const view = (model, server) => {
    let one = 1;
}

const access = (server,two) => {
    let one = 1;
}

export { view, access };`;

const mainImport = `const willCoreProxy = require("willcore.core");
const instance = willCoreProxy.new();`;

const view = `var view = async (view) => {
    view.userData = { userName : "John Doe" };
    view.$nameLabel.bind = () => view.userData.userName;
};

export { view };`;

describe('http-end-to-end-test', function () {
    let coreProxy = null;
    before(async function () {
    });

    it('broken_file', async function () {
        let result = moduleInfoFactory("fuck");
    });

    it('amdExport', async function () {
        let result = moduleInfoFactory(amdExport);
    });

    it('es6Export', async function () {
        let result = moduleInfoFactory(es6Export);
    });
    it('es6ExportMultiple', async function () {
        let result = moduleInfoFactory(view);
    });
    it('mainName', async function () {
        let result = moduleInfoFactory(mainImport);
    });
    it('findFiles', async function () {
        let result = loadIntellisenseWorkspace(path.resolve(__dirname + "/.."), [".js"], ["intellisense.json", "jsconfig.json"]);
    });
    it("loadWorkspace", async function () {
        // let io = require("C:/Work/willCore/willcore.visualstudio/willcore-visualstudio/models/assignableTree.js");
        var workspaceInstance = new intellisense(path.resolve(__dirname + "/../testdata"));
        workspaceInstance.init();
        let fileContents = fs.readFileSync("C:\\Work\\willCore\\willcore.visualstudio\\willcore-visualstudio\\testdata\\app_server.js", "utf8");
      //  let predictions = workspaceInstance.getRecommendations(fileContents, "coreProxy.testServer.", 20);
        let predictionsd = workspaceInstance.getRecommendations(fileContents, "coreProxy.testServer.two.three.", 20);
    });

    it("loadView", async function () {
        // let io = require("C:/Work/willCore/willcore.visualstudio/willcore-visualstudio/models/assignableTree.js");
        var workspaceInstance = new intellisense(path.resolve(__dirname + "/../testdata"));
        workspaceInstance.init();
        let predictionsd = workspaceInstance.getRecommendations(view, "view.$nameLabel.bind = () => view.userData.userName;", 16);
    });

});