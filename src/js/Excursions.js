class Excursions {
    constructor(api) {
        this.apiService = api;
        this.basket = [];
    }

    //ADMIN ładowanie wycieczek
    load() {
        this.apiService.loadData('excursions')
            .then(data => {
                this.render(data);
            })
            .catch(err => console.error(err))
    }

    render(data) {
        const ulEl = this._findByClass(document, 'excursions');
        this._clearList(ulEl, 'excursions__item--prototype');
        data.forEach(itemData => {
            const excursionItem = this._createLi(itemData);
            ulEl.appendChild(excursionItem);
        })
    }

    _createLi({ id, title, description, priceAdult, priceChild }) {
        const liEl = this._getItemProto('excursions__item--prototype');
        liEl.dataset.id = id;
        const excursionTitle = this._findByClass(liEl, 'excursions__title');
        const excursionDesc = this._findByClass(liEl, 'excursions__description');
        const excursionPriceAdult = this._findByClass(liEl, 'excursions__price--adult');
        const excursionPriceChild = this._findByClass(liEl, 'excursions__price--child');
        this._setTextContent(excursionTitle, title);
        this._setTextContent(excursionDesc, description);
        this._setTextContent(excursionPriceAdult, priceAdult);
        this._setTextContent(excursionPriceChild, priceChild);
        return liEl;
    }

    _setTextContent(element, textContent) {
        element.innerText = textContent;
    }

    _findByClass(element, className) {
        return element.querySelector(`.${className}`);
    }

    //ADMIN usuwanie wycieczki

    remove() {
        const ulEl = this._findByClass(document, 'excursions');
        ulEl.addEventListener('click', e => {
            e.preventDefault();
            if (this._isElementClass(e.target, 'excursions__field-input--remove')) {
                const id = this._getIdFromLi(e.target);
                this.apiService.removeData(id)
                    .catch(err => console.error(err))
                    .finally(() => this.load())
            };
        });
    }

    _isElementClass(element, className) {
        return element.classList.contains(className);
    }

    _getIdFromLi(targetEl) {
        return this._findLiItemRoot(targetEl).dataset.id;
    }

    //ADMIN edycja dodanej już wycieczki

    update() {
        const ulEl = this._findByClass(document, 'excursions');
        ulEl.addEventListener('click', e => {
            e.preventDefault();
            const targetEl = e.target;
            if (this._isElementClass(e.target, 'excursions__field-input--update')) {
                if (this._isItemEditable(e.target)) {
                    const id = this._getIdFromLi(e.target);
                    const data = this._createDataToUpdate(e.target);
                    //walidacja!!
                    this.apiService.updateData(id, data)
                        .catch(err => console.error(err))
                        .finally(() => {
                            targetEl.value = 'edytuj';
                            this._setItemEditable(e.target, false);
                        });
                } else {
                    targetEl.value = 'zapisz';
                    this._setItemEditable(e.target, true);
                };
            };
        });
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
        }
    }

    _setItemEditable(targetEl, value) {
        const liItemRoot = this._findLiItemRoot(targetEl);
        const excursionInfoList = this._findExcursionInfo(liItemRoot);
        excursionInfoList.forEach(infoEl => infoEl.contentEditable = value);
    }

    //ADMIN dodawanie wycieczki
    add() {
        const form = document.querySelector('.form');
        form.addEventListener('submit', e => {
            e.preventDefault();
            this._removeErrorMsg(e.target);
            const data = this._getNewItemData(e.target.elements);
            if (this._isDataValid(data)) {
                this.apiService.addData('excursions', data)
                    .then(() => form.reset())
                    .catch(err => console.error(err))
                    .finally(() => this.load())
            } else {
                this._showErrorMsg(e.target, 'Aby dodać wycieczkę wypełnij poprawnie wszystkie powższe pola.');
            }
        });
    }

    _getItemProto(className) {
        const itemProto = this._findByClass(document, className).cloneNode(true);
        itemProto.classList.remove(className);
        return itemProto;
    }

    _getNewItemData(formElements) {
        const { name, description, adult, child } = formElements;
        return {
            title: name.value.trim(),
            description: description.value.trim(),
            priceAdult: +adult.value,
            priceChild: +child.value
        }
    }

    _isDataValid({ title, description, priceAdult, priceChild }) {
        return (this._isStringValid(title, description) && this._isPriceValid(priceAdult, priceChild));
    }

    _isStringValid(string1, string2) {
        return (string1.length > 2 && string2.length > 2);
    }

    _isPriceValid(price1, price2) {
        const priceRegex = /^\d{1,}(\.\d{1,2})?$/;
        return (priceRegex.test(price1) && priceRegex.test(price2) && (price1 > 0 || price2 > 0));
    }

    _removeErrorMsg(targetEl) {
        if (targetEl.lastElementChild.tagName === 'P') {
            targetEl.removeChild(targetEl.lastElementChild);
        }
    }

    _showErrorMsg(targetEl, textContent) {
        const newPara = document.createElement('p');
        newPara.innerText = textContent;
        targetEl.appendChild(newPara);
    }

    //CLIENT obsługa
    //załadowanie dostępnych do wyboru wycieczek
    // .load() jak dla admina

    //Client dodawanie do koszyka
    addToBasket() {
        const ulEl = this._findByClass(document, 'excursions');
        ulEl.addEventListener('submit', e => {
            e.preventDefault();
            this._removeErrorMsg(e.target);
            const excursionId = e.target.parentElement.dataset.id;
            const basketItemNums = this._getBasketItemNums(e.target);
            if (this._isBasketNumValid(basketItemNums)) {
                this.apiService.loadData(`excursions/${excursionId}`)
                    .then(data => this._insertBasketItem(data, basketItemNums))
                    .catch(err => console.error(err))
            } else {
                this._showErrorMsg(e.target, 'Aby dodać wycieczkę liczba dzieci lub/i dorosłych musi zawierać się w przedziale 1-99.');
            }
        })
    }

    //Client usuwanie pozycji
    removeFromBasket() {
        const ulEl = this._findByClass(document, 'summary');
        ulEl.addEventListener('click', e => {
            if (this._isElementClass(e.target, 'summary__btn-remove')) {
                e.preventDefault();
                const clickedItemId = this._getItemId(e.target);
                this._removeItem(clickedItemId);
                this._updateOrderSummary();
                this._updateOrderTotalPrice();
            }
        })
    }

    _getItemId(targetEl) {
        return +targetEl.parentElement.parentElement.dataset.id;
    }

    _removeItem(id) {
        console.log(id);
        const indexToRemove = this.basket.findIndex(item => item.id === id);
        this.basket.splice(indexToRemove, 1);
    }

    //-------------

    handleOrderSubmit() {
        const formEl = this._findByClass(document, 'order');
        formEl.addEventListener('submit', e => {
            e.preventDefault();
            if (this._isBasketEmpty()) {
                alert('Aby złożyć zamówienie, najpierw dodaj do koszyka interesującą Cię wycieczkę (lub wycieczki).');
            } else {
                this._removeErrorMsg(formEl);
                const errors = [];
                const nameEl = this._getOrderFormField(e.target, 'name');
                this._validateOrderValue(errors, nameEl, 'name');
                const emailEl = this._getOrderFormField(e.target, 'email');
                this._validateOrderValue(errors, emailEl, 'email');
                errors.length > 0 ? this._createOrderError(errors, e.target) : this._sendOrder(formEl, nameEl, emailEl);
            }
        })
    }

    _isBasketEmpty() {
        return this._countTotalPrice() === 0;
    }

    _getOrderFormField(formEl, inputName) {
        if (inputName === 'name') {
            return formEl.elements.name;
        } else if (inputName === 'email') {
            return formEl.elements.email;
        }
    }

    _validateOrderValue(errors, inputEl, inputName) {
        const inputValue = inputEl.value.trim();
        const regex = this._chooseRegex(inputName);
        const isValueValid = this._isMatchRegex(regex, inputValue);
        if (isValueValid) {
            inputEl.style.borderBottom = "2px solid green";
            this._setInputBorderColor('green');
        } else {
            errors.push(inputEl);
        }
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

    _createOrderError(errors, targetEl) {
        errors.forEach(err => {
            err.style.borderBottom = "2px solid red";
            this._setRedInputBorder(err.nextElementSibling);
        });
        this._showErrorMsg(targetEl, 'Aby kontynuować oba powyższe pola muszą zostać poprawnie uzupełnione.')
    }

    _getOrderInputsBorder() {
        return [...document.querySelectorAll('.order__field-border')];
    }

    _setInputBorderColor(color) {
        const inputsBorder = this._getOrderInputsBorder();
        inputsBorder.forEach(border => {
            border.style.background = color;
        })
    }

    _setRedInputBorder(border) {
        border.style.background = "red";
    }

    _sendOrder(formEl, nameEl, emailEl) {
        this._addOrder(nameEl, emailEl);
        const totalPrice = this._countTotalPrice();
        const clientEmail = emailEl.value.trim();
        this._clearOrderData(formEl, nameEl, emailEl);
        this._updateOrderSummary();
        this._updateOrderTotalPrice();
        this._setInputBorderColor('black');
        this._showSuccessMsg(clientEmail, totalPrice);
    }

    _addOrder(nameEl, emailEl) {
        const orderData = {
            clientName: nameEl.value.trim(),
            clientEmail: emailEl.value.trim(),
            clientOrder: this.basket
        }
        this.apiService.addData('orders', orderData)
            .catch(err => console.error(err))
    }

    _clearOrderData(formEl, nameEl, emailEl) {
        formEl.reset();
        nameEl.style.border = "";
        emailEl.style.border = "";
        this.basket = [];
    }

    _showSuccessMsg(email, price) {
        alert(`Dziękujęmy za złożenie zamówienia o wartości ${price}PLN. Wszelkie szczegóły zamówienia zostały wysłane na adres e-mail: ${email}`);
    }

    //-------------

    _getBasketItemNums(targetEl) {
        const numAdult = targetEl.elements[0].value.trim();
        const numChild = targetEl.elements[1].value.trim();
        return { numAdult, numChild };
    }

    _isBasketNumValid({ numAdult, numChild }) {
        return (this._isPeopleNumValid(numAdult) && this._isPeopleNumValid(numChild) && (numAdult > 0 || numChild > 0));
    }

    _isPeopleNumValid(num) {
        const numRegex = /^(0|([1-9]{0,1}[0-9]{0,1}))$/;
        return numRegex.test(num);
    }

    _insertBasketItem(data, basketItemNums) {
        const basketItem = this._createBasketItem(data, basketItemNums);
        this._addItemToBasket(basketItem);
        this._updateOrderSummary();
        this._updateOrderTotalPrice();
    }

    _createBasketItem({ id, title, priceAdult, priceChild }, { numAdult, numChild }) {
        return {
            id,
            title,
            priceAdult,
            priceChild,
            numAdult: +numAdult,
            numChild: +numChild,
            totalPrice: priceAdult * +numAdult + priceChild * +numChild
        }
    }

    _addItemToBasket(item) {
        const itemWithSameId = this._findItemById(item.id);
        itemWithSameId ? this._updateBasketItem(itemWithSameId, item) : this.basket.push(item);
    }

    _findItemById(id) {
        return this.basket.find(item => item.id === id);
    }

    _updateBasketItem(itemWithSameId, item) {
        itemWithSameId.numAdult += item.numAdult;
        itemWithSameId.numChild += item.numChild;
        itemWithSameId.totalPrice += item.totalPrice;
    }

    _updateOrderSummary() {
        const ulEl = this._findByClass(document, 'summary');
        this._clearList(ulEl, 'summary__item--prototype');
        this._renderOrderSummary(ulEl);
    }

    _findElementChildren(element) {
        return element.children;
    }

    _clearList(parentEl, className) {
        const list = [...this._findElementChildren(parentEl)];
        list.forEach(item => {
            if (!item.classList.contains(className)) {
                parentEl.removeChild(item);
            }
        })
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
        this._findByClass(itemProto, 'summary__total-price').innerText = `${item.totalPrice}PLN`;
    }

    _setSummaryDescription(itemProto, item) {
        const textContent = `dorośli: ${item.numAdult} x ${item.priceAdult}PLN
        dzieci: ${item.numChild} x ${item.priceChild}PLN`;
        const descriptionEl = this._findByClass(itemProto, 'summary__prices');
        descriptionEl.innerText = textContent;
    }

    _updateOrderTotalPrice() {
        const totalPriceEl = this._findByClass(document, 'order__total-price-value');
        const orderTotalPrice = this._countTotalPrice();
        totalPriceEl.innerText = `${orderTotalPrice}PLN`;
    }

    _countTotalPrice() {
        return this.basket.reduce((prev, curr) => prev + curr.totalPrice, 0);
    }
}

export default Excursions;