import { addMessageElement } from '../../javascripts/module.js';

document.addEventListener('DOMContentLoaded', ()=>{
    
    // Management of the add user form
    let addUserForm = document.getElementById('addUserForm');

    addUserForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(addUserForm.action, {
                method: addUserForm.method,
                headers: {
                    'Content-Type': 'application/JSON'
                },
                credentials: 'include',
                body: JSON.stringify({
                    lastName: addUserForm.lastName.value,
                    firstName: addUserForm.firstName.value,
                    email: addUserForm.email.value,
                    password: addUserForm.password.value
                })
            });

            const data = await response.json();
            if (response.status == 201) {
                addUserForm.reset();
                addMessageElement('addUserForm', 'messageAddUser', 'success', data.message);
            } else {
                addMessageElement('addUserForm', 'messageAddUser', 'error', data.message);
            }
        } catch (error) {
            addMessageElement('addUserForm', 'messageAddUser', 'error', 'Nous ne parvenons pas à nous connecter au serveur');
        }
    });

    // Add dynamically user's informations on update user form if user's id is good
    let updateIdElement = document.getElementById('updateIdUser');

    updateIdElement.addEventListener('input', async () => {
        if (updateIdElement.value.length == 24) {
            let url = '/users/' + updateIdElement.value;
            
            try {
                let response = await fetch(url, {
                    method: 'get',
                    headers: {'Content-Type': 'application/JSON'},
                    credentials: 'include'
                });

                let data = await response.json();
                if (response.status == 200) {
                    let updateUserForm = document.getElementById('updateUserForm');
                    updateUserForm.updateEmailUser.value = data.email;
                    updateUserForm.updateLastNameUser.value = data.lastName;
                    updateUserForm.updateFirstNameUser.value = data.firstName;
                    updateUserForm.updateCurrentPasswordUser.value = '';
                    updateUserForm.updateNewPasswordUser.value = '';
                    const messageUpdateUser = document.getElementById('messageUpdateUser');
                    if (messageUpdateUser) messageUpdateUser.remove();
                } else {
                    addMessageElement('updateUserForm', 'messageUpdateUser', 'error', data.message);
                }
            } catch (error) {
                addMessageElement('updateUserForm', 'messageUpdateUser', 'error', 'Nous ne parvenons pas à nous connecter au serveur. Veuillez vérifier votre connexion internet.');
            }
        } else {
            updateUserForm.updateEmailUser.value = '';
            updateUserForm.updateLastNameUser.value = '';
            updateUserForm.updateFirstNameUser.value = '';
            updateUserForm.updateCurrentPasswordUser.value = '';
            updateUserForm.updateNewPasswordUser.value = '';
            const messageElement = document.getElementById('messageUpdateUser');
            if(messageElement) {
                messageElement.remove();
            }
        }
    });
    
    // Management of the update user form
    let updateUserForm = document.getElementById('updateUserForm');
    
    updateUserForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        let id = updateUserForm.updateIdUser.value;
        if(id.length == 24) {
            try {
                let url = `${updateUserForm.action}/${id}`;
                let response = await fetch(url, {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/JSON'},
                    credentials: 'include',
                    body: JSON.stringify({
                        email: updateUserForm.updateEmailUser.value,
                        lastName: updateUserForm.updateLastNameUser.value,
                        firstName: updateUserForm.updateFirstNameUser.value,
                        currentPassword: updateUserForm.updateCurrentPasswordUser.value,
                        newPassword: updateUserForm.updateNewPasswordUser.value
                    })
                });

                if (response.status == 204) {
                    updateUserForm.reset();
                    addMessageElement('updateUserForm', 'messageUpdateUser', 'success', 'Les modifications apportées ont bien été enregistrées');
                } else {
                    let data = await response.json();
                    addMessageElement('updateUserForm', 'messageUpdateUser', 'error', data.message);
                }
            } catch (error) {
                addMessageElement('updateUserForm', 'messageUpdateUser', 'error', 'Nous ne parvenons pas à nous connecter au serveur. Veuillez vérifier votre connexion internet.');
            }
    } else {
        addMessageElement('updateUserForm', 'messageUpdateUser', 'error', 'Le champs Identifiant est requis et doit comporter 24 caractères (chiffres et/ou lettres).');
    }
    });

    // Add dynamically user's information on update user form if user's is good
    let deleteIdElement = document.getElementById('deleteIdUser');

    deleteIdElement.addEventListener('input', async () => {
        let id = deleteIdElement.value;
        if (id.length == 24) {
            try {
                let url = `/users/${id}`;
                let response = await fetch(url, {
                    methode: 'GET',
                    headers: { 'Content-Type': 'application/JSON' },
                    credentials: 'include'
                });

                let data = await response.json();
                
                if (response.status == 200) {
                    addMessageElement('deleteUserForm', 'messageDeleteUser', '', `Voulez-vous supprimer l'utilisateur ${data.firstName} ${data.lastName} (${data.email}) ?`);
                } else {
                    addMessageElement('deleteUserForm', 'messageDeleteUser', 'error', data.message);
                }
            } catch (error) {
                addMessageElement('deleteUserForm', 'messageDeleteUser', 'error', 'Nous ne parvenons pas à nous connecter au serveur. Veuillez vérifier votre connexion internet.');
            }
        }
    });

    // Management of the delete user form
    let deleteUserForm = document.getElementById('deleteUserForm');

    deleteUserForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        let id = deleteUserForm.deleteIdUser.value;
        if (id.length == 24) {
            try {
                let url = `${deleteUserForm.action}/${id}`;
                let response = await fetch(url, {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/JSON'},
                    credentials: 'include',
                    body: JSON.stringify({ id: id })
                })

                if (response.status == 204) {
                    deleteUserForm.reset();
                    addMessageElement('deleteUserForm', 'messageDeleteUser', 'success', "L'utilisateur a bien été supprimé.");
                } else {
                    let data = await response.json();
                    addMessageElement('deleteUserForm', 'messageDeleteUser', 'error', data.message);
                }
            } catch (error) {
                addMessageElement('deleteUserForm', 'messageDeleteUser', 'error', 'Nous ne parvenons pas à nous connecter au serveur. Veuillez vérifier votre connexion internet.');
            }
        } else {
            addMessageElement('deleteUserForm', 'messageDeleteUser', 'error', 'Le champs Identifiant est requis et doit contenir 24 caractères (chiffres et/ou lettres).');
        }
    })
});