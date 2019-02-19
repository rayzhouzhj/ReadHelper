var stopMe = false;

function scroll(scrollSpeed, interval) {
    let previous = window.scrollY;
    window.scrollBy(0, scrollSpeed);
    let current = window.scrollY;

    if (stopMe){
        alert("Stopped!");
        return;
    }
    
    if (current === previous) {
        chrome.runtime.sendMessage({ page: "article", status: "ViEW_DONE" });
        window.close();
    } else {
        setTimeout(scroll, interval, scrollSpeed, interval);
    }
}

chrome.runtime.onMessage.addListener(function (message, callback) {
    // alert("Received from scroll.js");
    if (message.page === "background" && message.status === "STOP_SCROLLING") {
        stopMe = true;
    }
});

scroll(speed, timeout * 1000);