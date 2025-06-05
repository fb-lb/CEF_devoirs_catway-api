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
    })
})