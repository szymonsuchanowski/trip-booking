class ElementCreator {
    constructor(){

    }

    createLi(itemData) {
        const liEl = this._getItemProto('excursions__item--prototype');
        liEl.dataset.id = itemData.id;
        const excursionTitle = liEl.querySelector('.excursions__title');
        const excursionDesc = liEl.querySelector('.excursions__description');
        const excursionPriceAdult = liEl.querySelector('.excursions__price--adult');
        const excursionPriceChild = liEl.querySelector('.excursions__price--child');
        excursionTitle.innerText = itemData.title;
        excursionDesc.innerText = itemData.description;
        excursionPriceAdult.innerText = itemData.priceAdult;
        excursionPriceChild.innerText = itemData.priceChild;
        return liEl;
    }

    _renderOrderSummary(parentEl) {
        this.basket.forEach(item => {
            const summaryItemProto = this._getItemProto('summary__item--prototype');
            this._setSummaryData(summaryItemProto, item);
            parentEl.appendChild(summaryItemProto);
        })
    }

    _setSummaryData(itemProto, item) {
        this._setItemId(itemProto, item);
        this._setSummaryTitle(itemProto, item);
        this._setSummaryPrice(itemProto, item);
        this._setSummaryDescription(itemProto, item);
    }

    _setItemId(itemProto, item) {
        itemProto.dataset.id = item.id;
    }

    _setSummaryTitle(itemProto, item) {
        this._findByClass(itemProto, 'summary__name').innerText = item.title;
    }

    _setSummaryPrice(itemProto, item) {
        this._findByClass(itemProto, 'summary__total-price').innerText = `${item.price}PLN`;
    }

    _setSummaryDescription(itemProto, item) {
        const textContent = `dorośli: ${item.numAdult} x ${item.priceAdult}PLN
        dzieci: ${item.numChild} x ${item.priceChild}PLN`;
        const descriptionEl = this._findByClass(itemProto, 'summary__prices');
        descriptionEl.innerText = textContent;
    }

    _getItemProto(className) {
        const itemProto = document.querySelector(`.${className}`).cloneNode(true);
        itemProto.classList.remove(className);
        return itemProto;
    }
}

export default ElementCreator;