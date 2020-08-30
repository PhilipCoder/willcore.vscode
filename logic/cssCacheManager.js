const fileLoader = require("../logic/intellisenseFileLoader.js");
const ccsCache = require("../logic/cssCache.js");

class cssCacheManager {
    constructor(directory){
        this.directory = directory;
        this.fileLoader = new fileLoader(this.directory);
    }

    populate(){
        this.fileLoader.loadIntellisenseFiles(this.directory).forEach(file => ccsCache.addConfigFile(file));
    }
}

module.exports =  cssCacheManager;