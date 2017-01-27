/*global angular*/

/*
 * An HTTP Plugin for PhoneGap.
 */

var rp = require('request-promise');

// Thanks Mozilla: https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_.22Unicode_Problem.22
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

function mergeHeaders(globalHeaders, localHeaders) {
    var globalKeys = Object.keys(globalHeaders);
    var key;
    for (var i = 0; i < globalKeys.length; i++) {
        key = globalKeys[i];
        if (!localHeaders.hasOwnProperty(key)) {
            localHeaders[key] = globalHeaders[key];
        }
    }
    return localHeaders;
}

var http = {
    headers: {},
    sslPinning: false,
    get: function(url, params, headers, success, failure) {
        headers = mergeHeaders(this.headers, headers);
        rp(url)
            .then(function (htmlString) {
               success(htmlString);
            })
            .catch(function (err) {
                failure(err);
            });
    }
};

module.exports = http;

window.cordovaHTTP = http;
