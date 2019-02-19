function scroll(scrollSpeed, interval){
    let previous = window.scrollY;
    window.scrollBy(0, scrollSpeed);
    let current = window.scrollY;

    if(current === previous){
        chrome.runtime.sendMessage({ page: "article", status: "ViEW_DONE" });
        window.close();
    }else {
        setTimeout(scroll, interval, scrollSpeed, interval);
    }
}

scroll(speed, timeout * 1000);