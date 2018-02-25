/**
 * Huawei OBS Helper for Javascript
 * MoeArt Dev. Team
 */
window.ObsHelper = {};

/**
 * Base64 Image convert to Blob data
 *
 * @param b64Data
 * @param contentType
 * @param sliceSize
 * @returns {*}
 */
ObsHelper.b64toBlob = function (b64Data, contentType, sliceSize)
{
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
};

ObsHelper.uploader = function (args)
{
    // parse content type
    var extname = 'jpg';
    if (args.contentType.indexOf('jpeg') > 0) extname = 'jpg';
    else if (args.contentType.indexOf('jpg') > 0) extname = 'jpg';
    else if (args.contentType.indexOf('png') > 0) extname = 'png';
    else if (args.contentType.indexOf('gif') > 0) extname = 'gif';
    else if (args.contentType.indexOf('bmp') > 0) extname = 'bmp';
    else if (args.contentType.indexOf('tiff') > 0) extname = 'tif';
    else if (args.contentType.indexOf('webp') > 0) extname = 'webp';
    var keyName = args.obsPolicy.Key + extname;
    var prefix = args.obsPolicy.Prefix;

    // init xhr
    var xmlhttp = new XMLHttpRequest();
    var fd = new FormData();
    fd.append('key', keyName);
    fd.append('Content-Type', args.contentType);
    fd.append('AWSAccessKeyId', args.obsPolicy.AceessId);
    fd.append('policy',  args.obsPolicy.Policy);
    fd.append('signature', args.obsPolicy.Signature);
    fd.append("file", args.blobData);

    // upload progress change event
    if (args.onprogress)
        xmlhttp.upload.onprogress = args.onprogress;

    xmlhttp.onreadystatechange = function ()
    {
        switch(xmlhttp.readyState)
        {
            case 0: // init
                break;
            case 1: // connected
                break;
            case 2: // headers_received
                break;
            case 3: // processing
                break;
            case 4: // finished
                if (args.onsuccess && (xmlhttp.status >= 200 && xmlhttp.status < 400))
                    args.onsuccess.call(this, keyName, prefix, xmlhttp);
                else if (args.onerror)
                    args.onerror.call(this, xmlhttp);
                break;
        }
    };

    // do upload
    xmlhttp.withCredentials = false;
    xmlhttp.timeout = args.timeout ? args.timeout : 0;
    xmlhttp.open('POST', args.obsPolicy.Url, true);
    xmlhttp.send(fd);
};

/**
 * Get Policy from server
 * @param policyUrl
 * @param callback
 */
ObsHelper.getPolicy = function (policyUrl, callback)
{
    var xmlhttp  = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState === 4)
        {
            if (xmlhttp.status >= 200 && xmlhttp.status < 400)
                callback.call(this, JSON.parse(xmlhttp.responseText));
            else if (args.onerror)
                callback.call(this, false);
        }
    };
    xmlhttp.withCredentials = true;
    xmlhttp.timeout = 10000;
    xmlhttp.open('GET', policyUrl, true);
    xmlhttp.send();
};
