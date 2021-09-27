class Excursions {
    constructor(api) {
        this.apiService = api;
    }

    //ADMIN ładowanie wycieczek
    loadExcursions() {
        this.apiService.loadData()
            .then(data => {
                this.renderExcursions(data);
            })
            .catch(err => console.error(err))
    }

    renderExcursions(data) {
        const ulEl = this._findByClass(document, '.excursions');
        this._clearExcursionsList();
        data.forEach(el => {
            const excursionItem = this._createLi(el);
            ulEl.appendChild(excursionItem);
        })
    }

    _createLi(itemData) {
        const liEl = this._getExcursionItemProto();
        liEl.dataset.id = itemData.id;
        const excursionTitle = this._findByClass(liEl, '.excursions__title');
        const excursionDesc = this._findByClass(liEl, '.excursions__description');
        const excursionPriceAdult = this._findByClass(liEl, '.excursions__price--adult');
        const excursionPriceChild = this._findByClass(liEl, '.excursions__price--child');
        excursionTitle.innerText = itemData.title;
        excursionDesc.innerText = itemData.description;
        excursionPriceAdult.innerText = itemData.priceAdult;
        excursionPriceChild.innerText = itemData.priceChild;
        return liEl;
    }

    _findByClass(element, className) {
        return element.querySelector(className);
    }

    _clearExcursionsList() {
        const excursionsList = document.querySelectorAll('.excursions__item:not(.excursions__item--prototype)');
        excursionsList.forEach(item => item.parentElement.removeChild(item));
    }

    //ADMIN usuwanie wycieczki

    removeExcursion() {
        const ulEl = this._findByClass(document, '.excursions');
        ulEl.addEventListener('click', e => {
            e.preventDefault();
            if(this._isElementClass(e.target, 'excursions__field-input--remove')) {
                const id = this._getIdFromLi(e.target);
                this.apiService.removeData(id)
                    .catch(err => console.error(err))
                    .finally(() => this.loadExcursions())
            };
        });
    }

    _isElementClass(element, className) {
        return element.classList.contains(className);
    }

    _getIdFromLi(targetEl) {
        return targetEl.parentElement.parentElement.parentElement.dataset.id;
    }

    //ADMIN dodawanie wycieczki
    addExcursion() {
        const form = document.querySelector('.form');
        form.addEventListener('submit', e => {
            e.preventDefault();
            this._removeErrorMsg(e.target);
            const data = this._getExcursionData(e.target.elements);
            if (this._isExcursionDataValid(data)) {
                this.apiService.addData('excursions', data)
                    .then(() => form.reset())
                    .catch(err => console.error(err))
                    .finally(() => this.loadExcursions())
            } else {
                this._showErrorMsg(e.target);
            }
        });
    }

    _getExcursionItemProto() {
        const excursionItemProto = document.querySelector('.excursions__item--prototype').cloneNode(true);
        excursionItemProto.classList.remove('excursions__item--prototype');
        return excursionItemProto;
    }

    _getExcursionData(formElements) {
        const { name, description, adult, child } = formElements;
        return {
            title: name.value.trim(),
            description: description.value.trim(),
            priceAdult: +adult.value,
            priceChild: +child.value
        }
    }

    _isExcursionDataValid({ title, description, priceAdult, priceChild }) {
        return (this._isStringValid(title, description) && this._isPriceValid(priceAdult, priceChild));
    }

    _isStringValid(string1, string2) {
        return (string1.length > 2 && string2.length > 2);
    }

    _isPriceValid(price1, price2) {
        const priceRegex = /^\d+(\.\d{1,2})?$/;
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