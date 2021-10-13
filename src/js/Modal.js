class Modal {
    constructor() {
        this.modal = document.querySelector('.modal');
        this.modalContent = document.querySelector('.modal__content');
    }

    open() {
        this.modal.classList.add('modal--active');
        this.modalContent.classList.add('modal__content--active');
    }

    handleClose() {
        this.modal.addEventListener('click', e => {
            if (e.target.classList.contains('modal--active') || e.target.classList.contains('modal__btn--close')) {
                e.preventDefault();
                this.closeModal();
            };
        });
    }

    closeModal() {
        this.modal.classList.remove('modal--active');
        this.modalContent.classList.remove('modal__content--active');
        this._removeModalContent();
    }

    _removeModalContent() {
        this.modalContent.removeChild(this.modalContent.lastElementChild);
    }

    _isNumWithDot(num) {
        return num.toString().includes('.');
    }
}

export default Modal;