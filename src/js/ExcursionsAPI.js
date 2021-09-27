class ExcursionsAPI {
    constructor() {
        this.url = 'http://localhost:3000/';
    }

    loadData() {
        return this._fetch('excursions');
    }

    addData(path, data) {
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        return this._fetch(path, options);
    }

    removeData(id) {
        const options = { method: 'DELETE' };
        return this._fetch(`excursions/${id}`, options);
    }

    updateData(id, data) {
        const options = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        return this._fetch(`excursions/${id}`, options);
    }

    _fetch(additionalPath, options) {
        const path = this.url + additionalPath;
        return fetch(path, options)
            .then(resp => {
                if (resp.ok) { return resp.json() }
                return Promise.reject(resp);
            });
    }
}

export default ExcursionsAPI;