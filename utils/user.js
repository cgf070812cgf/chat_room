const users = []

function JoinRoom(id, name, room) {
    let user = { id, name, room }

    if ((users.findIndex(u => u.id === id)) === -1) {
        users.push(user)
    }

    // return users
}

function RoomNumberGet(room) {
    return users.filter(u => u.room === room)
}

function UserLeave(id) {
    let index = users.findIndex(u => u.id === id)

    if (index !== -1) {
        users.splice(index, 1)
    }
}

module.exports = {
    JoinRoom,
    RoomNumberGet,
    UserLeave,
}