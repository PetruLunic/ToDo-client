export default class Settings{
    constructor(token){
        this.token = token;
        this.baseUrl = `${window.origin}/user/settings`;
    }

    async showSettings(){
        const res = await fetch(this.baseUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })

        return res;
    }

    async resetPassword(oldPassword, newPassword){
        const res = await fetch(this.baseUrl + '/resetPassword', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                oldPassword,
                newPassword
            })
        })

        return res;
    }
}