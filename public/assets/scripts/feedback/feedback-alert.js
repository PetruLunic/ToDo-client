

class Feedback{

    alert(type, text, time){
        const alert = document.createElement('div');
        alert.classList.add('alert', `alert-${type}`);
        alert.innerHTML = text;

        alert.style.right = `-320px`;
        document.body.append(alert);

        setTimeout(() => {
            alert.style.right = '';
        }, 500);

        setTimeout(() => {
            alert.remove();
        }, parseInt(time))
    }
}



export default new Feedback();