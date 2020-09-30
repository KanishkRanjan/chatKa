const messageBox = document.querySelector('.chat-messages');
const messageForm = document.getElementById('chat-form');
const userList = document.getElementById("users");
const socket = io();

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = document.getElementById('msg').value;
    document.getElementById('msg').value = '';
    socket.emit('message', message);
    console.log(message);
});

function addMessage(message) {
    const box = document.createElement('div');
    box.className = 'message';
    box.innerHTML = `<p class="meta">${message.user} <span> ${message.time}</span></p><p class="text">${message.message}</p>`;
    messageBox.append(box);
    messageBox.scrollTop = messageBox.scrollHeight;
}

function showUsers(users) {
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = user.name;
        userList.append(li);
    });
}

socket.emit('newJoin', { username: username, room: room });

socket.on('sendMessage', message => {
    addMessage(message);
});

socket.on('roomCheck', ({ room, users }) => {
    document.getElementById("room-name").innerHTML = room;
    showUsers(users)
});