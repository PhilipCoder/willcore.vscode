const treeNode = require("./treeNode.js");

class assignableTree{
    constructor(){
        this.entryPoints = {};
        this.workSpaceUrl = null;
    }

    loadWorkSpace(workSpaceUrl){
        this.workSpaceUrl = workSpaceUrl;
    }
}

const treeInstance = new assignableTree();

module.exports = treeInstance;