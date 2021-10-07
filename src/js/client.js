import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';
import Excursions from './Excursions';
import DataValidator from './DataValidator';
import ElementCreator from './ElementCreator';
import InfoHandler from './InfoHandler';
import Slider from './Slider';

import Modal from './Modal';

document.addEventListener('DOMContentLoaded', init);

function init() {
    const api = new ExcursionsAPI();
    const dataValidator = new DataValidator();
    const elCreator = new ElementCreator();
    const infoHandler = new InfoHandler();
    const slider = new Slider(infoHandler);

    const modal = new Modal();
    modal.close();

    const excursions = new Excursions(api, dataValidator, elCreator, infoHandler, modal);
    excursions.load();
    excursions.addToBasket();
    excursions.removeFromBasket();
    excursions.handleOrderSubmit();
    slider.showFollowingExcursion();
}