import { addMessageElement } from '../../javascripts/module.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // Management of the add catway form
    const addCatwayForm = document.getElementById('addCatwayForm');

    addCatwayForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(addCatwayForm.action, {
                method: addCatwayForm.method,
                headers: {'Content-Type': 'application/JSON'},
                credentials: 'include',
                body: JSON.stringify({
                    catwayNumber: addCatwayForm.addCatwayNumber.value,
                    type: addCatwayForm.addCatwayType.value,
                    catwayState: addCatwayForm.addCatwayState.value
                })
            });

            const data = await response.json();
            if (response.status == 201) {
                addCatwayForm.reset();
                addMessageElement('addCatwayForm', 'messageAddCatway', 'success', data.message);
            } else {
                addMessageElement('addCatwayForm', 'messageAddCatway', 'error', data.message);
            }
        } catch (error) {
            addMessageElement('addCatwayForm', 'messageAddCatway', 'error', 'Nous ne parvenons pas à nous connecter au serveur.');
        }
    });

    // Add dynamically catway's informations on get catway form if catway's id is good
    const getCatwayId = document.getElementById('getCatwayId');
    const getCatwayNumber = document.getElementById('getCatwayNumber');
    const getCatwayState = document.getElementById('getCatwayState');
    const getCatwayType = document.getElementById('getCatwayType');

    getCatwayId.addEventListener('input', async () => {
        const catwayIdValue = getCatwayId.value;
        if (catwayIdValue.length == 24) {
            try {
                const response = await fetch(`/catways/${catwayIdValue}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'JSON/application'},
                    credentials: 'include'
                });

                const data = await response.json();
                if (response.status == 200) {
                    getCatwayNumber.innerHTML = data.catwayNumber;
                    getCatwayState.innerHTML = data.catwayState;
                    getCatwayType.innerHTML = data.type;
                } else {
                    addMessageElement('getCatwayForm', 'messageGetCatway', 'error', data.message);
                }
            } catch (error) {
                addMessageElement('getCatwayForm', 'messageGetCatway', 'error', 'Nous ne parvenons pas à nous connecter au serveur.');
            }
        } else {
            getCatwayNumber.innerHTML = "";
            getCatwayState.innerHTML = "";
            getCatwayType.innerHTML = "";
            const messageGetCatway = document.getElementById('messageGetCatway');
            if (messageGetCatway) {
                messageGetCatway.remove();
            }
        }
    });

    // Management of the update catway form
    const updateCatwayForm = document.getElementById('updateCatwayForm');
    const updateCatwayId = document.getElementById('updateCatwayId');

    updateCatwayForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (updateCatwayId.value.length == 24) {
            try {
                const response = await fetch(`${updateCatwayForm.action}/${updateCatwayId.value}`, {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/JSON'},
                    credentials: 'include',
                    body: JSON.stringify({
                        catwayNumber: updateCatwayForm.updateCatwayNumber.value,
                        type: updateCatwayForm.updateCatwayType.value,
                        catwayState: updateCatwayForm.updateCatwayState.value
                    })
                });

                if (response.status == 204) {
                    updateCatwayForm.reset();
                    addMessageElement('updateCatwayForm', 'messageUpdateCatway', 'success', 'Le catway a bien été mis à jour.');
                } else {
                    const data = await response.json();
                    addMessageElement('updateCatwayForm', 'messageUpdateCatway', 'error', data.message);
                }
            } catch (error) {
                addMessageElement('updateCatwayForm', 'messageUpdateCatway', 'error', "Nous ne parvenons pas à nous connecter au serveur.");
            }
        } else {
            addMessageElement('updateCatwayForm', 'messageUpdateCatway', 'error', "L'identifiant doit faire 24 caractères.");
        }
    });

    // Add dynamically catway's informations on update catway form if catway's id is good
    const updateCatwayNumber = document.getElementById('updateCatwayNumber');
    const updateCatwayState = document.getElementById('updateCatwayState');
    const updateCatwayType = document.getElementById('updateCatwayType');

    updateCatwayId.addEventListener('input', async () => {
        const id = updateCatwayId.value;

        if (id.length == 24) {
            try {
                const response = await fetch(`${updateCatwayForm.action}/${id}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/JSON'},
                    credentials: 'include'
                });

                const data = await response.json();
                if (response.status == 200) {
                    updateCatwayNumber.value = data.catwayNumber;
                    updateCatwayState.value = data.catwayState;
                    updateCatwayType.value = data.type;
                } else {
                    addMessageElement('updateCatwayForm', 'messageUpdateCatway', 'error', data.message);
                }
            } catch (error) {
                addMessageElement('updateCatwayForm', 'messageUpdateCatway', 'error', 'Nous ne parvenons pas à nous connecter au serveur.');
            }
        } else {
            const messageUpdateCatway = document.getElementById('messageUpdateCatway');
            if (messageUpdateCatway) {
                messageUpdateCatway.innerHTML = '';
            }
        }
    });

    // Management of the delete catway form
    const deleteCatwayForm = document.getElementById('deleteCatwayForm');
    const deleteCatwayId = document.getElementById('deleteCatwayId');

    deleteCatwayForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${deleteCatwayForm.action}/${deleteCatwayId.value}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'JSON/application'},
                credentials: 'include'
            });

            if (response.status == 204) {
                deleteCatwayForm.reset();
                addMessageElement('deleteCatwayForm', 'messageDeleteCatway', 'success', 'Le catway a bien été supprimé.');
            } else {
                const data = await response.json();
                addMessageElement('deleteCatwayForm', 'messageDeleteCatway', 'error', data.message);
            }
        } catch (error) {
            console.log(error);
            addMessageElement('deleteCatwayForm', 'messageDeleteCatway', 'error', "Nous ne parvenons pas à nous connecter au serveur. Assurez-vous que l'identifiant fait 24 caractères.");
        }
    });

    // Add dynamically catway's informations on delete catway form if catway's id is good
    deleteCatwayId.addEventListener('input', async () => {
        const id = deleteCatwayId.value;
        if (id.length == 24) {
            try {
                const response = await fetch(`${deleteCatwayForm.action}/${id}`, {
                    method: 'get',
                    headers: {'Content-Type': 'application/JSON'},
                    credentials: 'include'
                });

                const data = await response.json();
                if (response.status == 200) {
                    addMessageElement('deleteCatwayForm', 'messageDeleteCatway', '', `Voulez-vous supprimer le catway n°${data.catwayNumber} de type ${data.type} dont l'état est défini comme "${data.catwayState}".`);
                } else {
                    addMessageElement('deleteCatwayForm', 'messageDeleteCatway', 'error', data.message);
                }
            } catch (error) {
                addMessageElement('deleteCatwayForm', 'messageDeleteCatway', 'error', 'Nous ne parvenons pas à nous connecter au serveur.');
            }
        } else {
            const messageDeleteCatway = document.getElementById('messageDeleteCatway');
            if (messageDeleteCatway) {
                messageDeleteCatway.innerHTML = '';
            }
        }
    });
});