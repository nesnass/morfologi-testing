/// <reference path='_references.ts'/>

module ISPApp {
    'use strict';

    export interface IISPConstants {
        constants: {};
    }

    export class ISPConstants {
        public static get constants() {

            // Release number should be updated accordingly on new app releases  e.g.  isp_setup_r1.json, isp_storage_r1_sample.json
            return {
                SETUP_FILE_PATH: "content/",
                SETUP_FILE_NAME: "isp_setup_",   // add 'training_' to use training setup file
                STORAGE_FILE_NAME: "isp_storage",
                RELEASE_NUMBER: "r1",               // release number is referenced for both setup and storage files
                SKIP_DAY_PASSWORD: "frosk",
                FORMAL_TEST_DATE: new Date('September 18, 2016 23:59:59'),
                SAMPLE_TEST_NAME: 'sample',
                FORMAL_TEST_NAME: 'formal',
                RECORDING_LIFESPAN: 2592000000,  // 1000 * 60 * 60 * 24 * 30    =  30 days in milliseconds
                SHOW_CHEATS: true
            };
        };
    }
}
