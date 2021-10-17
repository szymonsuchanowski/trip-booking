class DataValidator {
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

    isOrderNumValid(orderNum) {
        const { numAdult, numChild } = orderNum;
        return (this._isNumValid(numAdult) && this._isNumValid(numChild) && (numAdult > 0 || numChild > 0));
    }

    _isStringAdded(string1, string2) {
        return (string1.length > 2 && string2.length > 2);
    }

    _isPriceValid(price1, price2) {
        const priceRegex = this._chooseRegex('price');
        return (this._isMatchRegex(priceRegex, price1) && this._isMatchRegex(priceRegex, price2) && (price1 > 0 || price2 > 0));
    }

    _isNumValid(num) {
        const numRegex = this._chooseRegex('num');
        return this._isMatchRegex(numRegex, num);
    }

    _chooseRegex(inputName) {
        if (inputName === 'name') {
            return /^[a-zA-Z]{3,}(?:(-| )[a-zA-Z]+){0,2}$/;
        } else if (inputName === 'email') {
            return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        } else if (inputName === 'price') {
            return /^\d+(\.\d{1,2})?$/;
        } else if (inputName === 'num') {
            return /^(0|([1-9]{0,1}[0-9]{0,1}))$/;
        }
    }

    _isMatchRegex(regex, testValue) {
        return regex.test(testValue);
    }
}

export default DataValidator;