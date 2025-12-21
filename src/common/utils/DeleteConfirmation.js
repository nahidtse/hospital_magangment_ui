// utils/DeleteConfirmation.js
import Swal from "sweetalert2";

export const DeleteConfirmation = async (message = "Are you sure you want to delete this?") => {
    return Swal.fire({
        title: 'Confirm Delete',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        buttonsStyling: false,
        customClass: {
            confirmButton: 'btn border mx-2',
            cancelButton: 'btn btn-primary mx-2'
        },
        confirmButtonText: 'Yes, delete it!'
    }).then(result => result.isConfirmed);
};