export default class Tasks {
    constructor() {
        if (!localStorage.getItem('tasks')){
            localStorage.setItem('tasks', JSON.stringify([]));
        }
    }
    getAll(){
        return JSON.parse(localStorage.getItem('tasks'));
    }
    new(text){
        const tasks = this.getAll();
        const _id = Date.now();
        tasks.push({text, checked: false, _id});
        localStorage.setItem('tasks', JSON.stringify(tasks));

        return _id;
    }

    delete(id){
        const tasks = this.getAll();
        tasks.splice(tasks.findIndex(task => task._id === id), 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    check(id){
        const tasks = this.getAll();
        tasks[tasks.findIndex(task => task._id == id)].checked = !tasks[tasks.findIndex(task => task._id == id)].checked;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    edit(id, text){
        const tasks = this.getAll();
        tasks[tasks.findIndex(task => task._id == id)].text = text;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    deleteAllChecked(){
        let tasks = this.getAll();
        tasks = tasks.filter(task => !task.checked);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}