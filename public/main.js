const socket = io() //建立连接
const params = Qs.parse(location.search, { ignoreQueryPrefix: true });

// console.log(params.name + ' ' + params.room)
const user_name = params.name
const room = params.room

document.getElementById('room_list').innerHTML += `<li class="list-group-item">${room}</li>`

const scorll = function () {
    let rightPanel = document.querySelector('.right-panel')
    let messageContainer = document.querySelector('.message-container')

    rightPanel.scrollTop = messageContainer.scrollHeight
}

socket.on('sys_message', (message) => {
    console.log(message)
})

socket.emit('join_room', ({ user_name, room }))

socket.on('uesr_room_data', (message) => {
    let usersHTML = document.querySelector('#users_list')
    let userlistHTML = ''

    message.map(x => {
        userlistHTML += `<li class="list-group-item">${x.name}</li>`
    })

    while (usersHTML.childNodes.length > 3) {
        usersHTML.removeChild(usersHTML.lastChild)
    }

    usersHTML.innerHTML += userlistHTML
})

document.getElementById('chart_form').addEventListener('submit', e => {
    e.preventDefault()
    let msgEl = document.getElementById('msg')
    // let time = new Date()

    if (msgEl.value) {
        socket.emit('chat_message', ({ name: user_name, content: msgEl.value }))
    }
    msgEl.value = ''
})

socket.on('chat_message', message => {
    let isMine = user_name === message.name

    document.querySelector('.message-container').innerHTML += `
    <div class="container">
        <div class="d-flex ${isMine ? 'justify-content-end' : 'justify-content-start'}">
            <div class="card mb-3">
                <div class="card-body ${isMine ? 'bg-success text-light' : ''}">
                    <div class="card-text"><b>${isMine ? 'me' : message.name}</b></div>
                    <div class="card-text">${message.content}</div>
                </div>
            </div>
        </div>
    </div>
    `
    // &nbsp;${message.time} 
    scorll()
})