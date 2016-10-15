/// <reference path="_references.ts"/>
var MorfologiApp;
(function (MorfologiApp) {
    "use strict";
    var MorfologiConstants = (function () {
        function MorfologiConstants() {
        }
        Object.defineProperty(MorfologiConstants, "constants", {
            get: function () {
                // Release number should be updated accordingly on new app releases  e.g.  isp_setup_r1.json, isp_storage_r1_sample.json
                return {
                    USER_FILE: "samples/users.json",
                    SESSION_FILE: "samples/sessions.json",
                    MORF_FILE: "samples/morfer.json",
                };
            },
            enumerable: true,
            configurable: true
        });
        ;
        return MorfologiConstants;
    }());
    MorfologiApp.MorfologiConstants = MorfologiConstants;
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=app.constants.js.map