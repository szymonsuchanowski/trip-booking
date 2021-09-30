class ExcursionsValidator {
    /*constructor() {

    }*/

    isExcursionDataValid(excursionData) {
        const {
            title,
            description,
            priceAdult,
            priceChild
        } = excursionData;
        return (this._isStringAdded(title, description) && this._isPriceValid(priceAdult, priceChild));
    }

    isOrderDataValid(inputEl, inputName) {
        const inputValue = inputEl.value.trim();
        const regex = this._chooseRegex(inputName);
        return this._isMatchRegex(regex, inputValue);
    }

    _isStringAdded(string1, string2) {
        return (string1.length > 2 && string2.length > 2);
    }

    _isPriceValid(price1, price2) {
        const priceRegex = /^\d{1,}(\.\d{1,2})?$/;
        return (priceRegex.test(price1) && priceRegex.test(price2) && (price1 > 0 || price2 > 0));
    }

    _chooseRegex(inputName) {
        if (inputName === 'name') {
            return /^[a-zA-Z]{3,}(?:(-| )[a-zA-Z]+){0,2}$/;
        } else if (inputName === 'email') {
            return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        }
    }

    _isMatchRegex(regex, testValue) {
        return regex.test(testValue);
    }
}

export default ExcursionsValidator;