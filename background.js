
/**
*
*
**/
function sourceGet(port, data){
    port.postMessage(data);
}

/**
*
*
**/
chrome.runtime.onInstalled.addListener(function() {
    var data = [1, 2, 3, 4];
    localStorage['settings'] = JSON.stringify(data);
});

/**
*
*
**/
chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        
        switch (port.name) {

            case('preview'):
                
                // var urlAry = msg.urls;
                
                // for (i = 0; i < urlAry.length; i++) {
                    chrome.tabs.create({
                        url: msg.url,
                        selected: false
                    }, function (tab1) {

                        var spTabId = tab1.id;
                        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
                            if (spTabId == tabId && tab.status === 'complete') {
                                chrome.tabs.sendMessage(tabId, {}, function(response) {
                                    sourceGet(port, response);
                                    
                                    chrome.tabs.remove(tabId);
                                });
                            }
                        });
                    });
                // }
                
                break;

            case('tab'):

                // chrome.tabs.getAllInWindow(null, function (tabs) {
                //     var len = tabs.length;
                //     for (var i = 0; i < len; i++) {
                //         chrome.tabs.sendRequest(tabs[i].id, {name: "select"}, function(response) {
                //             var lastError = chrome.runtime.lastError;
                //             alert( lastError.message );
                //         });
                //     }
                // }); 
                // var tabAry = msg.tabs;

                // for (i = 0; i < tabAry.length; i++) {

                //     var tabId = tabAry[i].id;
                //     chrome.tabs.sendMessage(tabId, {}, function(response) {
                        
                //         var lastError = chrome.runtime.lastError;
                //         sourceGet(port, lastError);
                //         // chrome.tabs.remove(tabId);
                //     });
                // }

                break;
        }
        
    });
});
