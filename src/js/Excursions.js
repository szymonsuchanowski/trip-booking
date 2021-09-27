class Excursions {
    constructor(api) {
        this.apiService = api;
    }

    //ADMIN dodawanie wycieczki
    addExcursion() {
        const form = document.querySelector('.form');
        form.addEventListener('submit', e => {
            e.preventDefault();
            this._removeErrorMsg(e.target);
            const data = this._getExcursionData(e.target.elements);
            if (this._isExcursionDataValid(data)) {
                this.apiService.addData('excursions', data)
                    .then(() => form.reset())
                    .catch(err => console.error(err))
                    .finally(() => console.log('git'))
            } else {
                this._showErrorMsg(e.target);
            }
        });
    }

    _getExcursionData(formElements) {
        const { name, description, adult, child } = formElements;
        return {
            name: name.value.trim(),
            description: description.value.trim(),
            priceAdult: +adult.value,
            priceChild: +child.value
        }
    }

    _isExcursionDataValid({ name, description, priceAdult, priceChild }) {
        return (this._isStringValid(name, description) && this._isPriceValid(priceAdult, priceChild));
    }

    _isStringValid(string1, string2) {
        return (string1.length > 2 && string2.length > 2);
    }

    _isPriceValid(price1, price2) {
        const priceRegex = /^\d+(\.\d{1,2})?$/;
        return (priceRegex.test(price1) && priceRegex.test(price2) && (price1 > 0 || price2 > 0));
    }

    _removeErrorMsg(parentEl) {
        if (parentEl.lastElementChild.tagName === 'P') {
            parentEl.removeChild(parentEl.lastElementChild);
        }
    }

    _showErrorMsg(formEl) {
        const newPara = document.createElement('p');
        newPara.innerText = 'Aby dodać wycieczkę wypełnij poprawnie wszystkie powższe pola.';
        formEl.appendChild(newPara);
    }
}

export default Excursions;