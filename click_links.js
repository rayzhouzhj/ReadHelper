var isLink = false;

var links = document.getElementsByClassName("word-item");
if (links.length == 0) {
    links = document.getElementsByTagName("a");
    isLink = true;
}

if (links.length - 1 == index) {
    alert(`Articles all read! total: ${index}`);
    chrome.runtime.sendMessage({ page: "home", status: "CLICK_DONE" });

} else {
    if (isLink) {
        let linkHref = links[index].href.trim();
        if (!linkHref.includes("javascript:void(0)") && /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test(linkHref)){
            console.log(`CLICK LINK-${index} => ${linkHref}`);
            window.open(linkHref);
            chrome.runtime.sendMessage({ page: "home", status: "CLICKED_LINK" });
        } else {
            chrome.runtime.sendMessage({ page: "home", status: "NO_LINK_CLICKED" });
        }
    } else {
        console.log(`CLICK LINK-${index} => ${links[index].textContent}`);
        links[index].click();
        chrome.runtime.sendMessage({ page: "home", status: "CLICKED_LINK" });
    }
}
