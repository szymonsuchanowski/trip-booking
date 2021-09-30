import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';
import Excursions from './Excursions';
import DataValidator from './DataValidator';

document.addEventListener('DOMContentLoaded', init);

function init() {
    const api = new ExcursionsAPI();
    const dataValidator = new DataValidator();
    const excursions = new Excursions(api, dataValidator);
    excursions.load();
    excursions.addToBasket();
    excursions.removeFromBasket();
    excursions.handleOrderSubmit();
}