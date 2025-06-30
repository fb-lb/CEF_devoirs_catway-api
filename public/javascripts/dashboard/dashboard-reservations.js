import { addMessageElement } from "../../javascripts/module.js";

document.addEventListener('DOMContentLoaded', () => {
    // Management of the add reservation form
    const addReservationForm = document.getElementById('addReservationForm');

    addReservationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const dateChekcIn = addReservationForm.addReservationCheckInDate.value;
        const timeCheckIn = addReservationForm.addReservationCheckInTime.value;
        const checkInDateTime = new Date(`${dateChekcIn}T${timeCheckIn}`).toISOString();
        const dateChekcOut = addReservationForm.addReservationCheckOutDate.value;
        const timeCheckOut = addReservationForm.addReservationCheckOutTime.value;
        const checkOutDateTime = new Date(`${dateChekcOut}T${timeCheckOut}`).toISOString();
        let catwayId = '';
        
        try {
            const response = await fetch('/catways/all', {
                method: 'GET',
                headers: {'Content-Type': 'application/JSON'},
                credentials: 'include'
            });

            const data = await response.json();
            if (response.status == 200) {
                const catway = data.find(c => c.catwayNumber == addReservationForm.addReservationCatwayNumber.value);
                if (catway) {
                    catwayId = catway._id;
                } else {
                    addMessageElement('addReservationForm', 'messageAddReservation', 'error', "Ce numéro de catway ne correspond à aucun catway.");
                }
            } else {
                addMessageElement('addReservationForm', 'messageAddReservation', 'error', data.message);
            }
        } catch (error) {
            addMessageElement('addReservationForm', 'messageAddReservation', 'error', "Assurez-vous d'avoir rempli tous les champs.");
        }
        
        if (catwayId != '') {
            try {
                const response = await fetch(`/catways/${catwayId}/reservations`, {
                    method: addReservationForm.method,
                    headers: {'Content-Type': 'application/JSON'},
                    credentials: 'include',
                    body: JSON.stringify({
                        clientName: addReservationForm.addReservationClientName.value,
                        boatName: addReservationForm.addReservationBoatName.value,
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
        }
    });

    // Add dynamically reservation's informations on get reservation form if reservation's id is good
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
                const response = await fetch('catways/all/reservations/all', {
                    method: 'GET',
                    headers: {'Content-Type': 'application/JSON'},
                    credentials: 'include'
                });

                const data = await response.json();
                if (response.status == 200) {
                    const reservation = data.find(r => r._id == reservationIdValue);

                    if (reservation) {
                        const checkIn = new Date(reservation.checkIn);
                        const checkOut = new Date(reservation.checkOut);

                        getReservationClientName.innerHTML = reservation.clientName;
                        getReservationBoatName.innerHTML = reservation.boatName;
                        getReservationCatwayNumber.innerHTML = reservation.catwayNumber;
                        getReservationCheckIn.innerHTML = checkIn.toLocaleString();
                        getReservationCheckOut.innerHTML = checkOut.toLocaleString();

                        const messageGetReservation = document.getElementById('messageGetReservation');
                        if (messageGetReservation) {
                            messageGetReservation.remove();
                        }
                    } else {
                        addMessageElement('getReservationForm', 'messageGetReservation', 'error', 'Cet identifiant ne correspond à aucune réservation enregistrée.');
                    }
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
    const updateReservationInitialCatway = document.getElementById('updateReservationInitialCatway');
    const updateReservationCheckInDate = document.getElementById('updateReservationCheckInDate');
    const updateReservationCheckInTime = document.getElementById('updateReservationCheckInTime');
    const updateReservationCheckOutDate = document.getElementById('updateReservationCheckOutDate');
    const updateReservationCheckOutTime = document.getElementById('updateReservationCheckOutTime');

    updateReservationId.addEventListener('input', async () => {
        const reservationIdValue = updateReservationId.value;

        if (reservationIdValue.length == 24) {
            try {
                const response = await fetch('/catways/all/reservations/all', {
                    method: 'GET',
                    headers: {'Content-Type': 'application/JSON'},
                    credentials: 'include',
                });

                const data = await response.json();
                if (response.status == 200) {
                    const reservation = data.find(r => r._id == reservationIdValue);
                    if (reservation) {
                        updateReservationClientName.value = reservation.clientName;
                        updateReservationBoatName.value = reservation.boatName;
                        updateReservationCatway.value = reservation.catwayNumber;
                        updateReservationInitialCatway.value = reservation.catwayNumber;
                        
                        const checkIn = new Date(reservation.checkIn);
                        const checkInYear = checkIn.getFullYear();
                        const checkInMonth = String(checkIn.getMonth() + 1).padStart(2, '0');
                        const checkInDay = String(checkIn.getDate()).padStart(2, '0');
                        const checkInHours = String(checkIn.getHours()).padStart(2, '0');
                        const checkInMinutes = String(checkIn.getMinutes()).padStart(2, '0');
                        updateReservationCheckInDate.value = `${checkInYear}-${checkInMonth}-${checkInDay}`;
                        updateReservationCheckInTime.value = `${checkInHours}:${checkInMinutes}`;
                        
                        const checkOut = new Date(reservation.checkOut);
                        const checkOutYear = checkOut.getFullYear();
                        const checkOutMonth = String(checkOut.getMonth() + 1).padStart(2, '0');
                        const checkOutDay = String(checkOut.getDate()).padStart(2, '0');
                        const checkOutHours = String(checkOut.getHours()).padStart(2, '0');
                        const checkOutMinutes = String(checkOut.getMinutes()).padStart(2, '0');
                        updateReservationCheckOutDate.value = `${checkOutYear}-${checkOutMonth}-${checkOutDay}`;
                        updateReservationCheckOutTime.value = `${checkOutHours}:${checkOutMinutes}`;

                        const messageUpdateReservation = document.getElementById('messageUpdateReservation');
                        if (messageUpdateReservation) {
                            messageUpdateReservation.remove();
                        }
                    } else {
                        addMessageElement('updateReservationForm', 'messageUpdateReservation', 'error', 'Cet identifiant ne correspond à aucune réservation enregistrée.');
                    }
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
            updateReservationInitialCatway.value = '';
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
        const dateChekcOut = updateReservationForm.updateReservationCheckOutDate.value;
        const timeCheckOut = updateReservationForm.updateReservationCheckOutTime.value;
        if(dateChekcIn != '' && timeCheckIn != '' && dateChekcOut != '' && timeCheckOut != '') {
            const checkInDateTime = new Date(`${dateChekcIn}T${timeCheckIn}`).toISOString();
            const checkOutDateTime = new Date(`${dateChekcOut}T${timeCheckOut}`).toISOString();
            let catwayId = '';
            
            if (updateReservationId.value.length == 24) {
                try {
                    const response = await fetch('/catways/all', {
                        method: 'GET',
                        headers: {"Content-Type": 'application/JSON'},
                        credentials: "include"
                    });

                    const data = await response.json();
                    if (response.status == 200) {
                        const catway = data.find(c => c.catwayNumber == updateReservationInitialCatway.value)
                        if (catway) {
                            catwayId = catway._id;
                        } else {
                            addMessageElement('updateReservationForm', 'messageUpdateReservation', 'error', 'La réservation est faite sur un catway inexistant, nous ne pouvons pas accéder à cette réservation.');
                        }
                    } else {
                        addMessageElement('updateReservationForm', 'messageUpdateReservation', 'error', data.message);
                    }
                } catch (error) {
                    addMessageElement('updateReservationForm', 'messageUpdateReservation', 'error', 'Nous ne parvenons pas à nous connecter au serveur.');
                }
                
                if (catwayId != '') {
                    try {
                        const response = await fetch(`/catways/${catwayId}/reservations/${updateReservationId.value}`, {
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
                }
            } else {
                addMessageElement('updateReservationForm', 'messageUpdateReservation', 'error', "L'identifiant de la réservation doit contenir 24 caractères (lettres et/ou chiffres).");
            }
        } else {
            addMessageElement('updateReservationForm', 'messageUpdateReservation', 'error', "Merci de renseigner les dates et les heures de départ et d'arrivée");
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
                const response = await fetch('/catways/all/reservations/all', {
                    method: 'GET',
                    headers: {'Content-Type': 'application/JSON'},
                    credentials: 'include'
                });

                const data = await response.json();
                if (response.status == 200) {
                    const reservation = data.find(r => r._id == deleteReservationId.value);
                    if (reservation) {
                        const checkIn = new Date(reservation.checkIn);
                        const checkOut = new Date(reservation.checkOut);
                        deleteReservationClientName.innerHTML = reservation.clientName;
                        deleteReservationBoatName.innerHTML = reservation.boatName;
                        deleteReservationCatwayNumber.innerHTML = reservation.catwayNumber;
                        deleteReservationCheckIn.innerHTML = checkIn.toLocaleString();
                        deleteReservationCheckOut.innerHTML = checkOut.toLocaleString();

                        const messageDeleteReservation = document.getElementById('messageDeleteReservation');
                        if (messageDeleteReservation) {
                            messageDeleteReservation.remove();
                        }
                    } else {
                        addMessageElement('deleteReservationForm', 'messageDeleteReservation', 'error', 'Cet identifiant ne correspond à aucune réservation enregistrée.');
                    } 
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
        let catwayId = '';

        try {
            const response = await fetch('/catways/all', {
                method: 'GET',
                headers: {'Content-Type': 'application/JSON'},
                credentials: 'include'
            });

            const data = await response.json();
            if (response.status == 200) {
                const catway = data.find(c => c.catwayNumber == deleteReservationCatwayNumber.innerHTML);
                if (catway) {
                    catwayId = catway._id;
                } else {
                    addMessageElement('deleteReservationForm', 'messageDeleteReservation', 'error', "Aucun catway n'est associé à cet identifiant de réservation.");
                }
            } else {
                addMessageElement('deleteReservationForm', 'messageDeleteReservation', 'error', data.message);
            }
        } catch (error) {
            addMessageElement('deleteReservationForm', 'messageDeleteReservation', 'error', 'Nous ne parvenons pas à nous connecter au serveur.');
        }

        if (catwayId != '') {
            try {
                const response = await fetch(`/catways/${catwayId}/reservations/${deleteReservationId.value}`, {
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
        }
    })
});