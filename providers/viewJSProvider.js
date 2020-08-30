const vscode = require('vscode');
const path = require("path");
const fs = require("fs");
const htmlIDExtract = require("../logic/htmlIDExtractor.js");
const htmlHelper = require("../logic/htmlHelper.js");

class viewJSProvider {
    constructor(context) {
        this.context = context;
        this.loadedFileContent = null;
        this.idList = [];
        const viewProvider = vscode.languages.registerCompletionItemProvider(
            'javascript',
            {
                provideCompletionItems(document, position) {
                    let htmlFile = path.dirname(document.fileName) + "\\" + path.basename(document.fileName, ".js") + ".html";
                    let lineText = document.lineAt(position).text;
                    if (position.character < 3 || lineText.length < 2 || !fs.existsSync(htmlFile)) return undefined;
                    let typedWord = htmlHelper.getPropertyWord(document.lineAt(position).text, position.character);
                    if (!typedWord.startsWith("$")) return undefined;
                   // typedWord = typedWord.length > 1 ? typedWord.substring(1) : "";
                    let htmlFileContents = fs.readFileSync(htmlFile, "utf8");
                    if (this.loadedFileContent !== htmlFileContents) {
                        this.loadedFileContent = htmlFileContents;
                        this.idList = htmlIDExtract(htmlFileContents);
                    }
                    return this.idList.map(pre => {
                        let completionItem = vscode.CompletionItem("$" + pre, vscode.CompletionItemKind.Property);
                        completionItem.filterText = "$" + pre;
                        completionItem.insertText = "$" + pre;
                        completionItem.documentation = "Bindable HTML element proxy.";
                        return completionItem;
                    });
                }
            },
            "$"
        );
        context.subscriptions.push(viewProvider);
    }
}

module.exports = viewJSProvider;