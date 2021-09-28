class Excursions {
    constructor(api) {
        this.apiService = api;
    }

    //ADMIN ładowanie wycieczek
    load() {
        this.apiService.loadData()
            .then(data => {
                this.render(data);
            })
            .catch(err => console.error(err))
    }

    render(data) {
        const ulEl = this._findByClass(document, '.excursions');
        this._clearList();
        data.forEach(itemData => {
            const excursionItem = this._createLi(itemData);
            ulEl.appendChild(excursionItem);
        })
    }

    _createLi({ id, title, description, priceAdult, priceChild }) {
        const liEl = this._getItemProto();
        liEl.dataset.id = id;
        const excursionTitle = this._findByClass(liEl, '.excursions__title');
        const excursionDesc = this._findByClass(liEl, '.excursions__description');
        const excursionPriceAdult = this._findByClass(liEl, '.excursions__price--adult');
        const excursionPriceChild = this._findByClass(liEl, '.excursions__price--child');
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
        return element.querySelector(className);
    }

    _clearList() {
        const excursionsList = document.querySelectorAll('.excursions__item:not(.excursions__item--prototype)');
        excursionsList.forEach(item => item.parentElement.removeChild(item));
    }

    //ADMIN usuwanie wycieczki

    remove() {
        const ulEl = this._findByClass(document, '.excursions');
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
        const ulEl = this._findByClass(document, '.excursions');
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
            title: titleEl.innerText,
            description: descEl.innerText,
            priceAdult: priceAdultEl.innerText,
            priceChild: priceChildEl.innerText,
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
                this._showErrorMsg(e.target);
            }
        });
    }

    _getItemProto() {
        const excursionItemProto = document.querySelector('.excursions__item--prototype').cloneNode(true);
        excursionItemProto.classList.remove('excursions__item--prototype');
        return excursionItemProto;
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