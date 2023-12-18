const taskInput = document.querySelector('#newTaskInput');
const taskSubmit = document.querySelector('#newTaskSubmit');
const tasksContainer = document.querySelector('section.tasks-container');

import lottieWeb from "https://cdn.skypack.dev/lottie-web";
import RenderTasks from "./render/renderTasks.js";

const loadingAnimation = lottieWeb.loadAnimation({
    container: document.querySelector('.loading-animation'),
    path: './assets/animations/loading.json',
    renderer: 'svg',
    loop: true,
    autoplay: true,
    name: "Loading Animation",
})

const tasks = new RenderTasks(taskInput, taskSubmit, tasksContainer);

// render all tasks when is loading the page
(async() => {
    await tasks.all();

    // removing animation after rendering all tasks
    document.querySelector('.loading-animation').remove();
})()

tasks.oninput();

taskSubmit.addEventListener('click', async (e) => await tasks.new(e));
tasksContainer.addEventListener('click', async (e) => await tasks.delete(e));
tasksContainer.addEventListener('click', async (e) => await tasks.check(e));
tasksContainer.addEventListener('click',async (e) => await tasks.edit(e) );
tasksContainer.addEventListener('click',async (e) => await tasks.deleteAllChecked(e));
tasksContainer.addEventListener('click',(e) => tasks.checkedContainer.collapse(e) );
taskInput.addEventListener('input', () => tasks.oninput());