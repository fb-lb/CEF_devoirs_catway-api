function getCookieValue(cookieName) {
    if (document.cookie.includes(cookieName)) {
        let cookieValue = document.cookie.split(`${cookieName}=`).pop().split('; ')[0];
        return cookieValue;
    }
    else {
        return null;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    let navLinkConnected = document.getElementsByClassName('connected');
    let firstNameCookie = getCookieValue('firstName');
    console.log(firstNameCookie);
    if (firstNameCookie == null) {
        for (let i=0; i<navLinkConnected.length; i++) {
            navLinkConnected.item(i).classList.add('hidden');
        };
    }
});