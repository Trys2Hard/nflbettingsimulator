const error = document.querySelector('.error');
const success = document.querySelector('.success');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
})

if (error.innerText) {
    error.style.display = "flex";
    error.style.backgroundColor = "#890000";
} else {
    error.style.display = "none";
}

if (success.innerText) {
    success.style.display = "flex";
    success.style.backgroundColor = "#004900";
} else {
    success.style.display = "none";
}