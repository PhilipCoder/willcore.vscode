const esprima = require("esprima");

const amdExportName = (tokenArray) => {
    if (tokenArray.length > 6) {
        for (let i = tokenArray.length - 5; i > -1; i--) {
            if (tokenArray[i].value === "module" && tokenArray[i + 1].value === "." && tokenArray[i + 2].value === "exports" && tokenArray[i + 3].value === "=") {
                return tokenArray[i + 4].value;
            }
        }
    }
    return null;
};

const es6ExportName = (tokenArray) => {
    let result = [];
    if (tokenArray.length > 5) {
        let isInExport = false;
        for (let i = 0; i < tokenArray.length-2; i++) {
            if (tokenArray[i].value === "export" && tokenArray[i + 1].value === "{") {
                isInExport = true;
                i = i +2;
            }
            if ((tokenArray[i].value === "}" || tokenArray[i].value === ";") && isInExport){
                isInExport = false;
                return result;
            }
            if (isInExport && tokenArray[i].value !== ","){
                result.push(tokenArray[i].value);
            }
        }
        return result;
    }
    return null;
};

const getFunctionParameters = (functionName, tokenArray) => {
    if (tokenArray.length > 6) {
        let parameterArray = null;
        for (let i = 0; i < tokenArray.length - 3; i++) {
            if (tokenArray[i].value === functionName && tokenArray[i + 1].value === "=" && tokenArray[i + 2].value === "(") {
                parameterArray = [];
                i = i + 2;
            }
            else if (tokenArray[i].value === functionName && tokenArray[i + 1].value === "="  && tokenArray[i + 2].value === "async" && tokenArray[i + 3].value === "(") {
                parameterArray = [];
                i = i + 3;
            }
            else if (parameterArray !== null && (tokenArray[i].value === "." || tokenArray[i].value === "=" || tokenArray[i].value === "(" || tokenArray[i].value === ";")) {
                return null;
            }
            else if (parameterArray !== null && tokenArray[i].value === ")") {
                return parameterArray;
            }
            else if (parameterArray !== null && tokenArray[i].value !== ",") {
                parameterArray.push(tokenArray[i].value);
            }
        }
    }
    return null;
};

const getFunctionsParameters = (functionNames, tokenArray) => {
    let parameterArray = [];
    if (tokenArray.length > 6) {
        let currentArray = null;
        for (let i = 0; i < tokenArray.length - 3; i++) {
            if (functionNames.indexOf(tokenArray[i].value) > -1 && tokenArray[i + 1].value === "=" && tokenArray[i + 2].value === "(") {
                currentArray = [tokenArray[i].value];
                i = i + 2;
            }
            else if (functionNames.indexOf(tokenArray[i].value) > -1 && tokenArray[i + 1].value === "="  && tokenArray[i + 2].value === "async" && tokenArray[i + 3].value === "(") {
                currentArray = [tokenArray[i].value];
                i = i + 3;
            }
            else if (currentArray !== null && (tokenArray[i].value === "." || tokenArray[i].value === "=" || tokenArray[i].value === "(" || tokenArray[i].value === ";")) {
                parameterArray.push(currentArray);
                currentArray = null;
            }
            else if (currentArray !== null && tokenArray[i].value === ")") {
                parameterArray.push(currentArray);
                currentArray = null;
            }
            else if (currentArray !== null && tokenArray[i].value !== ",") {
                currentArray.push(tokenArray[i].value);
            }
        }
    }
    return parameterArray;
};

const importName = (tokenArray, moduleName) => {
    if (tokenArray.length > 6) {
        for (let i = 1; i < tokenArray.length - 5; i++) {
            if (tokenArray[i].value === "=" && tokenArray[i + 1].value === "require" && tokenArray[i + 2].value === "(" && tokenArray[i + 3].value === `"${moduleName}"` && tokenArray[i + 4].value === ")") {
                return tokenArray[i - 1].value;
            }
        }
    }
    return null;
};

const mainInstanceName = (tokenArray, importName) => {
    if (tokenArray.length > 7) {
        for (let i = 1; i < tokenArray.length - 6; i++) {
            if (tokenArray[i].value === "=" && tokenArray[i + 1].value === importName && tokenArray[i + 2].value === "." && tokenArray[i + 3].value === "new" && tokenArray[i + 4].value === "(" && tokenArray[i + 5].value === ")") {
                return tokenArray[i - 1].value;
            }
        }
    }
    return null;
};


const moduleInfo = (fileContents) => {
    let codeTokens = esprima.tokenize(fileContents);
    let amdExport = amdExportName(codeTokens);
    let es6Name = es6ExportName(codeTokens);
    let functionParameters = getFunctionParameters(amdExport, codeTokens);
    let functionsParameters = getFunctionsParameters(es6Name, codeTokens);
    let mainImportName = importName(codeTokens, "willcore.core");
    let mainName = mainInstanceName(codeTokens, mainImportName);
    return {
        hasExport : amdExport || es6Name,
        isServerSide : !!amdExport || !!mainName,
        mainName : mainName,
        parameters : functionParameters,
        codeTokens : codeTokens,
        functionsParameters : functionsParameters
    };
};

module.exports = moduleInfo;