/**
 * Created by tomasradvansky on 27/01/2017.
 */
"use strict";

function get(success, error, opts) {
    console.log(opts);
    success('This plugin cannot run in browser!');
}

module.exports = {
    get: get
};

require('cordova/exec/proxy').add('CordovaHttpPlugin', module.exports);
