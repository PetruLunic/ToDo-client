import feedback from "../feedback/feedback-alert.js";
import User from "../modules/User/User.js";
import Guest from "../modules/Guest/Guest.js";

import UncheckedContainer from "./UncheckedContainer.js";
import CheckedContainer from "./CheckedContainer.js";

export default class RenderTasks{
    constructor(input, submit, container){
        this.input = input;
        this.submit = submit;
        this.container = container;
        this.uncheckedContainer = new UncheckedContainer(this.container);
        this.checkedContainer = new CheckedContainer(this.container);

        this.user = new User(localStorage.getItem("token"));
        this.user.isAuthorized().then(data => {
            this.isAuthorized = data;
        })
        this.guest = new Guest();
    }

    // check if there are no tasks
    isEmpty(){
        return this.uncheckedContainer.isEmpty() && this.checkedContainer.isEmpty();
    }

    // create new task
    async new(event){
        try{
            event.preventDefault();

            const text = this.input.value;
            this.input.value = '';
            if (!text) return;

            this.oninput();

            const task = this.uncheckedContainer.new(text);

            // checks if there were no tasks
            this.onchange();

            if (this.isAuthorized){
                const res = await this.user.tasks.new(text, false);
                let id = await res.json();

                if (res.status !== 200){
                    feedback.alert('danger', id.message, 4000);
                }
                task.dataset.id = id;
            }
            else{
                task.dataset.id = this.guest.tasks.new(text);
            }

        } catch(e){
            console.log(e);
        }
    }

    // renders all tasks
    async all(){
        try{
            let tasks;
            if (await this.user.isAuthorized()){
                tasks = await this.user.tasks.getAll();

                if (tasks.status !== 200){
                    const msg = await tasks.json();
                    feedback.alert('danger', msg.message, 3000);
                    return;
                }

                tasks = await tasks.json();
            }
            else{
                tasks = this.guest.tasks.getAll();
            }

            const uncheckedTasks = tasks.filter(task => !task.checked);
            const checkedTasks = tasks.filter(task => task.checked);

            this.uncheckedContainer.all(uncheckedTasks);
            this.checkedContainer.all(checkedTasks);

            // checks if there are tasks or not
            this.onchange();

        } catch(e){
            console.log(e);
        }

    }

    // delete one task
    async delete(e){
        try {
            e.preventDefault();

            const button = e.target.closest('.task-delete');
            if (!button) return;

            const task = button.closest('.task');
            if (task.classList.contains('deleted')) return;
            if (task.classList.contains('edit')) return;

            const id = task.dataset.id;

           const isChecked = task.querySelector('input.task-checkbox').checked;

           if (isChecked){
               await this.checkedContainer.delete(task);
           }else{
               await this.uncheckedContainer.delete(task);
           }

           this.onchange();

            if (this.isAuthorized){
                const res = await this.user.tasks.delete(id);
                 if (res.status !== 200){
                     const msg = await res.json();
                     feedback.alert('danger', msg.message, 3000);
                 }
            }else{
                this.guest.tasks.delete(id);
            }
        } catch(e){
            console.log(e);
        }
    }

    // toggle the task's checked property
    async check(e){
        try{
            e.preventDefault();

            const taskContent = e.target.closest('.task-content');
            if (!taskContent) return;

            const task = taskContent.closest('.task');
            if (task.classList.contains('deleted')) return;
            if (task.classList.contains('edit')) return;

            const id = task.dataset.id;
            const text = task.querySelector('p.task-text').innerText;

            const checkbox = taskContent.querySelector('input.task-checkbox');
            if (checkbox.checked){
                await this.checkedContainer.delete(task);
                this.uncheckedContainer.new(text, id);
            } else{
                await this.uncheckedContainer.delete(task);
                this.checkedContainer.new(text, id);
            }

            if (this.isAuthorized){
                const res = await this.user.tasks.check(id);
                if (res.status !== 200){
                    const msg = await res.json();
                    feedback.alert('danger', msg.message, 3000);
                }
            }else{
                this.guest.tasks.check(id);
            }
        } catch(e){
            console.log(e);
        }

    }

    // edit task
    async edit(e){
        try{
            e.preventDefault();

            const button = e.target.closest('.task-edit');
            if (!button) return;
            const task = button.closest('.task');

            if (task.classList.contains('deleted')) return;
            if (task.classList.contains('edit')) return;
            task.classList.add('edit');

            const id = task.dataset.id;

            const taskText = task.querySelector('.task-text');
            const text = taskText.innerText.trim();
            taskText.innerHTML = `<span class="edit" role="textbox" contenteditable>${text}</span> `;

            const editSpan = taskText.querySelector('span.edit');
            editSpan.focus();
            editSpan.selectionEnd = 8;

            const setCursorAtEnd = (element) => {
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(element);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            };

            // Set the cursor at the end
            setCursorAtEnd(editSpan);

            const finishEdit = async () => {
                // removing edit class after a while to freeze other tasks actions while finishing edit
                setTimeout(() => {
                    task.classList.remove('edit');
                }, 200);

                // if edited text is empty
                if (!editSpan.innerText){
                    taskText.innerText = text;
                    feedback.alert('warning', 'Task should not be empty', 3000);
                    return;
                }

                // if text was not edited
                taskText.innerText = editSpan.innerText;
                if (editSpan.innerText === text) return;

                if(this.isAuthorized){
                    const res = await this.user.tasks.edit(id, taskText.innerText);
                    if (res.status !== 200){
                        const msg = await res.json();
                        feedback.alert('danger', msg.message, 3000);
                    }
                } else{
                    this.guest.tasks.edit(id, taskText.innerText);
                }

            }

            let isEnterPressed = false;

            editSpan.addEventListener('focusout', async () => {
                if (!isEnterPressed){
                    await finishEdit();
                }
                isEnterPressed = false;
            }
            );
            editSpan.addEventListener('keydown', async (e) => {
                if (e.key === 'Enter'){
                    isEnterPressed = true;
                    await finishEdit();
                }
            })

        }catch(e){
            console.log(e);
        }
    }

    // checks if is empty or not on every change
    onchange(){
        // if container is empty (there are no tasks) and the message is already showed
        if (this.isEmpty() && this.container.querySelector('p.tasks-container-empty-message')) return;

        //if the container is not empty and there is no message on screen
        if (!this.isEmpty() && !this.container.querySelector('p.tasks-container-empty-message')) return;

        //if is empty show the message else remove
        if (this.isEmpty()){
            this.container.insertAdjacentHTML('afterbegin', `<p class="tasks-container-empty-message">Let's get started! Add your first task.</p>`)
        }else{
            this.container.querySelector('p.tasks-container-empty-message').remove();
        }
    }

    // checks if the input is empty or not to enable/disable submit button
    oninput(){
        this.submit.disabled = this.input.value === '';
        if (this.input.value){
            this.submit.classList.remove('btn-disabled');
        } else{
            this.submit.classList.add('btn-disabled');
        }
    }

    // deletes all checked tasks
    async deleteAllChecked(e){
        const button = e.target.closest('.tasks-container__checked-header__clear');
        if (!button) return;

        if (!confirm("You wanna delete all completed tasks, are you sure?")) return;

        this.checkedContainer.clearAll();

        this.onchange();
        if (this.isAuthorized){
            const res = await this.user.tasks.deleteAllChecked();
        } else{
            this.guest.tasks.deleteAllChecked();
        }
    }

}