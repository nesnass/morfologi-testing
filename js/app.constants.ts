/// <reference path="_references.ts"/>

namespace MorfologiApp {
    "use strict";

    export interface IMorfologiConstants {
        constants: {};
    }

    export class MorfologiConstants {
        public static get constants() {

            // Release number should be updated accordingly on new app releases  e.g.  isp_setup_r1.json, isp_storage_r1_sample.json
            return {
                USER_FILE: "samples/users.json",
                SESSION_FILE: "samples/sessions.json",
                MORF_FILE: "samples/morfer.json",
            };
        };
    }
}
