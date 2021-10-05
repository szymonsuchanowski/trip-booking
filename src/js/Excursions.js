class Excursions {
    constructor(api, dataValidator, elCreator, infoHandler) {
        this.apiService = api;
        this.validator = dataValidator;
        this.elCreator = elCreator;
        this.infoHandler = infoHandler;
        this.basket = [];
        this.excursionsPanel = document.querySelector('.excursions');
        this.summaryPanel = document.querySelector('.summary');
    }

    add() {
        const form = document.querySelector('.form');
        form.addEventListener('submit', e => {
            e.preventDefault();
            this.infoHandler.removeErrorMsg(e.target);
            const data = this._getNewItemData(e.target.elements);
            if (this.validator.isExcursionDataValid(data)) {
                this.apiService.addData('excursions', data)
                    .then(() => form.reset())
                    .catch(err => console.error(err))
                    .finally(() => this.load())
            } else {
                this.infoHandler.showErrorMsg(e.target, 'Aby dodać wycieczkę wypełnij poprawnie wszystkie powższe pola.');
            };
        });
    }

    load() {
        this.apiService.loadData('excursions')
            .then(data => this.render(data))
            .catch(err => console.error(err))
    }

    remove() {
        this.excursionsPanel.addEventListener('click', e => {
            e.preventDefault();
            if (this._isElementClass(e.target, 'excursions__field-input--remove')) {
                const id = this._getIdFromLi(e.target);
                this.apiService.removeData(id)
                    .catch(err => console.error(err))
                    .finally(() => this.load())
            };
        });
    }

    update() {
        this.excursionsPanel.addEventListener('click', e => {
            e.preventDefault();
            if (this._isElementClass(e.target, 'excursions__field-input--update')) {
                if (this._isItemEditable(e.target)) {
                    const id = this._getIdFromLi(e.target);
                    const data = this._createDataToUpdate(e.target);
                    //walidacja!!
                    this.apiService.updateData(id, data)
                        .catch(err => console.error(err))
                        .finally(() => {
                            e.target.value = 'edytuj';
                            this._setItemEditable(e.target, false);
                        });
                } else {
                    e.target.value = 'zapisz';
                    this._setItemEditable(e.target, true);
                };
            };
        });
    }

    addToBasket() {
        this.excursionsPanel.addEventListener('submit', e => {
            e.preventDefault();
            this.infoHandler.removeErrorMsg(e.target);
            const excursionId = e.target.parentElement.dataset.id;
            const basketItemNums = this._getBasketItemNums(e.target);
            if (this.validator.isOrderNumValid(basketItemNums)) {
                this.apiService.loadData(`excursions/${excursionId}`)
                    .then(data => this._insertBasketItem(data, basketItemNums))
                    .catch(err => console.error(err))
            } else {
                this.infoHandler.showErrorMsg(e.target, 'Aby dodać wycieczkę liczba dzieci lub/i dorosłych musi zawierać się w przedziale 1-99.');
            };
        });
    }

    removeFromBasket() {
        this.summaryPanel.addEventListener('click', e => {
            if (this._isElementClass(e.target, 'summary__btn-remove')) {
                e.preventDefault();
                const clickedItemId = this._getItemId(e.target);
                this._removeItem(clickedItemId);
                this._updateOrderSummary();
                this._updateOrderTotalPrice();
            };
        });
    }

    handleOrderSubmit() {
        const formEl = document.querySelector('.order');
        formEl.addEventListener('submit', e => {
            e.preventDefault();
            this.infoHandler.removeErrorMsg(e.target);
            if (this._isBasketEmpty()) {
                this.infoHandler.showErrorMsg(e.target, 'Aby złożyć zamówienie, najpierw dodaj do koszyka interesującą Cię wycieczkę (lub wycieczki).')
            } else {
                const errors = [];
                const nameEl = this._getOrderFormField(e.target, 'name');
                this._validateOrderValue(errors, nameEl, 'name');
                const emailEl = this._getOrderFormField(e.target, 'email');
                this._validateOrderValue(errors, emailEl, 'email');
                errors.length > 0 ? this.infoHandler.createOrderError(errors, e.target) : this._sendOrder(formEl, nameEl, emailEl);
            };
        });
    }

    render(data) {
        this._clearList(this.excursionsPanel, 'excursions__item--prototype');
        data.forEach(itemData => {
            const excursionItem = this.elCreator.createExcursionEl(itemData);
            this.excursionsPanel.appendChild(excursionItem);
        });
        if (this._isElementClass(this.excursionsPanel.firstElementChild, 'excursions__item--prototype-client')) {
            this._showFirstClientExcursion();
        };
    }

    _showFirstClientExcursion() {
        const visibleExcursion = document.querySelector('.excursions__item--prototype-client').nextElementSibling;
        visibleExcursion.classList.toggle('excursions__item--visible');
    }

    _getNewItemData(formElements) {
        const { name, description, adult, child } = formElements;
        return {
            title: name.value.trim(),
            description: description.value.trim(),
            priceAdult: +adult.value,
            priceChild: +child.value
        };
    }

    _isElementClass(element, className) {
        return element.classList.contains(className);
    }

    _getIdFromLi(targetEl) {
        return this._findLiItemRoot(targetEl).dataset.id;
    }

    _isItemEditable(targetEl) {
        const liItemRoot = this._findLiItemRoot(targetEl);
        const excursionInfoList = this._findExcursionInfo(liItemRoot);
        return [...excursionInfoList].every(infoEl => infoEl.isContentEditable);
    }

    _findLiItemRoot(targetEl) {
        return targetEl.parentElement.parentElement.parentElement;
    }

    _findExcursionInfo(itemRoot) {
        return itemRoot.querySelectorAll('.excursions__title, .excursions__description, .excursions__price');
    }

    _createDataToUpdate(targetEl) {
        const liItemRoot = this._findLiItemRoot(targetEl);
        const [titleEl, descEl, priceAdultEl, priceChildEl] = [...this._findExcursionInfo(liItemRoot)];
        return {
            title: titleEl.innerText.trim(),
            description: descEl.innerText.trim(),
            priceAdult: +priceAdultEl.innerText,
            priceChild: +priceChildEl.innerText
        };
    }

    _setItemEditable(targetEl, value) {
        const liItemRoot = this._findLiItemRoot(targetEl);
        const excursionInfoList = this._findExcursionInfo(liItemRoot);
        excursionInfoList.forEach(infoEl => infoEl.contentEditable = value);
    }

    _getBasketItemNums(targetEl) {
        const numAdult = targetEl.elements.adults.value.trim();
        const numChild = targetEl.elements.children.value.trim();
        return { numAdult, numChild };
    }

    _insertBasketItem(data, basketItemNums) {
        const basketItem = this._setBasketItemData(data, basketItemNums);
        this._addItemToBasket(basketItem);
        this._updateOrderSummary();
        this._updateOrderTotalPrice();
    }

    _setBasketItemData({ id, title, priceAdult, priceChild }, { numAdult, numChild }) {
        return {
            id,
            title,
            priceAdult,
            priceChild,
            numAdult: +numAdult,
            numChild: +numChild,
            price: priceAdult * +numAdult + priceChild * +numChild
        };
    }

    _addItemToBasket(item) {
        const itemWithSameId = this._findBasketItemById(item.id);
        itemWithSameId ? this._updateBasketItemData(itemWithSameId, item) : this.basket.push(item);
    }

    _findBasketItemById(id) {
        return this.basket.find(item => item.id === id);
    }

    _updateBasketItemData(itemWithSameId, item) {
        itemWithSameId.numAdult += item.numAdult;
        itemWithSameId.numChild += item.numChild;
        itemWithSameId.price += item.price;
    }

    _updateOrderSummary() {
        this._clearList(this.summaryPanel, 'summary__item--prototype');
        this._renderOrderSummary();
    }

    _renderOrderSummary() {
        this.basket.forEach(item => {
            const orderItem = this.elCreator.createOrderEl(item);
            this.summaryPanel.appendChild(orderItem);
        })
    }

    _updateOrderTotalPrice() {
        const totalPriceEl = document.querySelector('.order__total-price-value');
        const orderTotalPrice = this._countTotalPrice();
        totalPriceEl.innerText = `${orderTotalPrice}PLN`;
    }

    _getItemId(targetEl) {
        return +targetEl.parentElement.parentElement.dataset.id;
    }

    _removeItem(id) {
        const indexToRemove = this.basket.findIndex(item => item.id === id);
        this.basket.splice(indexToRemove, 1);
    }

    _isBasketEmpty() {
        return this._countTotalPrice() === 0;
    }

    _getOrderFormField(formEl, inputName) {
        if (inputName === 'name') {
            return formEl.elements.name;
        } else if (inputName === 'email') {
            return formEl.elements.email;
        };
    }

    _validateOrderValue(errors, inputEl, inputName) {
        const isValueValid = this.validator.isOrderDataValid(inputEl, inputName);
        isValueValid ? this.infoHandler.createOrderSuccess(inputEl) : errors.push(inputEl);
    }

    _sendOrder(formEl, nameEl, emailEl) {
        const clientEmail = emailEl.value.trim();
        const totalPrice = this._countTotalPrice();
        this._addOrder(nameEl, emailEl);
        this._clearOrderData(formEl, nameEl, emailEl);
        this._updateOrderSummary();
        this._updateOrderTotalPrice();
        this.infoHandler.setEachInputBorderColor('black');
        this.infoHandler.showSuccessMsg(clientEmail, totalPrice);
    }

    _addOrder(nameEl, emailEl) {
        const orderData = {
            clientName: nameEl.value.trim(),
            clientEmail: emailEl.value.trim(),
            totalPrice: this._countTotalPrice(),
            clientOrder: this.basket
        };
        this.apiService.addData('orders', orderData)
            .catch(err => console.error(err))
    }

    _clearOrderData(formEl, nameEl, emailEl) {
        formEl.reset();
        nameEl.style.border = "";
        emailEl.style.border = "";
        this.basket = [];
    }

    _clearList(parentEl, className) {
        const list = [...this._findElementChildren(parentEl)];
        list.forEach(item => {
            if (!this._isElementClass(item, className)) {
                parentEl.removeChild(item);
            }
        })
    }

    _findElementChildren(element) {
        return element.children;
    }

    _countTotalPrice() {
        return this.basket.reduce((prev, curr) => prev + curr.price, 0);
    }
}

export default Excursions;