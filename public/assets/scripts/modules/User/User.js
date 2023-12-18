import Tasks from './Tasks.js';
import Settings from "./Settings.js";

export default class User{
    constructor(token){
        this.token = token;
        this.baseUrl = `${window.origin}/user`;
        this.tasks = new Tasks(this.token);
        this.settings = new Settings(this.token);
    }

    async isAuthorized(){
        const res = await fetch(this.baseUrl + '/getUsername',{
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        return res.statusText === "OK";
    }

    async getUsername(){
        const res = await fetch(this.baseUrl + '/getUsername',{
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })

        return res;
    }
}