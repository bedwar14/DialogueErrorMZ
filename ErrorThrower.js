//=============================================================================
// RPG Maker MZ - Error Thrower
//=============================================================================
/*:
 * @target MZ
 * @plugindesc throws errors for testing
 * @author ParserTongue
 * 
 * 
 * @command throwError
 * @text Throw Error
 * @desc Throw Error
 * 
 */
(() => {
    PluginManager.registerCommand("ErrorThrower", "throwError", function () {
        const _testval = "test";
        _testval = "var";
    });
    const _addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function () {
        _addOriginalCommands.call(this);
        this.addCommand("Throw Error", "throwError", true); // name, symbol, enabled
    };
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler("throwError", this.commandThrowError.bind(this));
    }

    Scene_Menu.prototype.commandThrowError = function () {
        throw new Error("Menu-based test error!");
    };
})();