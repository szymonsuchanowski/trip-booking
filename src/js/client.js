import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';
import Excursions from './Excursions';
import DataValidator from './DataValidator';
import ElementCreator from './ElementCreator';

document.addEventListener('DOMContentLoaded', init);

function init() {
    const api = new ExcursionsAPI();
    const dataValidator = new DataValidator();
    const elCreator = new ElementCreator();
    const excursions = new Excursions(api, dataValidator, elCreator);
    excursions.load();
    excursions.addToBasket();
    excursions.removeFromBasket();
    excursions.handleOrderSubmit();
}