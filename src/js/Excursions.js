class Excursions {
    constructor(api, dataValidator, elCreator, infoHandler, modal) {
        this.apiService = api;
        this.validator = dataValidator;
        this.elCreator = elCreator;
        this.infoHandler = infoHandler;
        this.modal = modal;
        this.basket = [];
        this.excursionsPanel = document.querySelector('.excursions');
        this.summaryPanel = document.querySelector('.summary');
        this.orderPanel = document.querySelector('.order');
        this.modalContent = document.querySelector('.modal__content');
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
                this.infoHandler.showErrorMsg(e.target, 'Aby dodać wycieczkę wypełnij poprawnie wszystkie powyższe pola.');
            };
        });
    }

    load() {
        this.apiService.loadData('excursions')
            .then(data => this.render(data))
            .catch(err => console.error(err))
    }

    handleRemove() {
        this.excursionsPanel.addEventListener('click', e => {
            e.preventDefault();
            if (this._isElementClass(e.target, 'excursions__field-input--remove')) {
                const excursionId = this._getIdFromLi(e.target);
                const excursionTitle = this._getExcursionTitle(this._findLiItemRoot(e.target));
                const confirmationEl = this.elCreator.createConfirmationEl(excursionTitle);
                this.modalContent.appendChild(confirmationEl);
                this.modal.open();
                this._handleConfirmationAction(excursionId);
            };
        });
    }

    handleUpdate() {
        this.excursionsPanel.addEventListener('click', e => {
            e.preventDefault();
            if (this._isElementClass(e.target, 'excursions__field-input--update')) {
                const excursionId = this._getIdFromLi(e.target);
                const liItemRoot = this._findLiItemRoot(e.target);
                const [title, desc, priceAdult, priceChild] = [...this._findExcursionInfo(liItemRoot)].map(el => el.innerText);
                const excursionData = [title, desc, priceAdult, priceChild];
                const excursionEditor = this.elCreator.createExcursionEditorEl(excursionData);
                this.modalContent.appendChild(excursionEditor);
                this.modal.open();
                this._handleExcursionEditorAction(excursionId);
            }
        })
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

    handleRemoveFromBasket() {
        this.summaryPanel.addEventListener('click', e => {
            if (this._isElementClass(e.target, 'summary__btn-remove')) {
                e.preventDefault();
                const excursionId = this._getItemId(e.target);
                const excursionTitle = e.target.parentElement.firstElementChild.innerText;
                const confirmationEl = this.elCreator.createConfirmationEl(excursionTitle);
                this.modalContent.appendChild(confirmationEl);
                this.modal.open();
                this._handleBasketConfirmationAction(excursionId);
            };
        });
    }

    handleOrderSubmit() {
        this.orderPanel.addEventListener('submit', e => {
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
                errors.length > 0 ? this.infoHandler.createOrderError(errors, e.target) : this._sendOrder(this.orderPanel, nameEl, emailEl);
            };
        });
    }

    render(data) {
        this._clearList(this.excursionsPanel, 'excursions__item--prototype');
        data.forEach(itemData => {
            const excursionItem = this.elCreator.createExcursionEl(itemData);
            this.excursionsPanel.appendChild(excursionItem);
        });
        if (this._isClientSite()) {
            this._isExcursionsListEmpty() ? this.infoHandler.createNoExcursionInfo(this.excursionsPanel)
                : this._showFirstClientExcursion();
        };
    }

    _isClientSite() {
        return this._isElementClass(this.excursionsPanel.firstElementChild, 'excursions__item--prototype-client');
    }

    _isExcursionsListEmpty() {
        return this._findElementChildren(this.excursionsPanel).length === 1;
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

    _findLiItemRoot(targetEl) {
        return targetEl.parentElement.parentElement.parentElement;
    }

    _getExcursionTitle(parentEl) {
        return parentEl.firstElementChild.firstElementChild.innerText;
    }

    _handleConfirmationAction(excursionId) {
        const confirmationEl = this.modalContent.querySelector('.modal__description');
        confirmationEl.addEventListener('click', e => {
            e.preventDefault();
            if (this._isElementClass(e.target, 'modal__btn--confirm')) {
                this._remove(excursionId);
            } else if (this._isElementClass(e.target, 'modal__btn--reject')) {
                this.modal.closeModal();
            };
        });
    }

    _remove(excursionId) {
        this.apiService.removeData(excursionId)
            .then(() => this.modal.closeModal())
            .catch(err => console.error(err))
            .finally(() => this.load())
    }

    _findExcursionInfo(itemRoot) {
        return itemRoot.querySelectorAll('.excursions__title, .excursions__description, .excursions__price');
    }

    _handleExcursionEditorAction(excursionId) {
        const editorForm = this.modalContent.querySelector('.form');
        editorForm.addEventListener('click', e => {
            e.preventDefault();
            if (e.target.classList.contains('order__field-save')) {
                this._handleExcursionEditorSaveAction(editorForm, e.currentTarget.elements, excursionId);
            } else if (e.target.classList.contains('order__field-cancel')) {
                this.modal.closeModal();
            }
        })
    }

    _handleExcursionEditorSaveAction(editForm, formElements, id) {
        this.infoHandler.removeErrorMsg(editForm);
        const updatedData = this._getNewItemData(formElements);
        this.validator.isExcursionDataValid(updatedData) ?
            this._updateExcursionData(id, updatedData) :
            this.infoHandler.showErrorMsg(editForm, 'Aby zapisać wycieczkę wypełnij poprawnie wszystkie powyższe pola.');
    }

    _updateExcursionData(id, data) {
        this.apiService.updateData(id, data)
            .then(() => this.modal.closeModal())
            .catch(err => console.error(err))
            .finally(() => this.load())
    }

    _getBasketItemNums(targetEl) {
        const numAdult = targetEl.elements.adults.value.trim();
        const numChild = targetEl.elements.children.value.trim();
        return { numAdult, numChild };
    }

    _insertBasketItem(data, basketItemNums) {
        const basketItem = this._setBasketItemData(data, basketItemNums);
        if (this._isBasketEmpty()) {
            this.infoHandler.removeErrorMsg(this.orderPanel);
        }
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
        let orderTotalPrice = this._countTotalPrice();
        if (this._isNumWithDot(orderTotalPrice)) {
            orderTotalPrice = orderTotalPrice.toFixed(2);
        }
        totalPriceEl.innerText = `${orderTotalPrice}PLN`;
    }

    _getItemId(targetEl) {
        return +targetEl.parentElement.parentElement.dataset.id;
    }

    _handleBasketConfirmationAction(excursionId) {
        const confirmationEl = this.modalContent.querySelector('.modal__description');
        confirmationEl.addEventListener('click', e => {
            e.preventDefault();
            if (this._isElementClass(e.target, 'modal__btn--confirm')) {
                this._removeExcursionFromBasket(excursionId);
            } else if (this._isElementClass(e.target, 'modal__btn--reject')) {
                this.modal.closeModal();
            };
        });
    }

    _removeExcursionFromBasket(excursionId) {
        this._removeItem(excursionId);
        this._updateOrderSummary();
        this._updateOrderTotalPrice();
        this.modal.closeModal();
        this._isBasketEmpty() ? this.infoHandler.hideOrderErrors(this.orderPanel, this._getOrderFormField(this.orderPanel, 'name'), this._getOrderFormField(this.orderPanel, 'email')) : null;
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
        this.infoHandler.setEachInputBorderColor('rgba(0, 0, 0, 1)');
        const orderSuccessEl = this.elCreator.createOrderSuccessEl(clientEmail, totalPrice);
        this.modalContent.appendChild(orderSuccessEl);
        this.modal.open();
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
        this.infoHandler.setInitialBorderColor(nameEl, emailEl);
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

    _isNumWithDot(num) {
        return num.toString().includes('.');
    }

    _countTotalPrice() {
        return this.basket.reduce((prev, curr) => prev + curr.price, 0);
    }
}

export default Excursions;