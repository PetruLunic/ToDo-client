

export default class UncheckedContainer{
    constructor(container) {
        this.container = container.querySelector('.tasks-container__unchecked');
    }

    isEmpty(){
        return !this.container.hasChildNodes();
    }

    all(tasks){
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
            taskElement.setAttribute('data-id', task._id);

            taskElement.innerHTML = ` <div class="task-content">
                <input type="checkbox" class="task-checkbox">
                <p class="task-text"></p>
            </div>
            <div class="task-settings">
                <button class="task-edit task-settings-item"><img class="task-settings-item-icon" src="assets/icons/pen-to-square-solid.svg" alt="edit"></button>
                <button class="task-delete task-settings-item"><img class="task-settings-item-icon" src="assets/icons/trash-can-solid.svg" alt="trash can"></button>
            </div>`

            const taskText = taskElement.querySelector('.task-text');
            taskText.innerText = task.text;

            this.container.prepend(taskElement);
        })
    }

    new(text, id){
        const task = document.createElement('div');
        task.classList.add('task');
        task.style.transform = 'translateY(-30px)';
        task.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox">
                <p class="task-text">
                    
                </p>
            </div>
            <div class="task-settings">
                <button class="task-edit task-settings-item"><img class="task-settings-item-icon" src="assets/icons/pen-to-square-solid.svg" alt="edit"></button>
                <button class="task-delete task-settings-item"><img class="task-settings-item-icon" src="assets/icons/trash-can-solid.svg" alt="trash can"></button>
            </div>`

        const taskText = task.querySelector('.task-text');
        taskText.innerText = text;

        task.dataset.id = id;

        this.container.prepend(task);

        setTimeout(() => {
            task.style.transform = '';
        }, 10);

        return task;
    }

    async delete(task){
        task.style.opacity = '0';
        task.style.maxHeight = '0';
        task.style.border = 'none';
        task.style.margin = '0';
        task.classList.add('deleted');

        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500)
        })

        task.remove();
    }

}