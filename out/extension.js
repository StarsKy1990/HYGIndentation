"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import all neccessarry functions etc. from VSCode API
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    //read all necessarry Settings
    var workbenchConfig;
    workbenchConfig = vscode.workspace.getConfiguration('editor');
    var confTabSize = workbenchConfig.get('tabSize');
    workbenchConfig = vscode.workspace.getConfiguration('HYGIndent');
    var confLeadingSpaces = workbenchConfig.get('LeadingSpaces');
    var confPattern = workbenchConfig.get('Pattern');
    var confDelimiter = workbenchConfig.get('Delimiter');
    //Return of the Settings couldn't be read
    if (confTabSize == null || confLeadingSpaces == null || confPattern == null || confDelimiter == null) {
        vscode.window.showInformationMessage("HYG-Indent Error: Setting couldn't be read");
        vscode.window.showInformationMessage("Check: tabSize, LeadingSpaces, Delimiter and Pattern");
        return;
    }
    //typecasting
    var intTabSize = Number(confTabSize);
    var blLeadingSpaces = Boolean(confLeadingSpaces);
    var strPattern = String(confPattern);
    var strDelimiter = String(confDelimiter);
    var arrPattern = strPattern.split(strDelimiter);
    var intArrLength = arrPattern.length;
    //Building one Tab
    var strTab = "";
    for (var k = 0; k < intTabSize; k++) {
        strTab = strTab + " ";
    }
    let disposable = vscode.commands.registerCommand('extension.HYGIndent', () => {
        //indenting
        doTheIndentOutdentThing(true);
    });
    let disposable2 = vscode.commands.registerCommand('extension.HYGOutdent', () => {
        //outdenting
        doTheIndentOutdentThing(false);
    });
    function doTheIndentOutdentThing(blIndent) {
        //get Object of active Editor
        let activeEditor = vscode.window.activeTextEditor;
        var strALLLines = "";
        if (!activeEditor) {
            return;
        }
        //get start end end of current selection
        var selStart = activeEditor.selection.start;
        var selEnd = activeEditor.selection.end;
        //determine the the selected lines
        var beginLine = selStart.line;
        var endLine = selEnd.line;
        //Setting Range and altering selection for replacement
        var completeRange = new vscode.Range(beginLine, 0, endLine, activeEditor.document.lineAt(endLine).range.end.character);
        activeEditor.selection = new vscode.Selection(beginLine, 0, endLine, activeEditor.document.lineAt(endLine).range.end.character);
        //loop over all Lines
        for (var i = beginLine; i <= endLine; i++) {
            //create new selection (whole line) and get get selection text
            var currentRange = activeEditor.document.lineAt(i).range;
            var strSelectedLine = activeEditor.document.getText(currentRange);
            var strNewLine = strSelectedLine;
            var strHYGPattern = "";
            //check which HYG-Pattern to use
            //1. delete leading spaces
            if (strSelectedLine.startsWith(' ') && blLeadingSpaces == false) {
                //If the Option "Refactor leading Spaces" is not checked the Line is not altered
                continue;
            }
            var strTrimmedLine = strSelectedLine.trim();
            for (var j = 0; j < intArrLength; j++) {
                if (strTrimmedLine.startsWith(arrPattern[j])) {
                    strHYGPattern = arrPattern[j];
                    break;
                }
            }
            //Indent our outdent depending on the used shortcut
            if (blIndent == true) {
                strNewLine = indentLine(strSelectedLine, strHYGPattern);
            }
            else {
                strNewLine = outdentLine(strSelectedLine, strHYGPattern);
            }
            //Building a String containing all Altered Lines
            if (strALLLines == "") {
                //First Line
                strALLLines = strNewLine;
            }
            else {
                //All following Lines
                strALLLines = strALLLines + "\n" + strNewLine;
            }
        }
        activeEditor.edit(builder => builder.replace(completeRange, strALLLines));
    }
    function indentLine(passedLine, passedPattern) {
        var strLine = passedLine;
        var strRetLine;
        //Getting the leading Spaces
        var intLeadingOffset = strLine.search(/\S/);
        //Get all trailling Spaces after the passed Pattern before the next NonWhitespace Character
        var strPureLine = strLine.trim();
        strPureLine = strPureLine.substring(passedPattern.length);
        var intTrailingOffset = strPureLine.search(/\S/);
        strPureLine = strPureLine.trim();
        //calculating the current indentation
        var intCurrIndent = intLeadingOffset + intTrailingOffset + passedPattern.length;
        var intCurrTabs = intCurrIndent / intTabSize;
        //Rebuilding the string with all necessarry tabs
        strRetLine = normalizeString(passedPattern);
        var intLeadingTabs = (strRetLine.length / intTabSize);
        //Adding the Indentation
        for (var l = intLeadingTabs; l < intCurrTabs + 1; l++) {
            strRetLine = strRetLine + strTab;
        }
        strRetLine = strRetLine + strPureLine;
        return strRetLine;
    }
    function outdentLine(passedLine, passedPattern) {
        var strLine = passedLine;
        var strRetLine;
        //Getting the leading Spaces
        var intLeadingOffset = strLine.search(/\S/);
        //Get all trailling Spaces after the passed Pattern before the next NonWhitespace Character
        var strPureLine = strLine.trim();
        strPureLine = strPureLine.substring(passedPattern.length);
        var intTrailingOffset = strPureLine.search(/\S/);
        strPureLine = strPureLine.trim();
        //calculating the current indentation
        var intCurrIndent = intLeadingOffset + intTrailingOffset + passedPattern.length;
        var intCurrTabs = intCurrIndent / intTabSize;
        //Rebuilding the string with all necessarry tabs
        strRetLine = normalizeString(passedPattern);
        var intLeadingTabs = (strRetLine.length / intTabSize);
        //Adding the Indentation
        for (var l = intLeadingTabs; l < intCurrTabs - 1; l++) {
            strRetLine = strRetLine + strTab;
        }
        strRetLine = strRetLine + strPureLine;
        return strRetLine;
    }
    function normalizeString(passedString) {
        //Enlarging the passed String with trailing Spaces so it matches an even number of Spaces (Tab-Size)
        var count = 0;
        var retString = passedString;
        while (passedString.length > (intTabSize * count)) {
            count = count + 1;
        }
        var intTrailingSpaces = ((intTabSize * count) - passedString.length);
        for (var m = 0; m < intTrailingSpaces; m++) {
            retString = retString + " ";
        }
        return retString;
    }
    context.subscriptions.push(disposable);
    context.subscriptions.push(disposable2);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map