import feedback from "../feedback/feedback-alert.js";
import User from "../modules/User/User.js";

const user = new User(localStorage.getItem('token'));

const input = {
    oldPassword: document.querySelector('#password'),
    newPassword: document.querySelector('#newPassword'),
    repeatNewPassword: document.querySelector('#repeatNewPassword')
}
const submit = document.querySelector('#saveBtn');
const form = document.querySelector('#form');

form.addEventListener('submit', e => e.preventDefault());
submit.addEventListener('click', savePassword);

async function savePassword(){
    if (submit.classList.contains('disabled')) return;
    submit.classList.add('disabled');

    const oldPassword = input.oldPassword.value;
    const newPassword = input.newPassword.value;
    const repeatNewPassword = input.repeatNewPassword.value;

    if (newPassword.length < 6 || newPassword.length > 14) {
        submit.classList.remove('disabled');
        return;
    }

    if(newPassword !== repeatNewPassword) {
        input.repeatNewPassword.setCustomValidity("Passwords Don't Match");
        submit.classList.remove('disabled');
        return;
    } else {
        input.repeatNewPassword.setCustomValidity('');
    }

    const res = await user.settings.resetPassword(oldPassword, newPassword);
    const msg = await res.json();

    if (res.status === 200){
        feedback.alert('success', msg.message, 4000);

        // clearing inputs
        input.newPassword.value = '';
        input.oldPassword.value = '';
        input.repeatNewPassword.value = '';
    } else{
        feedback.alert('danger', msg.message, 4000);
    }

    submit.classList.remove('disabled');
}