/*global angular*/

/*
 * An HTTP Plugin for PhoneGap.
 */


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
        success('test');
    }
};

module.exports = http;

if (typeof angular !== "undefined") {
    angular.module('cordovaHTTP', []).factory('cordovaHTTP', function($timeout, $q) {
        function makePromise(fn, args, async) {
            var deferred = $q.defer();

            var success = function(response) {
                if (async) {
                    $timeout(function() {
                        deferred.resolve(response);
                    });
                } else {
                    deferred.resolve(response);
                }
            };

            var fail = function(response) {
                if (async) {
                    $timeout(function() {
                        deferred.reject(response);
                    });
                } else {
                    deferred.reject(response);
                }
            };

            args.push(success);
            args.push(fail);

            fn.apply(http, args);

            return deferred.promise;
        }

        var cordovaHTTP = {
            getBasicAuthHeader: http.getBasicAuthHeader,
            useBasicAuth: function(username, password) {
                return http.useBasicAuth(username, password);
            },
            setHeader: function(header, value) {
                return http.setHeader(header, value);
            },
            get: function(url, params, headers) {
                return makePromise(http.get, [url, params, headers], true);
            }
        };
        return cordovaHTTP;
    });
} else {
    window.cordovaHTTP = http;
}
