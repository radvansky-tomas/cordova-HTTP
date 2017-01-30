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
    post: function (url, params, headers, success, failure) {
        headers = mergeHeaders(this.headers, headers);
        var config = {
            method: 'post',
            url: url,
            headers: headers,
            data: params
        };

        return axios(config)
            .then(function (response) {
                success(response);
            })
            .catch(function (error) {
                failure(error);
            });
    },
    get: function(url, params, headers, success, failure) {
        headers = mergeHeaders(this.headers, headers);
        var config = {
            method: 'get',
            url: url,
            headers: headers,
            params: params
        };

        return axios(config)
            .then(function (response) {
                success(response);
            })
            .catch(function (error) {
                failure(error);
            });
    },
    uploadFile: function (url, params, headers, filePath, name, success, failure) {
        headers = mergeHeaders(this.headers, headers);
        var data = params;
        data.file = filePath;

        var config = {
            onUploadProgress: function(progressEvent) {
                var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                console.log('Upload - ' + percentCompleted + '%');
            }
        };
        return axios.put(url, data, config)
            .then(function (res) {
                success(res);
            })
            .catch(function (err) {
                failure(err);
            });
    }
};

module.exports = http;

window.cordovaHTTP = http;
