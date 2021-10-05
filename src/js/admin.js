import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';
import Excursions from './Excursions';
import DataValidator from './DataValidator';
import ElementCreator from './ElementCreator';
import InfoHandler from './InfoHandler';

document.addEventListener('DOMContentLoaded', init);

function init() {
    const api = new ExcursionsAPI();
    const dataValidator = new DataValidator();
    const elCreator = new ElementCreator();
    const infoHandler = new InfoHandler();
    const excursions = new Excursions(api, dataValidator, elCreator, infoHandler);
    excursions.add();
    excursions.load();
    excursions.remove();
    excursions.update();
}