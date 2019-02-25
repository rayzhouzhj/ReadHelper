

function read(scrollSpeed, interval) {
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
        setTimeout(read, interval, scrollSpeed, interval);
    }
}

function watchVideo(video){
    video.onended = () => {
        chrome.runtime.sendMessage({ page: "article", status: "ViEW_DONE" });
        window.close();
    }
}

chrome.runtime.onMessage.addListener(function (message, callback) {
    if (message.page === "background" && message.status === "STOP_SCROLLING") {
        stopMe = true;
    }
});

var stopMe = false;
var videos = document.getElementsByTagName("video");
if (videos.length > 0){
    watchVideo(videos[0]);
} else {
    read(speed, timeout * 1000);
}
