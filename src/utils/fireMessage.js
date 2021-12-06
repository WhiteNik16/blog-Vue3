import Swal from 'sweetalert2'

export function fireMessage(type, message){
    if (type === 'error') {
         Swal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            confirmButtonText: 'Ok',
        })
    }
    if (type === 'success') {
         Swal.fire({
            title: 'Success!',
            text: message,
            icon: 'success',
            confirmButtonText: 'Ok',
        })
    }
    if (type === 'info') {
         Swal.fire({
            title: 'Info',
            text: message,
            icon: 'info',
            confirmButtonText: 'Ok',
        })
    }
}


