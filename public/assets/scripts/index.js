import User from './modules/User/User.js';

const token = localStorage.getItem('token');
const authUser = document.querySelector('#authUser');

const user = new User(token);

const profile = document.querySelector('.profile');

async function initPage(){
    const isAuthorized = await user.isAuthorized();

    if (isAuthorized) {
        const usernameRes = await user.getUsername();
        const username = await usernameRes.json();

        const profileNames = profile.querySelectorAll('.profile__name');
        const profileSettings = profile.querySelectorAll('.settings');

        // inserting the information desktop and mobile profiles
        for (let i = 0; i < profile.children.length; i++){
            profileNames[i].innerText = username;
            profileSettings[i].href = `${location.origin}/settings.html`
        }

        // removing token and reloading the page
        profile.addEventListener('click', logout);
        profile.addEventListener('click', toggleMobileSidebar);

    } else{
        profile.innerHTML = `<a class="btn btn-login" style="margin-right: 15px;" href="${window.origin}/auth/log-in.html">Log In</a>
<a class="btn btn-login" href="${window.location.href}/auth/sign-up.html">Sign Up</a>`;
    }

}

initPage();

function logout(e){
    const logout = e.target.closest('.logout');
    if (!logout) return;

    // removing token and reloading the page
    localStorage.setItem("token", "");
    location.reload();
}

function toggleMobileSidebar(e){
    const btn = e.target.closest('.profile-mobile__sidebar-toggle');
    if (!btn) return;

    const sidebar = profile.querySelector('.profile-mobile__sidebar');

    sidebar.style.right = '-300px';

    if (sidebar.classList.contains('active')) return;
    sidebar.classList.add('active');

    setTimeout(() => {
        sidebar.style.right = '';
    }, 10);

    const overlay = document.createElement('div');
    overlay.classList.add('page-overlay');

    profile.append(overlay);

    const closeBtn = profile.querySelector('.profile-mobile__sidebar-close');

    // clicking on background
    overlay.addEventListener('click', closeSidebar);
    closeBtn.addEventListener('click', closeSidebar);

    function closeSidebar(e){
        sidebar.classList.remove('active');
        overlay.remove();
    }
}