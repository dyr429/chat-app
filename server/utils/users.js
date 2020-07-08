const users = [];

const addUser = ({ id, name }) => {
    name = name.trim().toLowerCase();

    const existingUser = users.find((user) => user.name === name);

    if(!name) return { error: 'Name cannot be empty' };
    if(name=="admin"||name=="Admin") return {error: "You cannot use this name"}
    if(existingUser) return { error: 'Name already exists, select another one' };

    const user = { id, name };

    users.push(user);

    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getAllUsers = () => users;

const getUserIdByName = (name) =>{
    let Id = ''
    users.forEach( user =>{
        if(user.name===name){
            Id = user.id
        }
    })

    return Id;
}

module.exports = { addUser, removeUser, getUser, getAllUsers,getUserIdByName };