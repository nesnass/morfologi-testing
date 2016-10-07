/// <reference path='_references.ts'/>
var MorfologiApp;
(function (MorfologiApp) {
    'use strict';
    var MorfologiConstants = (function () {
        function MorfologiConstants() {
        }
        Object.defineProperty(MorfologiConstants, "constants", {
            get: function () {
                // Release number should be updated accordingly on new app releases  e.g.  isp_setup_r1.json, isp_storage_r1_sample.json
                return {
                    SETUP_FILE_PATH: "content/",
                    SETUP_FILE_NAME: "isp_setup_",
                    STORAGE_FILE_NAME: "isp_storage",
                    RELEASE_NUMBER: "r1",
                    SKIP_DAY_PASSWORD: "frosk",
                    FORMAL_TEST_DATE: new Date('September 18, 2016 23:59:59'),
                    SAMPLE_TEST_NAME: 'sample',
                    FORMAL_TEST_NAME: 'formal',
                    RECORDING_LIFESPAN: 2592000000,
                    SHOW_CHEATS: true
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