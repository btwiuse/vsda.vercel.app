/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __webpack_require__(1);
let myStatusBarItem;
let count = 0;
let agents;
function watch() {
    let api = "wss://k0s.op.milvzn.com/api/agents/watch";
    let a = new WebSocket(api);
    a.binaryType = "blob";
    a.addEventListener("message", ({ data }) => {
        agents = JSON.parse(data);
        count = agents.length;
        updateStatusBarItem();
    });
}
function activate({ subscriptions }) {
    let x = vscode.workspace.registerRemoteAuthorityResolver;
    watch();
    let startNewD = vscode.commands.registerCommand("workbench.action.remote.close2", () => {
        console.log("workbench action remote close2");
        vscode.commands.getCommands().then((commands) => {
            console.log(commands);
        });
    });
    subscriptions.push(startNewD);
    subscriptions.push(vscode.commands.registerCommand("workbench.action.remote.new0", () => {
        console.log("new window, noargs");
        vscode.commands.executeCommand("vscode.newWindow");
    }));
    subscriptions.push(vscode.commands.registerCommand("workbench.action.remote.new00", () => {
        console.log("new window, reuse");
        vscode.commands.executeCommand("vscode.newWindow", {
            reuseWindow: true,
        });
    }));
    subscriptions.push(vscode.commands.registerCommand("workbench.action.remote.new000", () => {
        console.log("new window, no reuse");
        vscode.commands.executeCommand("vscode.newWindow", {
            reuseWindow: false,
        });
    }));
    subscriptions.push(vscode.commands.registerCommand("workbench.action.remote.new0000", () => {
        console.log("new window, no reuse");
        vscode.commands.executeCommand("vscode.newWindow", {
            remoteAuthority: "127.0.0.1:8081",
            reuseWindow: false,
        });
    }));
    subscriptions.push(vscode.commands.registerCommand("workbench.action.remote.new00000", () => {
        console.log("new window, no reuse");
        vscode.commands.executeCommand("vscode.newWindow", {
            remoteAuthority: "127.0.0.1:8081",
            reuseWindow: true,
        });
    }));
    subscriptions.push(vscode.commands.registerCommand("workbench.action.remote.new1", () => {
        console.log("new window, remoteAuthority 127.0.0.1:8080");
        vscode.commands.executeCommand("vscode.newWindow", {
            remoteAuthority: "127.0.0.1:8080",
        });
    }));
    subscriptions.push(vscode.commands.registerCommand("workbench.action.remote.new2", () => {
        console.log("new window, remoteAuthority 127.0.0.1:8080, reuse");
        vscode.commands.executeCommand("vscode.newWindow", {
            reuseWindow: true,
            remoteAuthority: "127.0.0.1:8080",
        });
    }));
    subscriptions.push(vscode.commands.registerCommand("workbench.action.remote.new3", () => {
        console.log("new window, remoteAuthority 127.0.0.1:8080, no reuse");
        vscode.commands.executeCommand("vscode.newWindow", {
            reuseWindow: false,
            remoteAuthority: "127.0.0.1:8080",
        });
    }));
    // register a command that is invoked when the status bar
    // item is selected
    const myCommandId = 'sample.showSelectionCount';
    subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
        const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
        vscode.window.showInformationMessage(`Yeah, ${count} line(s) selected... Keep going!`);
        console.log(count, agents);
    }));
    // create a new status bar item that we can now manage
    myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MAX_VALUE - 1);
    myStatusBarItem.command = myCommandId;
    subscriptions.push(myStatusBarItem);
    // register some listener that make sure the status bar 
    // item always up-to-date
    subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
    subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));
    // update status bar item once at start
    updateStatusBarItem();
}
exports.activate = activate;
function updateStatusBarItem() {
    const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
    if (n >= 0) {
        myStatusBarItem.text = `$(megaphone) ${count} agents(s) connected`;
        myStatusBarItem.show();
    }
    else {
        myStatusBarItem.hide();
    }
}
function getNumberOfSelectedLines(editor) {
    let lines = 0;
    if (editor) {
        lines = editor.selections.reduce((prev, curr) => prev + (curr.end.line - curr.start.line), 0);
    }
    return lines;
}
function deactivate() {
    // Everything is nicely registered in context.subscriptions,
    // so nothing to do for now.
}
exports.deactivate = deactivate;

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=extension.js.map