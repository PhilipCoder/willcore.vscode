const vscode = require('vscode');
const intellisense = require("../logic/intellisense.js");
const mapper = require("../logic/intellisenseMapper.js");

class assignableJSProvider {
    constructor(context) {
        this.context = context;
        this.loadedFileContent = null;
        this.idList = [];
        this.workspaceInstance = new intellisense(vscode.workspace.rootPath);
        let workspaceInstance = this.workspaceInstance;
        this.workspaceInstance.init();
        const viewProvider = vscode.languages.registerCompletionItemProvider(
            'javascript',
            {
                provideCompletionItems(document, position) {
                    let lineText = document.lineAt(position).text;
                    let assignableResult = workspaceInstance.getRecommendations(document.getText(), lineText, position.character,document.fileName);
                    if (assignableResult) {
                        return mapper(assignableResult);
                    }
                    return undefined;
                }
            },
            "."
        );

        context.subscriptions.push(viewProvider);
    }
    repopulate(){
        this.workspaceInstance.init();
    }
}

module.exports = assignableJSProvider;