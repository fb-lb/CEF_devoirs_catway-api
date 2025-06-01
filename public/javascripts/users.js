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

document.addEventListener('DOMContentLoaded', ()=>{
    let addUserForm = document.getElementById('addUserForm');

    addUserForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(addUserForm.action, {
                method: addUserForm.method,
                headers: {
                    'Content-Type': 'application/JSON'
                },
                body: JSON.stringify({
                    lastName: addUserForm.lastName.value,
                    firstName: addUserForm.firstName.value,
                    email: addUserForm.email.value,
                    password: addUserForm.password.value
                })
            });

            if (response.status == 201) {
                const data = await response.json();
                addMessageElement('addUserForm', 'messageAddUser', 'success', data.message);
            } else {
                const data = await response.json();
                addMessageElement('addUserForm', 'messageAddUser', 'error', data.message);
            }
        } catch (error) {
            addMessageElement('addUserForm', 'messageAddUser', 'error', 'Nous ne parvenons pas à nous connecter au serveur');
        }
    });
});