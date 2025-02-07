/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/


import * as vscode from 'vscode';

let myStatusBarItem: vscode.StatusBarItem;

let count = 0;

let agents: any;

function watch(){
	let api = "wss://k0s.op.milvzn.com/api/agents/watch";
	let a = new WebSocket(api);
	a.binaryType = "blob";
	a.addEventListener("message", ({data}: any)=>{
		agents = JSON.parse(data);
		count = agents.length;
		updateStatusBarItem();
	});
}

export function activate({ subscriptions }: vscode.ExtensionContext) {
  let x = vscode.workspace.registerRemoteAuthorityResolver;
  watch();

  let startNewD = vscode.commands.registerCommand("workbench.action.remote.close2", () => {
	  console.log("workbench action remote close2")
	  vscode.commands.getCommands().then((commands)=>{
		  console.log(commands)
	  })
  })
  subscriptions.push(startNewD);

  subscriptions.push(
	  vscode.commands.registerCommand("workbench.action.remote.new0", () => {
		  console.log("new window, noargs")
		  vscode.commands.executeCommand("vscode.newWindow")
	  })
  );
  subscriptions.push(
	  vscode.commands.registerCommand("workbench.action.remote.new00", () => {
		  console.log("new window, reuse")
		  vscode.commands.executeCommand("vscode.newWindow", {
			  reuseWindow: true,
		  })
	  })
  );
  subscriptions.push(
	  vscode.commands.registerCommand("workbench.action.remote.new000", () => {
		  console.log("new window, no reuse")
		  vscode.commands.executeCommand("vscode.newWindow", {
			  reuseWindow: false,
		  })
	  })
  );
  subscriptions.push(
	  vscode.commands.registerCommand("workbench.action.remote.new0000", () => {
		  console.log("new window, no reuse")
		  vscode.commands.executeCommand("vscode.newWindow", {
			  remoteAuthority: "127.0.0.1:8081",
			  reuseWindow: false,
		  })
	  })
  );
  subscriptions.push(
	  vscode.commands.registerCommand("workbench.action.remote.new00000", () => {
		  console.log("new window, no reuse")
		  vscode.commands.executeCommand("vscode.newWindow", {
			  remoteAuthority: "127.0.0.1:8081",
			  reuseWindow: true,
		  })
	  })
  );
  subscriptions.push(
	  vscode.commands.registerCommand("workbench.action.remote.new1", () => {
		  console.log("new window, remoteAuthority 127.0.0.1:8080")
		  vscode.commands.executeCommand("vscode.newWindow", {
			  remoteAuthority: "127.0.0.1:8080",
		  })
	  })
  );
  subscriptions.push(
	  vscode.commands.registerCommand("workbench.action.remote.new2", () => {
		  console.log("new window, remoteAuthority 127.0.0.1:8080, reuse")
		  vscode.commands.executeCommand("vscode.newWindow", {
			  reuseWindow: true,
			  remoteAuthority: "127.0.0.1:8080",
		  })
	  })
  );
  subscriptions.push(
	  vscode.commands.registerCommand("workbench.action.remote.new3", () => {
		  console.log("new window, remoteAuthority 127.0.0.1:8080, no reuse")
		  vscode.commands.executeCommand("vscode.newWindow", {
			  reuseWindow: false,
			  remoteAuthority: "127.0.0.1:8080",
		  })
	  })
  );
  subscriptions.push(
	vscode.commands.registerCommand("workbench.action.remote.closeCurrent", () => {
		console.log("new window, noargs")
		vscode.commands.executeCommand("vscode.newWindow")
	})
  );
  subscriptions.push(
	vscode.commands.registerCommand("workbench.action.remote.newWithInput", async () => {
		// Prompt the user for the remote authority (e.g., "127.0.0.1:8080")
		const remoteAuthority = await vscode.window.showInputBox({
			placeHolder: 'Enter remote authority (e.g., 127.0.0.1:8080)',
			prompt: 'Specify the remote authority for the new window',
			value: '127.0.0.1:8080' // Default value
		});

		// Check if the user provided input
		if (remoteAuthority) {
            console.log(`Replacing window with remoteAuthority: ${remoteAuthority}`);
            // Replace the current window with a new one
            vscode.commands.executeCommand("vscode.newWindow", {
                remoteAuthority: remoteAuthority,
                reuseWindow: true // <-- This replaces the current window
            });
		}
	})
  );
  subscriptions.push(
	vscode.commands.registerCommand("workbench.action.remote.newWindowWithInput", async () => {
		// Prompt the user for the remote authority (e.g., "127.0.0.1:8080")
		const remoteAuthority = await vscode.window.showInputBox({
			placeHolder: 'Enter remote authority (e.g., 127.0.0.1:8080)',
			prompt: 'Specify the remote authority for the new window',
			value: '127.0.0.1:8080' // Default value
		});

		// Check if the user provided input
		if (remoteAuthority) {
            console.log(`Opening window with remoteAuthority: ${remoteAuthority}`);
            vscode.commands.executeCommand("vscode.newWindow", {
                remoteAuthority: remoteAuthority,
                reuseWindow: false
            });
		}
	})
  );
	// register a command that is invoked when the status bar
	// item is selected
	const myCommandId = 'sample.showSelectionCount';
	subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
		const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
		vscode.window.showInformationMessage(`Yeah, ${count} line(s) selected... Keep going!`);
		console.log(count, agents)
	}));

	// create a new status bar item that we can now manage
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MAX_VALUE-1);
	myStatusBarItem.command = myCommandId;
	subscriptions.push(myStatusBarItem);

	// register some listener that make sure the status bar 
	// item always up-to-date
	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
	subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));

	// update status bar item once at start
	updateStatusBarItem();
}

function updateStatusBarItem(): void {
	const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
	if (n >= 0) {
		myStatusBarItem.text = `$(megaphone) ${count} agents(s) connected`;
		myStatusBarItem.show();
	} else {
		myStatusBarItem.hide();
	}
}

function getNumberOfSelectedLines(editor: vscode.TextEditor | undefined): number {
	let lines = 0;
	if (editor) {
		lines = editor.selections.reduce((prev, curr) => prev + (curr.end.line - curr.start.line), 0);
	}
	return lines;
}

export function deactivate() {
	// Everything is nicely registered in context.subscriptions,
	// so nothing to do for now.
}

