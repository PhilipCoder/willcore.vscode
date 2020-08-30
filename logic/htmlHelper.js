class htmlHelper {
    isInClassTag(line, position) {
        let hitQuote = false;
        let hitEquals = false;
        for (let pos = position - 1; pos > -1; pos--) {
            if (!hitEquals && line[pos] === "=") {
                hitEquals = true;
            }
            else if (!hitQuote && line[pos] === "\"") {
                hitQuote = true;
            }
            else if (hitQuote && line[pos] === "\"") {
                return false;
            }
            else if (hitEquals && (line[pos] === "\"" || line[pos] === "<" || line[pos] === "=")) {
                return false;
            }
            else if (hitEquals && line.substr(pos, 5) === "class") {
                return true;
            }
        }
        return false;
    }

    getTypedWord(line, position) {
        let word = "";
        for (let pos = position - 1; pos > -1; pos--) {
            if (line[pos] === " " || line[pos] === "\"") {
                return word;
            }
            word = line[pos] + word;
        }
        return false;
    }

    getPropertyWord(line, position) {
        let word = "";
        for (let pos = position - 1; pos > -1; pos--) {
            if (line[pos] === " " || line[pos] === ".") {
                return word;
            }
            word = line[pos] + word;
        }
        return false;
    }
}

let helperInstance = new htmlHelper();

module.exports = helperInstance;