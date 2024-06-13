const socket = io()

const chatBox = document.getElementById('chatBox')
const messageLogs = document.getElementById('messageLogs')
let user

Swal.fire({
    title: 'Please enter your name',
    input: 'text',
    text:  "You will be identified by this name in the chatroom",
    inputValidator: (valor) =>{
        return !valor && 'Ingrese un valor valido'
    },
    allowOutsideClick: false
    }).then((result)=>{
        user = result.value
        console.log(user);
})

chatBox.addEventListener('change', e=> {
    if(chatBox.value.trim().length >0){
        socket.emit ('mensaje', {usermessage: user, messa: chatBox.value, hora: new Date().toLocaleString()})
        chatBox.value=''
    }
})
socket.on('mensajeLogs', info => {
    messageLogs.innerHTML = ""
    info.forEach(mensaje => {
        messageLogs.innerHTML += `<p>${mensaje.hora}hs. Usuario ${mensaje.usuario} dice: ${mensaje.mensaje}</p>`
    })
})