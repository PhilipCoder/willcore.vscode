const vscode = require('vscode');

const intellisenseMapper = (items) => {
    return items.map(item => {
        let itemDescription = `Type: ${item.type}.
Description: ${item.description}.
Has a name: ${item.hasName ? 'Yes' : 'No'}.
Assignable values: 
${item.assignmentValues.length === 0 ? 'None' : item.assignmentValues.map(val => 'Type: ' + val.type + '. Description: ' + val.description)}\n`;
        let itemText = item.name || item.type;
        let completionItem = new vscode.CompletionItem(itemText,item.name ? vscode.CompletionItemKind.Field : vscode.CompletionItemKind.Class);
        completionItem.filterText = itemText;
        completionItem.insertText = itemText;
        completionItem.documentation = itemDescription;
        return completionItem;
    });
};

module.exports = intellisenseMapper;