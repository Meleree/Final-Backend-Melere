import fs from 'fs';

class UserManager {
    constructor() {
        this.path = './users.json';
    }

    generateId = (users) => {
        if (users.length > 0) {
            return users[users.length - 1].id + 1;
        } else {
            return 1;
        }
    }

    getAllUsers = async () => {
        const userJson = await fs.promises.readFile(this.path, 'utf-8');
        const users = JSON.parse(userJson);
        return users;
    }

    getUsersById = async (userId) => {
        const userJson = await fs.promises.readFile(this.path, 'utf-8');
        const users = JSON.parse(userJson);
        const user = users.find((userData) => userData.id === userId);
        return user;
    }

    createUser = async (newUser) => {
        const usersJson = await fs.promises.readFile(this.path, 'utf-8');
        const users = JSON.parse(usersJson);
        const id = this.generateId(users);
        users.push({ id, ...newUser });
        await fs.promises.writeFile(this.path, JSON.stringify(users, null, 2), 'utf-8');
        return users;
    }

    updateUserById = async (userId, updatedData) => {
        const userJson = await fs.promises.readFile(this.path, 'utf-8');
        const users = JSON.parse(userJson);
        const index = users.findIndex(user => user.id === userId);
        users[index] = { ...users[index], ...updatedData };
        await fs.promises.writeFile(this.path, JSON.stringify(users, null, 2), 'utf-8');
        return users;
    }

    deleteUserById = async (userId) => {
        const usersJson = await fs.promises.readFile(this.path, 'utf-8');
        const users = JSON.parse(usersJson);
        const usersFilter = users.filter((userData) => userData.id !== userId);
        await fs.promises.writeFile(this.path, JSON.stringify(usersFilter, null, 2), 'utf-8');
        return usersFilter;
    }
}

export default UserManager;
