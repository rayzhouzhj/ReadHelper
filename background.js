
var currentLinkIndex=1;
var startReading=false;
var interval = 2;
var speed=10;
var timeout=0.5;

function readArticle() {
    chrome.windows.getCurrent(function (currentWindow) {
        chrome.tabs.query({ active: true, windowId: currentWindow.id },
            function (activeTabs) {
                chrome.tabs.executeScript(
                    activeTabs[0].id,
                    {
                        code: `var speed = ${speed}; var timeout = ${timeout};`
                    },
                    function () {
                        chrome.tabs.executeScript(activeTabs[0].id,
                            { file: 'scroll.js', allFrames: true });
                    });
            });
    });
};

function clickLink() {
    
    chrome.windows.getCurrent(function (currentWindow) {
        chrome.tabs.query({ active: true, windowId: currentWindow.id },

            function (activeTabs) {
                chrome.tabs.executeScript(
                    activeTabs[0].id,
                    {
                        code: `var index = ${currentLinkIndex};`
                    },
                    function () {
                        chrome.tabs.executeScript(activeTabs[0].id,
                            { file: 'click_links.js', allFrames: true });
                    });
            });
    });
};

chrome.runtime.onMessage.addListener(function (message, callback) {

    if (message.page === "popup" && message.status === "START") {
        startReading = true;
        currentLinkIndex = message.index;
        speed = message.scrollSpeed;
        timeout = message.scrollTimeout;
        interval = message.readInterval;

        setTimeout(clickLink, 2000);

    } else if (message.page === "popup" && message.status === "STOP") {
        startReading = false;

    } else if (message.page === "popup" && message.status === "ASK_FOR_PARAM") {
        chrome.runtime.sendMessage({ 
            page: "background", 
            status: "RETURN_PARAM", 
            started: startReading,
            index: currentLinkIndex,
            readInterval: interval,
            scrollSpeed: speed,
            scrollTimeout: timeout });

    } else if (startReading && message.page === "home" && message.status === "CLICKED_LINK") {

        // if (currentLinkIndex > 3) {
        //     startReading = false;
        //     chrome.runtime.sendMessage({ page: "backgroud", status: "ALL_DONE", index: currentLinkIndex });
        // } else {
            setTimeout(readArticle, 1000);
            currentLinkIndex++;
        // }

    } else if (startReading && message.page === "home" && message.status === "NO_LINK_CLICKED") {
        // read next article
        currentLinkIndex++;
        clickLink();
 
    } else if (startReading && message.page === "home" && message.status === "CLICK_DONE") {
        startReading = false;
        chrome.runtime.sendMessage({ page: "backgroud", status: "ALL_DONE", index: currentLinkIndex });

    } else if (startReading && message.page === "article" && message.status === "ViEW_DONE") {
        setTimeout(clickLink, interval * 1000);
    }
  });