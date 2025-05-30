function addMessageElement(formId, messageId, messageClass, messageText) {
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

async function addUser() {
    lastName = document.getElementById("lastName").value;
    firstName = document.getElementById("firstName").value;
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    idMessage = 'messageAddUser';

    const response = await fetch('/users/', {
        method: "POST",
        headers: {
            'Content-Type': 'application/JSON'
        },
        body: JSON.stringify({
            lastName: lastName,
            firstName: firstName,
            email: email,
            password: password
        })
    });

    if (response.status == 201) {
        const data = await response.json();
        addMessageElement('addUserForm', 'messageAddUser', 'success', data.message);
    } else {
        const data = await response.json();
        addMessageElement('addUserForm', 'messageAddUser', 'error', data.message);
    }
};