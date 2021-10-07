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