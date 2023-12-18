

export default class CheckedContainer{
    constructor(container) {
        this.container = container.querySelector('.tasks-container__checked');
        this.innerContainer = this.container.querySelector('.tasks-container__checked-inner');
        this.headerContainer = this.container.querySelector('.tasks-container__checked-header');

        this.headerTitle = this.headerContainer.querySelector('.tasks-container__checked-header__title');
        this.headerIcon = this.headerContainer.querySelector('.tasks-container__checked-header__icon');

        // default collapsed
        this.container.classList.add('collapsed');
        this.innerContainer.style.display = 'none';
    }

    isEmpty(){
        return !this.innerContainer.hasChildNodes();
    }

    all(tasks){
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
            taskElement.setAttribute('data-id', task._id);

            taskElement.innerHTML = ` <div class="task-content task-checked">
                <input type="checkbox" class="task-checkbox" checked>
                <p class="task-text"></p>
            </div>
            <div class="task-settings">
                <button class="task-edit task-settings-item"><img class="task-settings-item-icon" src="assets/icons/pen-to-square-solid.svg" alt="edit"></button>
                <button class="task-delete task-settings-item"><img class="task-settings-item-icon" src="assets/icons/trash-can-solid.svg" alt="trash can"></button>
            </div>`

            const taskText = taskElement.querySelector('.task-text');
            taskText.innerText = task.text;

            this.innerContainer.prepend(taskElement);
        });

        this.onchange();
    }

    new(text, id){
        const task = document.createElement('div');
        task.classList.add('task');
        task.style.transform = 'translateY(-30px)';
        task.innerHTML = `
            <div class="task-content task-checked">
                <input type="checkbox" class="task-checkbox" checked>
                <p class="task-text"></p>
            </div>
            <div class="task-settings">
                <button class="task-edit task-settings-item"><img class="task-settings-item-icon" src="assets/icons/pen-to-square-solid.svg" alt="edit"></button>
                <button class="task-delete task-settings-item"><img class="task-settings-item-icon" src="assets/icons/trash-can-solid.svg" alt="trash can"></button>
            </div>`

        const taskText = task.querySelector('.task-text');
        taskText.innerText = text;

        task.dataset.id = id;

        this.innerContainer.prepend(task);

        setTimeout(() => {
            task.style.transform = '';
        }, 10);

        this.onchange();
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
        this.onchange();
    }

    onchange(){
        const tasksNr = this.headerTitle.querySelector('span');
        tasksNr.innerText = this.innerContainer.childNodes.length;

        if (!this.isEmpty()){
            this.container.style.display = 'block';
        } else{
            this.container.style.display = 'none';
        }
    }

    collapse(e){
        e.preventDefault();

        // if was clicked clearBtn
        const clearBtn = e.target.closest('.tasks-container__checked-header__clear');
        if (clearBtn) return;

        const header = e.target.closest('.tasks-container__checked-header');
        if (!header) return;

        if (this.container.classList.contains('collapsed')){
            this.container.classList.remove('collapsed');
            this.innerContainer.style.display = 'block';
            this.headerIcon.style.transform = 'rotate(90deg)';
            this.headerContainer.style.border = 'none';

            this.innerContainer.style.transform = 'translateY(-20px)';
            this.innerContainer.style.opacity = '0';
            setTimeout(() => {
                this.innerContainer.style.transform = '';
                this.innerContainer.style.opacity = '';
            }, 0);
        } else{
            this.container.classList.add('collapsed');
            this.innerContainer.style.display = 'none';
            this.headerIcon.style.transform = '';
            this.headerContainer.style.border = '';
        }
    }

    clearAll(){
        this.innerContainer.innerHTML = '';

        this.onchange();
    }


}