const idExtractor = function (htmlStr) {
    let isInTag = false;
    let result = [];
    for (let i = 0; i < htmlStr.length; i++) {
        if (htmlStr[i] === "<") isInTag = true;
        else if (htmlStr[i] === ">") isInTag = false;

        if (isInTag) {
            let currentPart = htmlStr.substr(i, 3);
            if (currentPart === "id " || currentPart === "id=") {
                let idPartIndex = htmlStr.indexOf("\"", i + 3);
                let idPart = htmlStr.substr(idPartIndex + 1);
                let indexPartEnd = idPart.indexOf("\"");
                if (indexPartEnd > -1){
                    idPart = idPart.substr(0,indexPartEnd);
                    if (idPart.length > 0){
                        result.push(idPart);
                    }
                }
            }
        }
    }
    return result;
};

module.exports = idExtractor;