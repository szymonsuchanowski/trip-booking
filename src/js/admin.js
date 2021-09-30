import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';
import Excursions from './Excursions';

document.addEventListener('DOMContentLoaded', init);

function init() {
    const api = new ExcursionsAPI();
    const excursions = new Excursions(api);
    excursions.add();
    excursions.load();
    excursions.remove();
    excursions.update();
}