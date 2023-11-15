import {usersListTemplate, readingsTemplate} from './htmlTemplates.js';
import {MainTemplate} from './mainTemplate.js';
import { Dao } from './dao.js';

export class ReadingTemplate {
    constructor(mainTemplate, id) {
        this._mainTemplate = mainTemplate;
        this._id = id;
        document.getElementById('mainScreen').innerHTML = readingsTemplate;
        this._addUserDataToTemplate();
        this._setListeners();
    }

    _setListeners() {
        document.addEventListener("backbutton", () => {
            document.getElementById('mainScreen').innerHTML = usersListTemplate;
            const mainTemplate = new MainTemplate(this._mainTemplate._order, 
                this._mainTemplate._sector, this._mainTemplate._initialUsers);
            const usersList = document.getElementById(mainTemplate.getUsersListElement());
            mainTemplate.fillUsersList(usersList);
            mainTemplate.setListeners();  
        }, false);

        $('#caudal_actual').on('keyup', () => this._setNewReading());

        $('#medidorButton').on('click', () => this._changeMeterNumber());

        $('#previousButton').on('click', () => {
            const index = this._mainTemplate._users.findIndex(obj => obj.id === parseInt(this._id));
            this._id = this._mainTemplate._users[index-1]['id'];
            this._addUserDataToTemplate();
        });

        $('#nextButton').on('click', () => {
            const index = this._mainTemplate._users.findIndex(obj => obj.id === parseInt(this._id));
            this._id = this._mainTemplate._users[index+1]['id'];
            this._addUserDataToTemplate();
        });
    }

    _getUserFromID() {
        return this._mainTemplate._users.filter(user => user.id === parseInt(this._id));
    }

    _addUserDataToTemplate() {
        const user = this._getUserFromID();
        document.getElementById('name').innerHTML = '<h4>'+user[0]['name']+'</h4>';
        document.getElementById('medidorTextField').value = user[0]['medidor'];
        document.getElementById('caudal_anterior').innerHTML = user[0]['caudal_anterior'];
        document.getElementById('caudal_actual').value = user[0]['caudal_actual'];
        document.getElementById('consumo').innerHTML = user[0]['consumo'];
        document.getElementById('tarifa_calculada').innerHTML = user[0]['tarifa_calculada'];

        document.getElementById('caudal_actual').focus();
    }

    _setNewReading() {
        const dao = new Dao();

        const users = this._mainTemplate._initialUsers;
        for (var i=0; i<users.length; i++) {
            if (users[i]['id'] === parseInt(this._id)) {
                users[i]['caudal_actual'] = parseInt(document.getElementById('caudal_actual').value);
                users[i]['consumo'] = parseInt(this._calculateConsumo());
                users[i]['tarifa_calculada'] = this._calculateTarifa();
            }
        }
        this._mainTemplate._initialUsers = users;
        
        const dataJson = JSON.stringify(users);
        dao.setData(dataJson);

        document.getElementById('consumo').innerHTML = this._calculateConsumo() || "";
        document.getElementById('tarifa_calculada').innerHTML = this._calculateTarifa() || "";
    }

    _calculateConsumo() {
        return parseInt(document.getElementById('caudal_actual').value) -
            parseInt(document.getElementById('caudal_anterior').innerHTML);
    }

    _calculateTarifa() {
        const user = this._getUserFromID();
        const tipo_uso = user[0]["tipo_uso"].toLowerCase();

        const cuotaFija = parseFloat(window.AIGAR.meta[`${tipo_uso}_cuota_fija`]);
        const comision = parseFloat(window.AIGAR.meta["comision"]);
        const ahorro = parseFloat(window.AIGAR.meta["ahorro"]);

        const cuotaVariable = this._calculateVariableFee(tipo_uso);

        return cuotaFija + cuotaVariable + comision + ahorro;
    }

    _calculateVariableFee(tipo_uso) {
        const stretches = window.AIGAR.meta[`${tipo_uso}_tramos`];

        let remaining_consumption = this._calculateConsumo()
        let partial_sum = 0
        let last_limit = 0
        for (const stretch of stretches) {
            if (remaining_consumption <= 0) {
                break
            }
            let current_limit = parseFloat(stretch["limit"]) - last_limit
            let consuption = Math.min(current_limit, remaining_consumption)
            partial_sum += consuption * parseFloat(stretch["cost"])
            remaining_consumption -= consuption
            last_limit = parseFloat(stretch["limit"])
        }
        return partial_sum
    }

    _changeMeterNumber() {
        const input = document.getElementById("medidorTextField");
        const button = document.getElementById("medidorButton");
        if (button.innerText === 'Cambiar') {
             button.innerText = 'Guardar';
            input.removeAttribute("readonly");
            input.focus();
        }else if (button.innerText === 'Guardar'){
            const users = this._mainTemplate._initialUsers;
            for (var i=0; i<users.length; i++) {
                if (users[i]['id'] === parseInt(this._id)) {
                    users[i]['medidor'] = parseInt(document.getElementById('medidorTextField').value);
                    users[i]['cambio_medidor'] = true;
                }
            }
            this._mainTemplate._initialUsers = users;
            const dao = new Dao();
            const dataJson = JSON.stringify(users);
            dao.setData(dataJson);
            button.innerText = 'Cambiar';
            input.readOnly = true;
        }  
    }

}