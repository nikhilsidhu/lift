function formSubmit() {
    document.getElementById("setForm").addEventListener("submit", function (event) {
        event.preventDefault()
    });
}

module.exports = { formSubmit };