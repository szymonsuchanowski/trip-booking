class InfoHandler {
    showErrorMsg(parentEl, textContent, className = 'error__msg') {
        const newP = document.createElement('p');
        newP.classList.add(className);
        newP.innerText = textContent;
        parentEl.appendChild(newP);
    }

    removeErrorMsg(parentEl) {
        if (parentEl.lastElementChild.tagName === 'P') {
            parentEl.removeChild(parentEl.lastElementChild);
        }
    }

    createNoExcursionInfo(parentEl) {
        this.showErrorMsg(parentEl, 'Przepraszamy, niestety baza wycieczek jest pusta. Odśwież stronę, a jeżeli nadal brak dostępnych wycieczek, to zajrzyj do nas w późniejszym terminie - cały czas aktualizujemy ofertę.', 'excursions__error');
        this._changeLayout(parentEl);
    }

    createOrderError(errors, targetEl) {
        errors.forEach(err => {
            err.style.borderBottom = '2px solid rgba(255, 0, 0, 1)';
            this._setRedInputBorder(err.nextElementSibling);
        });
        this.showErrorMsg(targetEl, 'Aby kontynuować oba powyższe pola muszą zostać poprawnie uzupełnione.');
    }

    hideOrderErrors(formEl, nameEl, emailEl) {
        this.removeErrorMsg(formEl);
        this.setInitialBorderColor(nameEl, emailEl);
        this.setEachInputBorderColor('rgba(0, 0, 0, 1)');
    }

    setInitialBorderColor(nameEl, emailEl) {
        nameEl.style.border = '';
        emailEl.style.border = '';
    }

    createOrderSuccess(inputEl) {
        inputEl.style.borderBottom = '2px solid rgba(0, 128, 0, 1)';
        this.setEachInputBorderColor('rgba(0, 128, 0, 1)');
    }

    setEachInputBorderColor(color) {
        const inputsBorder = this._getOrderInputsBorder();
        inputsBorder.forEach(border => {
            border.style.background = color;
        })
    }

    showSuccessMsg(email, price) {
        alert(`Dziękujęmy za złożenie zamówienia o wartości ${price}PLN. Wszelkie szczegóły zamówienia zostały wysłane na adres e-mail: ${email}`);
    }

    _changeLayout(parentEl) {
        parentEl.classList.add('panel__excursions--1col');
        parentEl.nextElementSibling.classList.add('panel__form--invisible');
    }

    _getOrderInputsBorder() {
        return [...document.querySelectorAll('.order__field-border')];
    }

    _setRedInputBorder(border) {
        border.style.background = 'rgba(255, 0, 0, 1)';
    }
}

export default InfoHandler;