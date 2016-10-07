/// <reference path="../_references.ts"/>

module MorfologiApp {

    "use strict";
    import MomentDuration = moment.Duration;

    interface Serializable<T> {
        deserialise(input: Object): T;
    }



}