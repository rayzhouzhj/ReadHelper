

function startReading(){

    let startIndex = document.getElementById("startIndex").value;
    let speed = document.getElementById("speed").value;
    let timeout = document.getElementById("timeout").value;
    let interval = document.getElementById("interval").value;
    let totalArticles = document.getElementById("totalArticles").value;

    if (!/^[0-9]+$/.test(startIndex)){
        alert("Reading index should be integer only!");
        return;
    }

    if (!/^[0-9]+$/.test(speed)) {
        alert("Scrolling speed should be integer only!");
        return;
    }

    if (!/^-?\d*(\.\d+)?$/.test(timeout)) {
        alert("Scrolling Interval is invalid!");
        return;
    }

    if (!/^-?\d*(\.\d+)?$/.test(interval)) {
        alert("Reading Interval is invalid!");
        return;
    }

    document.getElementById("startBtn").disabled = true;

    chrome.runtime.sendMessage({ 
        page: "popup", 
        status: "START", 
        index: startIndex, 
        readInterval: interval, 
        scrollSpeed: speed, 
        scrollTimeout: timeout,
        totalArticles: totalArticles,
    });
}

function stopReading() {
    document.getElementById("startBtn").disabled = false;

    chrome.runtime.sendMessage({ page: "popup", status: "STOP" });
}

chrome.runtime.onMessage.addListener(function (message, callback) {

    if (message.page === "background" && message.status === "RETURN_PARAM") {
        document.getElementById("startIndex").value = message.index;
        document.getElementById("speed").value = message.scrollSpeed;
        document.getElementById("timeout").value = message.scrollTimeout;
        document.getElementById("interval").value = message.readInterval;
        document.getElementById("startBtn").disabled = message.started;

    }

});

window.onload = function () {
    document.getElementById('startBtn').onclick = startReading;
    document.getElementById('stopBtn').onclick = stopReading;

    chrome.runtime.sendMessage({ page: "popup", status: "ASK_FOR_PARAM" });
}