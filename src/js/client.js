import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';
import Excursions from './Excursions';
import DataValidator from './DataValidator';
import ElementCreator from './ElementCreator';
import InfoHandler from './InfoHandler';
import Slider from './Slider';

document.addEventListener('DOMContentLoaded', init);

function init() {
    const api = new ExcursionsAPI();
    const dataValidator = new DataValidator();
    const elCreator = new ElementCreator();
    const infoHandler = new InfoHandler();
    const slider = new Slider(infoHandler);
    const excursions = new Excursions(api, dataValidator, elCreator, infoHandler);
    excursions.load();
    excursions.addToBasket();
    excursions.removeFromBasket();
    excursions.handleOrderSubmit();
    slider.showFollowingExcursion();
}