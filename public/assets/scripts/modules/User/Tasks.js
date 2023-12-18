export default class Tasks {
    constructor(token){
        this.token = token;
        this.baseUrl = `${window.origin}/user/task`
    }

    async getAll(){
        const res = await fetch(this.baseUrl + '/getAll',{
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })

        return res;
    }

    async new(text, checked){
        const res = await fetch(this.baseUrl + '/new',{
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                    text: text,
                    checked: checked
                }
            )
        })

        return res;
    }

    async delete(id){
        const res = await fetch(this.baseUrl + '/delete',{
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                id
            })
        })

        return res;
    }

    async check(id){
        const res = await fetch(this.baseUrl + '/check',{
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                id
            })
        })

        return res;
    }

    async edit(id ,text){
        const res = await fetch(this.baseUrl + '/edit',{
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                id,
                text
            })
        })

        return res;
    }

    async deleteAllChecked(){
        const res = await fetch(this.baseUrl + '/deleteAllChecked',{
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })

        return res;
    }
}

