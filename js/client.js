const socket = io('http://localhost:8000', {
    transports: ['websocket', 'polling', 'flashsocket']
})
const form = document.getElementById('chat-container')
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector('.container')


const appendElm = (message, position) => {
    console.log('message', message, 'position', position)
    const elm = document.createElement('div')
    elm.classList.add('message')
    elm.classList.add(position)
    elm.innerText = message
    messageContainer.append(elm)
    if (position === 'left') audio.play()
    messageContainer.scrollTop = messageContainer.scrollHeight
}

$('#uploadfile').bind('change', function (e) {
    var data = e.originalEvent.target.files[0];
    readThenSendFile(data);
});

function readThenSendFile(data) {

    var reader = new FileReader();
    reader.onload = function (evt) {
        var msg = {};
        msg.username = username;
        msg.file = evt.target.result;
        msg.fileName = data.name;
        socket.emit('base64 file', msg);
    };
    reader.readAsDataURL(data);
}

const name = prompt('Enter your name to join chat')

const audio = new Audio('./assets/sound.mp3')

socket.emit('new-user-joined', name)

socket.on('user-joined', name => {
    console.log('user-joined')
    appendElm(`${name} joined the chat, welcome!`, 'right')
})

socket.on('receive', async data => {
    console.log('receive', data)
    appendElm(`${data.name}: ${data.message}`, 'left')
})

socket.on('left', name => {
    console.log('left', name)
    appendElm(`${name}:left the chat`, 'left')
})

socket.on('user-already-exist', name => {
    console.log('left', name)
    appendElm(`${name}: user already exists`, 'right')
    socket.emit("")
})


form.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value.trim()
    if (message) {
        appendElm(`${message}`, 'right')
        socket.emit('send', message)
    }
    messageInput.value = ''
})
