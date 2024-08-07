const error = document.querySelector('.error');
const success = document.querySelector('.success');

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