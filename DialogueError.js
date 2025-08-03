//=============================================================================
// RPG Maker MZ - Dialogue Error
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Gives dialogue for stack trace and errors
 * @author ParserTongue
 * 
 * @param speakerName
 * @text speaker name
 * @type string
 * @default Actor 1
 * 
 * @param faceImage
 * @text face image to use
 * @type string
 * @default Actor1
 * 
 * @param maxfaceImageIndex
 * @text index of face image
 * @type number
 * @default 0
 * 
 * @param preText
 * @text text before stack trace
 * @type string
 * @default Uh Oh!! Something went wrong in the source code!
 * 
 * @param postText1
 * @text text after stack trace 1
 * @type string
 * @default Please let us know how you got this error
 * 
 * @param postText2
 * @text text after stack trace 2
 * @type string
 * @default myemail@mygamewebsite.com
 * 
 * @param consolePreText
 * @text console PreText
 * @type string
 * @default intercepted plugin error:
 * 
 * @param maxLines
 * @text Max Lines per Page
 * @type number
 * @default 99
 * 
 * @param stacktraceFontSize
 * @text  Error Text Font Size
 * @type number
 * @default 18
 * 
 * 
 */
(() => {
    const parameters = PluginManager.parameters("DialogueError");
    const _maxExceptionLines = Number(parameters["maxLines"] || 99);
    const _stacktraceFontSize = Number(parameters["stacktraceFontSize"] || 18);
    const _preText = parameters["preText"] || "Uh Oh!! Something went wrong in the source code!";
    const _consolePreText = parameters["consolePreText"] || "Dialogue intercepted plugin error:";
    const _postText1 = parameters["postText1"] || "Please let us know how you got this error";
    const _postText2 = parameters["postText2"] || "myemail@mygamewebsite.com";
    const _speakerName = parameters["speakerName"] || "Actor 1";
    const _faceImage = parameters["faceImage"] || "Actor1";
    const _faceImageIndex = Number(parameters["faceImageIndex"] || 0);
    //gets rid of URL stuff from Chrome Extension, only used for the dialogue
    const cleanStack = (stack) => {
        return (stack || "")
            .split("\n")
            .slice(0, _maxExceptionLines)
            .map(line => {
                return line
                    .replace(/^.*[\/\\]([^\/\\]+\.js:\d+:\d+)\)?$/, 'at $1')
                //from start of line all characters until the capture group (filename.js:numbers:numbers) followed by close parenthesis
                //insert the capture group value into $1
            });
    };

    const DialogueMessageStacktrace = function (e) {
        console.error(_consolePreText, e);
        // if (!(SceneManager._scene instanceof Scene_Map)) {
        //     SceneManager.goto(Scene_Map);
        // }
        if (SceneManager._scene instanceof Scene_Map && $gameMessage) {
            $gameMessage.setSpeakerName(_speakerName);
            $gameMessage.setFaceImage(_faceImage, _faceImageIndex);
            $gameMessage.add(_preText);
            cleanStack(e.stack).forEach((line, i) => {
                let lineNo = i > 0
                    ? `${i}:`
                    : ``;
                $gameMessage.add(`\\FS[${_stacktraceFontSize}]${lineNo}${line.trim()}\\FS[${$dataSystem.advanced.fontSize}]`)
            });
            $gameMessage.add(_postText1);
            $gameMessage.add(_postText2);
        }
        return;
    }
    const DialogueMessageScript = function (e) {
        console.error(_consolePreText, e);
        // if (!(SceneManager._scene instanceof Scene_Map)) {
        //     SceneManager.goto(Scene_Map);
        // }
        if (SceneManager._scene instanceof Scene_Map && $gameMessage) {
            $gameMessage.setSpeakerName(_speakerName);
            $gameMessage.setFaceImage(_faceImage, _faceImageIndex);
            $gameMessage.add(_preText);
            cleanStack(e.stack).forEach((line, i) => {
                let lineNo = i > 0
                    ? `${i}:`
                    : ``;
                $gameMessage.add(`\\FS[${_stacktraceFontSize}]${lineNo}${line.trim()}\\FS[${$dataSystem.advanced.fontSize}]`)
            });
            $gameMessage.add(_postText1);
            $gameMessage.add(_postText2);
        }
        return;
    }
    const _callCommand = PluginManager.callCommand;
    PluginManager.callCommand = function (self, commandName, args) {
        try {
            return _callCommand.call(this, self, commandName, args);
        } catch (e) {
            //DialogueMessageStacktrace(e);
            // console.error(_consolePreText, e);
            // if (!(SceneManager._scene instanceof Scene_Map)) {
            //     SceneManager.goto(Scene_Map);
            // }
            if (SceneManager._scene instanceof Scene_Map && $gameMessage) {
                $gameMessage.setSpeakerName(_speakerName);
                $gameMessage.setFaceImage(_faceImage, _faceImageIndex);
                $gameMessage.add(_preText);
                cleanStack(e.stack).forEach((line, i) => {
                    let lineNo = i > 0
                        ? `${i}:`
                        : ``;
                    $gameMessage.add(`\\FS[${_stacktraceFontSize}]${lineNo}${line.trim()}\\FS[${$dataSystem.advanced.fontSize}]`)
                });
                $gameMessage.newPage();
                $gameMessage.add(_postText1);
                $gameMessage.add(_postText2);
                return;
            }
        }
    };
    const _callOkHandler = Window_Command.prototype.callOkHandler;

    Window_Command.prototype.callOkHandler = function () {
        try {
            _callOkHandler.call(this);
        } catch (e) {
            console.error(e);
            if (!(SceneManager._scene instanceof Scene_Map)) {
                SceneManager.goto(Scene_Map);
            }
            if (SceneManager._scene instanceof Scene_Menu && $gameMessage) {
                $gameMessage.setSpeakerName(_speakerName);
                $gameMessage.setFaceImage(_faceImage, _faceImageIndex);
                $gameMessage.add(_preText);
                cleanStack(e.stack).forEach((line, i) => {
                    let lineNo = i > 0
                        ? `${i}:`
                        : ``;
                    $gameMessage.add(`\\FS[${_stacktraceFontSize}]${lineNo}${line.trim()}\\FS[${$dataSystem.advanced.fontSize}]`)
                });
                $gameMessage.newPage();
                $gameMessage.add(_postText1);
                $gameMessage.add(_postText2);
            }
        }
    };

    const _command355 = Game_Interpreter.prototype.command355;
    Game_Interpreter.prototype.command355 = function () {
        try {
            console.log("Dialogue 355");
            //copy paste from rmmz_objects.js
            let script = this.currentCommand().parameters[0] + "\n";
            while (this.nextEventCode() === 655) {
                this._index++;
                script += this.currentCommand().parameters[0] + "\n";
            }
            eval(script);
            return true;

            // return _command355();
        }
        catch (e) {
            if (SceneManager._scene instanceof Scene_Map && $gameMessage) {
                $gameMessage.setSpeakerName(_speakerName);
                $gameMessage.setFaceImage(_faceImage, _faceImageIndex);
                $gameMessage.add(_preText);
                $gameMessage.add(`\\FS[${_stacktraceFontSize}]${e.message}\\FS[${$dataSystem.advanced.fontSize}]`);
                $gameMessage.add(`\\FS[${_stacktraceFontSize}]on event ${this._eventId} on map ${this._mapId}\\FS[${$dataSystem.advanced.fontSize}]`);
                $gameMessage.newPage();
                $gameMessage.add(_postText1);
                $gameMessage.add(_postText2);
                return;

            }
        }
    }

})();

