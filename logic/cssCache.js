const extract = require("string-extract-class-names");
const fs = require("fs");
const path = require("path");

class cssClassNameCache {
    constructor() {
        this.classNames = {};
        this.allNames = [];
        this.classNameRegistry = {};
    }

    addCssClass(className) {
        className = className.substring(1);
        if (className.length < 1 || this.classNameRegistry[className]) return false;
        let firstChar = className[0];
        this.classNames[firstChar] = this.classNames[firstChar] || [];
        this.classNames[firstChar].push(className);
        this.classNameRegistry[className] = className;
        this.allNames.push(className);
        return true
    }

    addCssFile(fileName) {
        let contents = fs.readFileSync(fileName, 'utf8');
        extract(contents).filter(x => x.startsWith(".")).forEach(name => this.addCssClass(name));
    }

    getClassNames(startName) {
        if (startName.length < 0 || !this.classNames[startName[0]]) return this.allNames;
        return this.classNames[startName[0]].filter(name => name.startsWith(startName));
    }

    getAll(){
        return this.allNames;
    }

    addConfigFile(configFilePath) {
        if (path.extname(configFilePath) === ".css"){
            this.addCssFile(configFilePath)
        }else{
            let configContent = fs.readFileSync(configFilePath, "utf8");
            let config = JSON.parse(configContent);
            let configFiles = config.cssFiles || [];
            let dir = path.dirname(configFilePath);
            configFiles.forEach(file => this.addCssFile(path.join(dir,file)));
        }
    }
};

var cache = new cssClassNameCache();

module.exports = cache;