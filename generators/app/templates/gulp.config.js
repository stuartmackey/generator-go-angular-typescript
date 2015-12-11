"use strict";
var GulpConfig = (function () {
    function GulpConfig() {

        this.source = "./";
        this.sourceApp = this.source + "app/";

        this.tsOutputPath = this.source + "/dist/scripts/js";
        this.allJavaScript = [this.source + "/js/**/*.js"];
        this.allTypeScript = this.sourceApp + "**/*.ts";
        this.ignoreTypeScript =  "!" + this.sourceApp + "**/*.spec.ts";
        this.allGeneratedJs = this.tsOutputPath + "/**/*.js";

        this.unitTestTypeScript =  this.sourceApp + "**/*.spec.ts";

        this.lessOutputPath = this.source + "/dist/assets/css";
        this.allAssets = this.source + "assets/";
        this.allLess = this.allAssets + "less/**/*.less";
        this.allGeneratedCss = this.lessOutputPath + "/**/*.css";

        this.typings = "./tools/typings/";
        this.libraryTypeScriptDefinitions = "./tools/typings/**/*.ts";
        this.appTypeScriptReferences = this.typings + "app.d.ts";

        this.constantsFile = this.source + 'app.constants.ts';

        this.live_api_endpoint = 'https://api.live.net';
        this.beta_api_endpoint = 'http://api.beta.net';
        this.dev_api_endpoint = 'http://api.develop.net';
    }
    return GulpConfig;
})();
module.exports = GulpConfig;
