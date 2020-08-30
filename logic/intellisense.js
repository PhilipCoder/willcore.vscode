const loadIntellisenseWorkspace = require("../logic/intellisenseWorkspace.js");
const moduleInfoFactory = require("../logic/moduleInfoFactory.js");

const fileTypesToLoad = [];
const fileNamesToLoad = ["intellisense.json", "assignable_intellisense.json", "init_intellisense.js"];

class intellisense {
    constructor(workspacePath) {
        this.workspacePath = workspacePath;
        this.workspaceFiles = null;
        this.assignableInfo = {};
        this.initModuleInstances = [];
    }

    getDynamicAssignable(token) {
        if (token.startsWith("$")) {
            return {
                parentType: "viewModel",
                description: "HTML view element.",
                hasName: false,
                type: "element",
                name: token,
                assignmentValues: [
                ]
            }
        }
        return undefined;
    }

    init() {
        this.workspaceFiles = loadIntellisenseWorkspace(this.workspacePath, fileTypesToLoad, fileNamesToLoad);
        let assignable_intellisense = this.workspaceFiles.modules["assignable_intellisense.json"];
        if (assignable_intellisense && Array.isArray(assignable_intellisense)) {
            assignable_intellisense.forEach(jsonFile => {
                const assignableFileDetails = require(jsonFile);
                for (let key in assignableFileDetails) {
                    this.assignableInfo[key] = assignableFileDetails[key];
                }
            });
        }
        let initModules = this.workspaceFiles.modules["init_intellisense.js"] || [];
        this.initModuleInstances = [];
        initModules.forEach(moduleFile => {
            this.initModuleInstances.push(require(moduleFile));
        });
    }

    getRecommendations(fileContents, line, position) {
        if (line && line.length > 0 && position > 1) {
            line = line.substring(0, position);
            line = line.trim();
            if (line.indexOf("{") > -1) line = line.substring(line.lastIndexOf("{") + 1);
            if (line.indexOf("=>") > -1) line = line.substring(line.lastIndexOf("=>") + 2);
            if (line.indexOf(";") > -1) line = line.substring(line.lastIndexOf(";") + 1);
            if (line.indexOf(",") > -1) line = line.substring(line.lastIndexOf(",") + 1);

            let parts = line.split(".").map(x=>x.trim()).filter(x => x);
            let pastParent = null;
            let tree = this.getAssignableTree(fileContents);
            let assignableName = null;
            let valid = true;
            for (let i = 0; i < parts.length; i++) {
                if (tree[parts[i]]) {
                    pastParent = tree[parts[i]];
                } else if (pastParent && pastParent.children && pastParent.children[parts[i]]) {
                    pastParent = pastParent.children[parts[i]];
                } else if (pastParent && !assignableName) {
                    assignableName = parts[i];
                }
            }
            let result = undefined;
            if (valid) {
                if (assignableName) {
                    result = Object.keys(this.assignableInfo).map(key => { let value = this.assignableInfo[key]; value.type = key; return value }).filter(info => info.hasName && info.parentType === pastParent.type);
                } else if (pastParent) {
                    result = Object.keys(this.assignableInfo).map(key => { let value = this.assignableInfo[key]; value.type = key; return value }).filter(info => !info.hasName && info.parentType === pastParent.type);
                    if (pastParent.children) {
                        Object.keys(pastParent.children).forEach(item => result.unshift(pastParent.children[item]));
                    }
                }
                return result;
            }
        }
        return undefined;
    }



    getAssignableTree(fileContents) {
        let rootNode = {};
        let fileDetail = moduleInfoFactory(fileContents);
        this.initModuleInstances.forEach(moduleInstance => {
            let initIntellisense = new moduleInstance(fileDetail);

            (initIntellisense.values || []).forEach(initObj => {
                rootNode[initObj.name] = initObj;
            });
        });
        let parentTagType = null;
        for (let i = 1; i < fileDetail.codeTokens.length; i++) {
            let currentToken = fileDetail.codeTokens[i].value;
            if (currentToken === ";" ||
                currentToken === "}" ||
                currentToken === "{" ||
                currentToken === ")" ||
                currentToken === "(" ||
                currentToken === "=>" ||
                currentToken === "=" ||
                currentToken === "==" ||
                currentToken === "==="
            ) {
                parentTagType = null;
            }
            else if (currentToken !== ".") {
                let currentAssignable = this.assignableInfo[currentToken];
                if (parentTagType && currentAssignable && currentAssignable.hasName) {
                    let node = {
                        description: currentAssignable.description,
                        assignmentValues: currentAssignable.assignmentValues,
                        name: currentAssignable.hasName ? fileDetail.codeTokens[i - 2].value : null,
                        parentType: currentAssignable.parentType,
                        hasName: currentAssignable.hasName,
                        type: currentToken
                    };
                    parentTagType.children = parentTagType.children || {};
                    parentTagType.children[node.name] = node;
                    parentTagType = null;
                }
                else if (parentTagType && this.getDynamicAssignable(currentToken)) {
                    let node = this.getDynamicAssignable(currentToken);
                    parentTagType.children = parentTagType.children || {};
                    parentTagType.children[node.name] = node;
                    parentTagType = null;
                }
                else if (parentTagType && parentTagType.children && parentTagType.children[currentToken]) {
                    parentTagType = parentTagType.children[currentToken];
                }
            }
            else if (currentToken === ".") {
                if (!parentTagType) {
                    parentTagType = rootNode[fileDetail.codeTokens[i - 1].value];
                }
            }
        }
        return rootNode;
    }
}

module.exports = intellisense;