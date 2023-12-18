import feedback from "./feedback/feedback-alert.js";

const usernameInput = document.querySelector('input#username');
const passwordInput = document.querySelector('input#password');
const repeatPasswordInput = document.querySelector('input#repeatPassword');
const signupSubmit = document.querySelector('input#signupSubmit');
const loginSubmit = document.querySelector('input#loginSubmit');
const form = document.querySelector('form#form')

const baseUrl = `${window.origin}/auth`;

form.addEventListener('submit', e => e.preventDefault());

if (signupSubmit){
    signupSubmit.addEventListener('click', signup);
}

if (loginSubmit){
    loginSubmit.addEventListener('click', login);
}

async function signup(e){
    try{
        if (usernameInput.value.length < 2 || usernameInput.value.length > 30) return;
        if (passwordInput.value.length < 6 || passwordInput.value.length > 14) return;

        if(passwordInput.value !== repeatPasswordInput.value) {
            repeatPasswordInput.setCustomValidity("Passwords Don't Match");
            return;
        } else {
            repeatPasswordInput.setCustomValidity('');
        }


        const res = await fetch(baseUrl + '/registration', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value
            })
        })

        if (res.statusText !== "OK"){
            const msg = await res.json();
            feedback.alert("danger", msg.message, 3000);
            return;
        }

        const {token} = await res.json();

        localStorage.setItem("token", token);
        window.location.href = window.origin;
    }
    catch(e){
        console.log(e);
    }
}

async function login(){
    try{
        if (!usernameInput.value || !passwordInput.value) return;

        const res = await fetch(baseUrl + '/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value
            })
        })

        if (res.statusText !== "OK"){
            const msg = await res.json();
            feedback.alert("danger", msg.message, 3000);
            return;
        }

        const {token} = await res.json();
        localStorage.setItem("token", token);

        window.location.href = window.origin;
    }
    catch(e){
        console.log(e);
    }
}
