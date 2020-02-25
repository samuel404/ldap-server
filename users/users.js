const config = require("../config");
const fs = require("fs");

const doesUserExist = (attributes) => {
    const users = getUsers();
    if(attributes.system){
        return {userid:attributes.system , system:users[attributes.userid][attributes.system]}
    }
    const value = users[attributes.userid][Object.keys(users[attributes.userid])[0]];
    const key =  Object.keys(users[attributes.userid])[0];
    return {userid:key , system:value}
}

const getUsers = () => {
    const rawdata = fs.readFileSync('users.json');
    return JSON.parse(rawdata);
}

module.exports = {doesUserExist};