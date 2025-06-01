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

    // Check if the user is connected
    let authenticateForm = document.getElementById('authenticateForm');
    let deconnectionForm = document.getElementById('deconnectionForm');
    let userFirstNameCookie = getCookieValue('firstName') == null ? null : decodeURIComponent(getCookieValue('firstName'));
    let userLastNameCookie = getCookieValue('lastName') == null ? null : decodeURIComponent(getCookieValue('lastName'));
    if (userFirstNameCookie != null && userLastNameCookie != null) {
        authenticateForm.classList.add('hidden');
        let message = `Vous êtes connecté en tant que ${userFirstNameCookie} ${userLastNameCookie}.`;
        addMessageElement('deconnectionForm', 'messageId', 'success', message);
    } else {
        deconnectionForm.classList.add('hidden');
        // for (let i=0; i<navLinkConnected.length; i++) {
        //     navLinkConnected.item(i).classList.add('hidden');
        // };
    }

    // Management of the authentification form submission

    authenticateForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(authenticateForm.action, {
                method: authenticateForm.method,
                headers: {
                    'Content-Type': 'application/JSON'
                },
                body: JSON.stringify({
                    email: authenticateForm.email.value,
                    password: authenticateForm.password.value
                })
            });

            const data = await response.json();
            if (response.status == 200) {
                const userFirstName = decodeURIComponent(getCookieValue('firstName'));
                const userLastName = decodeURIComponent(getCookieValue('lastName'));
                window.location.href = '/tableau-de-bord';
            } else {
                addMessageElement('authenticateForm', 'messageId', 'error', data.message);
            }
        } catch (error) {
            console.log(error);
            addMessageElement('authenticateForm', 'messageId', 'error', '1Nous ne parvenons pas à nous connecter au serveur. Vérifiez votre connexion internet.');
        }
    });
    

    // Management of deconnection form submission
    let navLinkConnected = document.getElementsByClassName('connected');

    deconnectionForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(deconnectionForm.action, {
                method: deconnectionForm.method,
                headers: {'Content-Type': 'application/JSON'},
                credentials: 'include'
            })

            const data = await response.json();
            if (response.status == 200) {
                authenticateForm.classList.toggle('hidden');
                deconnectionForm.classList.toggle('hidden');
                for (let i=0; i<navLinkConnected.length; i++) {
                    navLinkConnected.item(i).classList.toggle('hidden');
                };
                addMessageElement('authenticateForm', 'messageId', 'success', data.message);
            } else {
                addMessageElement('deconnectionForm', 'messageId', 'error', 'Une erreur est survenue veuillez recharger votre page.');
            }
        } catch (error) {
            let message = '2Nous ne parvenons pas à nous connecter au serveur. Vérifiez votre connexion internet.';
            addMessageElement('deconnectionForm', 'messageId', 'error', message);
        }
    });
})