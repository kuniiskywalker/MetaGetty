
/**
*
*
**/
var getMetaValue = function (attribute) {
    
    var meta = document.getElementsByTagName('meta'),
        len = meta.length;
    
    for (var i = 0; i < len; i++) {
        if (meta[i].getAttribute('name') == attribute) {
            return meta[i].getAttribute('content');
        }
    }
    return '';
}

/**
*
*
**/
var getOGValue = function (attribute) {
    
    var meta = document.getElementsByTagName('meta'),
        len = meta.length;
    
    for (var i = 0; i < len; i++) {
        if (meta[i].getAttribute('property') == attribute) {
            return meta[i].getAttribute('content');
        }
    }
    return '';
}

/**
*
*
**/
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

    sendResponse({
        1: location.href,
        2: document.title,
        3: getMetaValue('description'),
        4: getMetaValue('keywords'),
        5: getOGValue('og:title'),
        6: getOGValue('og:type'),
        7: getOGValue('og:description'),
        8: getOGValue('og:image'),
    });
});
