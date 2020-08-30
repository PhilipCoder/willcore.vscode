const vscode = require('vscode');
const ccsCache = require("../logic/cssCache.js");
const htmlHelper = require("../logic/htmlHelper.js");
const cacheManager = require("../logic/cssCacheManager.js");

class cssProvider {
    constructor(context) {
        this.context = context;
        const completionTriggerChars = ['"', "'", " ", "."];
        this.manager = new cacheManager(vscode.workspace.rootPath);
        this.manager.populate();
        this.watcher = vscode.workspace.createFileSystemWatcher("**/*.css");
        this.watcher.onDidChange((event) => {
            ccsCache.addCssFile(event.fsPath);
            vscode.window.showInformationMessage("change applied!" + event.fsPath);
        });
        this.watcher.onDidCreate((event) => {
            ccsCache.addCssFile(event.fsPath);
        });

        const cssProvider = vscode.languages.registerCompletionItemProvider(
            'html',
            {
                provideCompletionItems(document, position) {
                    if (!htmlHelper.isInClassTag(document.lineAt(position).text, position.character)) {
                        return undefined;
                    }

                    return ccsCache.getAll().map(pre => {
                        let completionItem = new vscode.CompletionItem(pre, vscode.CompletionItemKind.Variable);
                        completionItem.filterText = pre;
                        completionItem.insertText = pre;
                        return completionItem;
                    });
                }
            },
            completionTriggerChars
        );

        context.subscriptions.push(cssProvider);
    }
    repopulate(){
        this.manager.populate();
    }
}

module.exports = cssProvider;