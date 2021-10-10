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

    createExcursionEditorEl([title, desc, priceAdult, priceChild]) {
        const excursionEditorEl = document.querySelector('.form').cloneNode(true);
        const saveBtn = excursionEditorEl.querySelector('.order__field-submit');
        saveBtn.classList.remove('order__field-submit');
        saveBtn.value = 'zapisz';
        const cancelBtn = saveBtn.cloneNode(true);
        cancelBtn.value = 'anuluj';
        saveBtn.classList.add('order__field-save');
        cancelBtn.classList.add('order__field-cancel');
        excursionEditorEl.lastElementChild.appendChild(cancelBtn);
        excursionEditorEl.elements.name.value = title;
        excursionEditorEl.elements.description.value = desc;
        excursionEditorEl.elements.adult.value = priceAdult;
        excursionEditorEl.elements.child.value = priceChild;
        return excursionEditorEl;
    }

    createOrderSuccessEl(email, price) {
        const formattedPrice = this._setPriceFormat(price);
        const modalDescriptionEl = this._createElWithClass('section', ['modal__description']);
        const modalFirstPara = this._createElWithClass('p', ['modal__paragraph', 'modal__paragraph--first']);
        const modalSecondPara = this._createElWithClass('p', ['modal__paragraph', 'modal__paragraph--second']);
        modalFirstPara.innerText = 'Dziękujemy za złożenie zamówienia!';
        modalSecondPara.innerText = `Wszelkie szczegóły Twojego zamówienia o wartości ${formattedPrice}PLN zostały przesłane na adres e-mail: ${email}.`;
        modalDescriptionEl.appendChild(modalFirstPara);
        modalDescriptionEl.appendChild(modalSecondPara);
        return modalDescriptionEl;
    }

    _setPriceFormat(price) {
        return this._isNumWithDot(price) ? price.toFixed(2) : price;
    }

    _createElWithClass(element, className) {
        const newEl = document.createElement(element);
        newEl.classList.add(...className);
        return newEl;
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

    _isNumWithDot(num) {
        return num.toString().includes('.');
    }

    _isElementClass(element, className) {
        return element.classList.contains(className);
    }
}

export default ElementCreator;