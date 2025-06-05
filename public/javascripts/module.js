export function addMessageElement(formId, messageId, messageClass, messageText) {
    let messageElement = document.getElementById(messageId);
    if (messageElement) {
        messageElement.setAttribute('class', messageClass);
        messageElement.innerHTML = messageText;
    } else {
        messageElement = document.createElement('p');
        messageElement.setAttribute('id', messageId);
        messageElement.setAttribute('class', messageClass);
        let messageTextNode = document.createTextNode(messageText);
        messageElement.appendChild(messageTextNode);
        let formElement = document.getElementById(formId);
        formElement.appendChild(messageElement);
    }
};