class Slider {
    constructor(infoHandler) {
        this.excursionsPanel = document.querySelector('.excursions');
        this.infoHandler = infoHandler;
    }

    showFollowingExcursion() {
        this.excursionsPanel.addEventListener('click', e => {
            if (this._isNavClicked(e.target)) {
                const direction = this._checkDirection(e.target);
                const currExcursion = this._getDisplayedExcursion();
                const currExcursionFormEl = currExcursion.querySelector('.excursions__form');
                this.infoHandler.removeErrorMsg(currExcursionFormEl);
                const excursionsList = this._getExcursionsList();
                const followingExcursion = this._getFollowingExcursion(direction, currExcursion, excursionsList);
                this._changeExcursion(currExcursion, followingExcursion);
            }
        })
    }

    _isNavClicked(clickedEl) {
        return this._isElementClass(clickedEl, 'excursions__nav');
    }

    _checkDirection(navEl) {
        return this._isElementClass(navEl, 'excursions__nav--next') ? 'next' : 'prev';
    }

    _getDisplayedExcursion() {
        return document.querySelector('.excursions__item--visible');
    }

    _getExcursionsList() {
        return this.excursionsPanel.children;
    }

    _getFollowingExcursion(direction, currExcursion, excursionsList) {
        if (direction === 'next') {
            return this._getNextExcursion(currExcursion, excursionsList);
        } else if (direction === 'prev') {
            return this._getPrevExcursion(currExcursion, excursionsList);
        }
    }

    _getNextExcursion(currExcursion, excursionsList) {
        const nextExcursion = currExcursion.nextElementSibling;
        return nextExcursion ? nextExcursion : excursionsList[1];
    }

    _getPrevExcursion(currExcursion, excursionsList) {
        const prevExcursion = currExcursion.previousElementSibling;
        return this._isElementClass(prevExcursion, 'excursions__item--prototype') ?
            excursionsList[excursionsList.length - 1] :
            prevExcursion;
    }

    _changeExcursion(currExcursion, followingExcursion) {
        currExcursion.classList.toggle('excursions__item--visible');
        followingExcursion.classList.toggle('excursions__item--visible');
    }

    _isElementClass(element, className) {
        return element.classList.contains(className);
    }
}

export default Slider;