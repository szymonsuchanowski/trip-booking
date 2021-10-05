class InfoHandler{
    constructor() {

    }

    showErrorMsg(parentEl, textContent) {
        const newP = document.createElement('p');
        //DODAC KLASE DO OSTYLOWANIA!!! TAKA SAMA DLA WSZYSTKICH
        newP.innerText = textContent;
        parentEl.appendChild(newP);
    }

    removeErrorMsg(parentEl) {
        if (parentEl.lastElementChild.tagName === 'P') {
            parentEl.removeChild(parentEl.lastElementChild);
        }
    }

    createOrderError(errors, targetEl) {
        errors.forEach(err => {
            err.style.borderBottom = "2px solid red";
            this._setRedInputBorder(err.nextElementSibling);
        });
        this.showErrorMsg(targetEl, 'Aby kontynuować oba powyższe pola muszą zostać poprawnie uzupełnione.')
    }

    createOrderSuccess(inputEl) {
        inputEl.style.borderBottom = "2px solid green";
        this.setEachInputBorderColor("green");
    }

    setEachInputBorderColor(color) {
        const inputsBorder = this._getOrderInputsBorder();
        inputsBorder.forEach(border => {
            border.style.background = color;
        })
    }

    _getOrderInputsBorder() {
        return [...document.querySelectorAll('.order__field-border')];
    }

    _setRedInputBorder(border) {
        border.style.background = "red";
    }

    showSuccessMsg(email, price) {
        alert(`Dziękujęmy za złożenie zamówienia o wartości ${price}PLN. Wszelkie szczegóły zamówienia zostały wysłane na adres e-mail: ${email}`);
    }
}

export default InfoHandler;