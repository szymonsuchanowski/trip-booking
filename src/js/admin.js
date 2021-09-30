import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';
import Excursions from './Excursions';
import ExcursionsValidator from './ExcursionsValidator';

document.addEventListener('DOMContentLoaded', init);

function init() {
    const api = new ExcursionsAPI();
    const excursionsValidator = new ExcursionsValidator();
    const excursions = new Excursions(api, excursionsValidator);
    excursions.add();
    excursions.load();
    excursions.remove();
    excursions.update();
}