class Modal {
    constructor() {
        this.modal = document.querySelector('.modal');
        this.modalContent = document.querySelector('.modal__content');
    }

    open(clientEmail, totalPrice) {
        this.modal.classList.add('modal--active');
        this.modalContent.classList.add('modal__content--active');
        this._addModalContent(clientEmail, totalPrice);
    }

    close() {
        this.modal.addEventListener('click', e => {
            if (e.target.classList.contains('modal--active') || e.target.classList.contains('modal__btn')) {
                this.modal.classList.remove('modal--active');
                this.modalContent.classList.remove('modal__content--active');
                this._removeModalContent();
            };
        });
    }

    _addModalContent(clientEmail, totalPrice) {
        if (this._isNumWithDot(totalPrice)) {
            totalPrice = totalPrice.toFixed(2);
        }
        const textContent = `Dziękujęmy za złożenie zamówienia o wartości ${totalPrice}PLN. Wszelkie szczegóły zamówienia zostały wysłane na adres e-mail: ${clientEmail}`;
        const newP = document.createElement('p');
        newP.innerText = textContent;
        this.modalContent.appendChild(newP);
    }

    _removeModalContent() {
        if (this.modalContent.lastElementChild.tagName === 'P') {
            this.modalContent.removeChild(this.modalContent.lastElementChild);
        }
    }

    _isNumWithDot(num) {
        return num.toString().includes('.');
    }
}

export default Modal;