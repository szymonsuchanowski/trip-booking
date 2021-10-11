class ElementCreator {
    createExcursionEl(itemData) {
        const newEl = this._getElProto('excursions__item--prototype');
        this._setElId(newEl, itemData);
        this._setExcursionTextContent(newEl, itemData);
        return newEl;
    }

    createOrderEl(itemData) {
        const newEl = this._getElProto('summary__item--prototype');
        this._setElId(newEl, itemData);
        this._setOrderTextContent(newEl, itemData);
        return newEl;
    }

    createExcursionEditorEl(excursionData) {
        const excursionEditorEl = document.querySelector('.form').cloneNode(true);
        this._setExcursionEditorBtns(excursionEditorEl);
        this._setInputInitialValues(excursionEditorEl.elements, excursionData);
        return excursionEditorEl;
    }

    createOrderSuccessEl(email, price) {
        const formattedPrice = this._setPriceFormat(price);
        const modalDescriptionEl = this._createElWithClass('section', ['modal__description']);
        const modalFirstParaEl = this._createElWithClass('p', ['modal__paragraph', 'modal__paragraph--first']);
        const modalSecondParaEl = this._createElWithClass('p', ['modal__paragraph', 'modal__paragraph--second']);
        modalFirstParaEl.innerText = 'Dziękujemy za złożenie zamówienia!';
        modalSecondParaEl.innerText = `Szczegóły Twojego zamówienia o wartości ${formattedPrice}PLN zostały przesłane na adres e-mail: ${email}.`;
        modalDescriptionEl.appendChild(modalFirstParaEl);
        modalDescriptionEl.appendChild(modalSecondParaEl);
        return modalDescriptionEl;
    }

    createConfirmationEl(excursionTitle) {
        const modalDescriptionEl = this._createElWithClass('section', ['modal__description']);
        const modalParaEl = this._createElWithClass('p', ['modal__paragraph']);
        modalParaEl.innerText = `Czy na pewno chcesz usunąć wycieczkę ${excursionTitle}?`;
        const modalWrapperEl = this._createElWithClass('div', ['modal__wrapper']);
        const confirmBtn = this._createElWithClass('button', ['modal__btn', 'modal__btn--confirm']);
        confirmBtn.innerText = 'tak';
        const rejectBtn = this._createElWithClass('button', ['modal__btn', 'modal__btn--reject']);
        rejectBtn.innerText = 'nie';
        modalWrapperEl.appendChild(confirmBtn);
        modalWrapperEl.appendChild(rejectBtn);
        modalDescriptionEl.appendChild(modalParaEl);
        modalDescriptionEl.appendChild(modalWrapperEl);
        return modalDescriptionEl;
    }

    _getElProto(className) {
        const itemProto = document.querySelector(`.${className}`).cloneNode(true);
        itemProto.classList.remove(className);
        if (this._isElementClass(itemProto, 'excursions__item--prototype-client')) {
            itemProto.classList.remove('excursions__item--prototype-client');
        }
        return itemProto;
    }

    _setElId(element, itemData) {
        element.dataset.id = itemData.id;
    }

    _setExcursionTextContent(element, itemData) {
        this._setElTextContent(element, 'excursions__title', itemData.title);
        this._setElTextContent(element, 'excursions__description', itemData.description);
        this._setElTextContent(element, 'excursions__price--adult', itemData.priceAdult);
        this._setElTextContent(element, 'excursions__price--child', itemData.priceChild);
    }

    _setOrderTextContent(element, itemData) {
        this._setElTextContent(element, 'summary__name', itemData.title)
        this._setSummaryPrice(element, itemData.price);
        this._setSummaryDescription(element, itemData);
    }

    _setElTextContent(element, className, dataType) {
        element.querySelector(`.${className}`).innerText = dataType;
    }

    _setSummaryPrice(element, price) {
        if (this._isNumWithDot(price)) {
            price = price.toFixed(2);
        }
        element.querySelector('.summary__total-price').innerText = `${price}PLN`;
    }

    _setSummaryDescription(element, itemData) {
        const textContent = `dorośli: ${itemData.numAdult} x ${itemData.priceAdult}PLN
        dzieci: ${itemData.numChild} x ${itemData.priceChild}PLN`;
        const descriptionEl = element.querySelector('.summary__prices');
        descriptionEl.innerText = textContent;
    }

    _setExcursionEditorBtns(excursionEditorEl) {
        const saveBtn = excursionEditorEl.querySelector('.order__field-submit');
        saveBtn.classList.remove('order__field-submit');
        saveBtn.value = 'zapisz';
        const cancelBtn = saveBtn.cloneNode(true);
        cancelBtn.value = 'anuluj';
        saveBtn.classList.add('order__field-save');
        cancelBtn.classList.add('order__field-cancel');
        excursionEditorEl.lastElementChild.appendChild(cancelBtn);
    }

    _setInputInitialValues(formElements, [title, desc, priceAdult, priceChild]) {
        formElements.name.value = title;
        formElements.description.value = desc;
        formElements.adult.value = priceAdult;
        formElements.child.value = priceChild;
    }

    _setPriceFormat(price) {
        return this._isNumWithDot(price) ? price.toFixed(2) : price;
    }

    _createElWithClass(element, className) {
        const newEl = document.createElement(element);
        newEl.classList.add(...className);
        return newEl;
    }

    _isNumWithDot(num) {
        return num.toString().includes('.');
    }

    _isElementClass(element, className) {
        return element.classList.contains(className);
    }
}

export default ElementCreator;