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

        document.getElementById('consumo').innerHTML = this._calculateConsumo();
        document.getElementById('tarifa_calculada').innerHTML = this._calculateTarifa();   
    }

    _calculateConsumo() {
        return parseInt(document.getElementById('caudal_actual').value) -
            parseInt(document.getElementById('caudal_anterior').innerHTML);
    }

    _calculateTarifa() {
        const user = this._getUserFromID();
        const userCuotaFija = 1; // user[0]['cuota_fija'];
        const userComision = 1; // user[0]['comision'];
        const userAhorro = 1; // user[0]['ahorro'];

        var cuotaVariable = 0;

        if (this._calculateConsumo() > 14 && this._calculateConsumo() <= 20) {
            cuotaVariable = (this._calculateConsumo() - 14) * 0.75;    
        }

        if (this._calculateConsumo() > 20) {
            cuotaVariable = 4.50 + ((this._calculateConsumo() - 20) * 2.50);
        }

        const tarifa = userCuotaFija + cuotaVariable + userComision + userAhorro;

        return tarifa;
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