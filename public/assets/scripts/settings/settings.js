const settings = document.querySelector('.settings-sidebar__options');
const settingContainer = document.querySelector('.setting-container');

import User from "../modules/User/User.js";
const token = localStorage.getItem('token');
const user = new User(token);

(async() => {
    if (!token) location.href = `${location.origin}/auth/log-in.html`;

    if (!await user.isAuthorized()) `${location.origin}/auth/log-in.html`;
})()

settings.addEventListener('click', selectSetting);

function selectSetting(e){
    const setting = e.target.closest('li.settings-sidebar__item');
    if (!setting) return;

    // remove active from all other settings
    for (let set of settings.children) {
        set.classList.remove('active');
    }

    // remove active from all settings content
    for (let set of settingContainer.children) {
        set.classList.remove('active');
    }

    // add active for clicked setting
    setting.classList.add('active');

    // find the setting content that have class equal with setting.id
    const settingContent = Array.from(settingContainer.children).find(settings => settings.classList.contains(setting.id));

    if (!settingContent){
        console.log(`There is no such setting "${setting.innerText}"`);
        return;
    }

    // showing setting's linked content
    settingContent.classList.add('active');
}