const vscode = require('vscode');
const cssProvider = require("./providers/cssProvider.js");
const viewJSProvider = require("./providers/viewJSProvider.js");
const assignableJSProvider = require("./providers/assignableJSProvider.js");
const fs = require("fs");
const path = require("path");
const web_init = require("./workspace_setup/web/npm_init.js");
const api_init = require("./workspace_setup/api/npm_init.js");


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	if (!vscode.workspace.rootPath) return;
	const cssProviderInstance = new cssProvider(context);
	const viewJSProviderInstance = new viewJSProvider(context);
	const assignableJSProviderInstance = new assignableJSProvider(context);

	let disposableWeb = vscode.commands.registerCommand('willcore.install_web', async function () {
		await web_init(cssProviderInstance,assignableJSProviderInstance);
	});

	let disposableApi = vscode.commands.registerCommand('willcore.install_api', async function () {
		await api_init(cssProviderInstance,assignableJSProviderInstance);
	});

	context.subscriptions.push(disposableWeb);
	context.subscriptions.push(disposableApi);

	initFileWatcher(cssProviderInstance, assignableJSProviderInstance);
}
exports.activate = activate;

function initFileWatcher(cssProviderInstance, assignableJSProviderInstance) {
	let modulePath = path.join(vscode.workspace.rootPath, "node_modules");
	let hasScheduledEvent = false;
	if (!fs.existsSync(modulePath)) {
		fs.mkdirSync(modulePath);
	}
	fs.watch(modulePath, {}, (eventType, filename, ss) => {
		if (!hasScheduledEvent) {
			hasScheduledEvent = true;
			if (filename) {
				setTimeout(() => {
					cssProviderInstance.repopulate();
					assignableJSProviderInstance.repopulate();
					hasScheduledEvent = false;
				}, 4000);
			}
		}
	});
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
