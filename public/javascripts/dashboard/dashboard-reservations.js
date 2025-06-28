import { addMessageElement } from "../../javascripts/module.js";

document.addEventListener('DOMContentLoaded', () => {
    // Management of the add reservation form
    const addReservationForm = document.getElementById('addReservationForm');

    addReservationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const dateChekcIn = addReservationForm.addCheckInDate.value;
        const timeCheckIn = addReservationForm.addCheckInTime.value;
        const checkInDateTime = new Date(`${dateChekcIn}T${timeCheckIn}`).toISOString();
        const dateChekcOut = addReservationForm.addCheckOutDate.value;
        const timeCheckOut = addReservationForm.addCheckOutTime.value;
        const checkOutDateTime = new Date(`${dateChekcOut}T${timeCheckOut}`).toISOString();
        try {
            const response = await fetch(addReservationForm.action, {
                method: addReservationForm.method,
                headers: {'Content-Type': 'application/JSON'},
                credentials: 'include',
                body: JSON.stringify({
                    catwayNumber: addReservationForm.addCatwayNumberReservation.value,
                    clientName: addReservationForm.addClientName.value,
                    boatName: addReservationForm.addBoatName.value,
                    checkIn: checkInDateTime,
                    checkOut: checkOutDateTime
                })
            });

            if (response.status == 204) {
                addReservationForm.reset();
                addMessageElement('addReservationForm', 'messageAddReservation', 'success', "La réservation a bien été enregistrée.");
            } else {
                const data = await response.json();
                addMessageElement('addReservationForm', 'messageAddReservation', 'error', data.message);
            }
        } catch (error) {
            addMessageElement('addReservationForm', 'messageAddReservation', 'error', "Assurez-vous d'avoir rempli tous les champs.");
        }
    });

    // Add dynamically reservation's informations on get reservation form if reservation's id is good
    const getReservationForm = document.getElementById("getReservationForm");
    const getReservationId = document.getElementById("getReservationId");
    const getReservationClientName = document.getElementById('getReservationClientName');
    const getReservationBoatName = document.getElementById('getReservationBoatName');
    const getReservationCatwayNumber = document.getElementById('getReservationCatwayNumber');
    const getReservationCheckIn = document.getElementById('getReservationCheckIn');
    const getReservationCheckOut = document.getElementById('getReservationCheckOut');

    getReservationId.addEventListener('input', async () => {
        const reservationIdValue = getReservationId.value;
        if (reservationIdValue.length == 24) {
            try {
                const response = await fetch(`${getReservationForm.action}/${reservationIdValue}`, {
                    method: getReservationForm.method,
                    headers: {'Content-Type': 'application/JSON'},
                    credentials: 'include'
                });

                const data = await response.json();
                if (response.status == 200) {
                    const checkIn = new Date(data.checkIn);
                    const checkOut = new Date(data.checkOut);

                    getReservationClientName.innerHTML = data.clientName;
                    getReservationBoatName.innerHTML = data.boatName;
                    getReservationCatwayNumber.innerHTML = data.catwayNumber;
                    getReservationCheckIn.innerHTML = checkIn.toLocaleString();
                    getReservationCheckOut.innerHTML = checkOut.toLocaleString();
                } else {
                    addMessageElement('getReservationForm', 'messageGetReservation', 'error', data.message);
                }
            } catch (error) {
                addMessageElement('getReservationForm', 'messageGetReservation', 'error', 'Nous ne parvenons pas à nous connecter au serveur.');
            }
        } else {
            getReservationClientName.innerHTML = '';
            getReservationBoatName.innerHTML = '';
            getReservationCatwayNumber.innerHTML = '';
            getReservationCheckIn.innerHTML = '';
            getReservationCheckOut.innerHTML = '';
            const messageGetReservation = document.getElementById('messageGetReservation');
            if (messageGetReservation) {
                messageGetReservation.remove();
            }
        }
    });

    // Add dynamically reservation's informations on update reservation form if reservation's id is good
    const updateReservationId = document.getElementById('updateReservationId');
    const updateReservationForm = document.getElementById('updateReservationForm');
    const updateReservationClientName = document.getElementById('updateReservationClientName');
    const updateReservationBoatName = document.getElementById('updateReservationBoatName');
    const updateReservationCatway = document.getElementById('updateReservationCatway');
    const updateReservationCheckInDate = document.getElementById('updateReservationCheckInDate');
    const updateReservationCheckInTime = document.getElementById('updateReservationCheckInTime');
    const updateReservationCheckOutDate = document.getElementById('updateReservationCheckOutDate');
    const updateReservationCheckOutTime = document.getElementById('updateReservationCheckOutTime');

    updateReservationId.addEventListener('input', async () => {
        const reservationIdValue = updateReservationId.value;

        if (reservationIdValue.length == 24) {
            try {
                const response = await fetch(`${updateReservationForm.action}/${reservationIdValue}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/JSON'},
                    credentials: 'include',
                });

                const data = await response.json();
                if (response.status == 200) {
                    updateReservationClientName.value = data.clientName;
                    updateReservationBoatName.value = data.boatName;
                    updateReservationCatway.value = data.catwayNumber;
                    
                    const checkIn = new Date(data.checkIn);
                    const checkInYear = checkIn.getFullYear();
                    const checkInMonth = String(checkIn.getMonth() + 1).padStart(2, '0');
                    const checkInDay = String(checkIn.getDate()).padStart(2, '0');
                    const checkInHours = String(checkIn.getHours()).padStart(2, '0');
                    const checkInMinutes = String(checkIn.getMinutes()).padStart(2, '0');
                    updateReservationCheckInDate.value = `${checkInYear}-${checkInMonth}-${checkInDay}`;
                    updateReservationCheckInTime.value = `${checkInHours}:${checkInMinutes}`;
                    
                    const checkOut = new Date(data.checkOut);
                    const checkOutYear = checkOut.getFullYear();
                    const checkOutMonth = String(checkOut.getMonth() + 1).padStart(2, '0');
                    const checkOutDay = String(checkOut.getDate()).padStart(2, '0');
                    const checkOutHours = String(checkOut.getHours()).padStart(2, '0');
                    const checkOutMinutes = String(checkOut.getMinutes()).padStart(2, '0');
                    updateReservationCheckOutDate.value = `${checkOutYear}-${checkOutMonth}-${checkOutDay}`;
                    updateReservationCheckOutTime.value = `${checkOutHours}:${checkOutMinutes}`;
                } else {
                    addMessageElement('updateReservationForm', 'messageUpdateReservation', 'error', data.message);
                }
            } catch (error) {
                addMessageElement('updateReservationForm', 'messageUpdateReservation', 'error', 'Nous ne parvenons pas à nous connecter au serveur.');
            }
        } else {
            updateReservationClientName.value = '';
            updateReservationBoatName.value = '';
            updateReservationCatway.value = '';
            updateReservationCheckInDate.value = '';
            updateReservationCheckInTime.value = '';
            updateReservationCheckOutDate.value = '';
            updateReservationCheckOutTime.value = '';
            const messageUpdateReservation = document.getElementById('messageUpdateReservation');
            if (messageUpdateReservation) {
                messageUpdateReservation.remove();
            }
        }
    });

    // Management of the update reservation form
    updateReservationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const dateChekcIn = updateReservationForm.updateReservationCheckInDate.value;
        const timeCheckIn = updateReservationForm.updateReservationCheckInTime.value;
        const checkInDateTime = new Date(`${dateChekcIn}T${timeCheckIn}`).toISOString();
        const dateChekcOut = updateReservationForm.updateReservationCheckOutDate.value;
        const timeCheckOut = updateReservationForm.updateReservationCheckOutTime.value;
        const checkOutDateTime = new Date(`${dateChekcOut}T${timeCheckOut}`).toISOString();
        try {
            const response = await fetch(`${updateReservationForm.action}/${updateReservationId.value}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/JSON'},
                credentials: 'include',
                body: JSON.stringify({
                    catwayNumber: updateReservationForm.updateReservationCatway.value,
                    clientName: updateReservationForm.updateReservationClientName.value,
                    boatName: updateReservationForm.updateReservationBoatName.value,
                    checkIn: checkInDateTime,
                    checkOut: checkOutDateTime
                })
            });

            if (response.status == 204) {
                updateReservationForm.reset();
                addMessageElement('updateReservationForm', 'messageUpdateReservation', 'success', 'La réservation a bien été modifiée.');
            } else {
                const data = await response.json();
                addMessageElement('updateReservationForm', 'messageUpdateReservation', 'error', data.message);
            }
        } catch (error) {
            addMessageElement('updateReservationForm', 'messageUpdateReservation', 'error', 'Nous ne parvenons pas à nous connecter au serveur.');
        }
    });

    // Add dynamically reservation's informations on delete reservation form if reservation's id is good
    const deleteReservationForm = document.getElementById('deleteReservationForm');
    const deleteReservationId = document.getElementById('deleteReservationId');
    const deleteReservationClientName = document.getElementById('deleteReservationClientName');
    const deleteReservationBoatName = document.getElementById('deleteReservationBoatName');
    const deleteReservationCatwayNumber = document.getElementById('deleteReservationCatwayNumber');
    const deleteReservationCheckIn = document.getElementById('deleteReservationCheckIn');
    const deleteReservationCheckOut = document.getElementById('deleteReservationCheckOut');

    deleteReservationId.addEventListener('input', async () => {
        const deleteReservationIdValue = deleteReservationId.value;
        if (deleteReservationId.value.length == 24) {
            try {
                const response = await fetch(`${deleteReservationForm.action}/${deleteReservationIdValue}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/JSON'},
                    credentials: 'include'
                });

                const data = await response.json();
                if (response.status == 200) {
                    const checkIn = new Date(data.checkIn);
                    const checkOut = new Date(data.checkOut);
                    deleteReservationClientName.innerHTML = data.clientName;
                    deleteReservationBoatName.innerHTML = data.boatName;
                    deleteReservationCatwayNumber.innerHTML = data.catwayNumber;
                    deleteReservationCheckIn.innerHTML = checkIn.toLocaleString();
                    deleteReservationCheckOut.innerHTML = checkOut.toLocaleString();
                } else {
                    addMessageElement('deleteReservationForm', 'messageDeleteReservation', 'error', data.message);
                }
            } catch (error) {
                addMessageElement('deleteReservationForm', 'messageDeleteReservation', 'error', 'Nous ne parvenons pas à nous connecter au serveur.');
            }
        } else {
            deleteReservationClientName.innerHTML = '';
            deleteReservationBoatName.innerHTML = '';
            deleteReservationCatwayNumber.innerHTML = '';
            deleteReservationCheckIn.innerHTML = '';
            deleteReservationCheckOut.innerHTML = '';
            const messageDeleteReservation = document.getElementById('messageDeleteReservation');
            if (messageDeleteReservation) {
                messageDeleteReservation.remove();
            }
        }
    });

    // Management of the delete reservation form
    deleteReservationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${deleteReservationForm.action}/${deleteReservationId.value}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/JSON'},
                credentials: 'include'
            });

            if (response.status == 204) {
                addMessageElement('deleteReservationForm', 'messageDeleteReservation', 'success', 'La réservation a bien été supprimée.');
                deleteReservationClientName.innerHTML = '';
                deleteReservationBoatName.innerHTML = '';
                deleteReservationCatwayNumber.innerHTML = '';
                deleteReservationCheckIn.innerHTML = '';
                deleteReservationCheckOut.innerHTML = '';
                deleteReservationForm.reset();
            } else {
                const data = await response.json();
                addMessageElement('deleteReservationForm', 'messageDeleteReservation', 'error', data.message);
            }
        } catch (error) {
            addMessageElement('deleteReservationForm', 'messageDeleteReservation', 'error', 'Nous ne parvenons pas à nous connecter au serveur.');
        }
    })
});