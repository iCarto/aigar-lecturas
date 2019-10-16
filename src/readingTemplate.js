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

        $('#lectura'). on('keyup', () => this._setNewReading());
    }

    _getUserFromID() {
        return this._mainTemplate._users.filter(user => user.id === parseInt(this._id));
    }

    _addUserDataToTemplate() {
        const user = this._getUserFromID();
        document.getElementById('name').innerHTML = '<h4>'+user[0]['name']+'</h4>';
        document.getElementById('lectura_anterior').innerHTML = user[0]['lectura_anterior'];
        document.getElementById('lectura').value = user[0]['lectura'];
        document.getElementById('consumo_calculado').innerHTML = user[0]['consumo_calculado'];
    }

    _setNewReading() {
        const users = this._mainTemplate._initialUsers;
        for (var i=0; i<users.length; i++) {
            if (users[i]['id'] === parseInt(this._id)) {
                users[i]['lectura'] = parseInt(document.getElementById('lectura').value);
                users[i]['consumo_calculado'] = parseInt(this._calculateConsumo());
            }
        }
        this._mainTemplate._initialUsers = users;
        const dao = new Dao();
        const dataJson = JSON.stringify(users);
        dao.setData(dataJson);

        document.getElementById('consumo_calculado').innerHTML = this._calculateConsumo();
        
    }

    _calculateConsumo() {
        return parseInt(document.getElementById('lectura').value) -
            parseInt(document.getElementById('lectura_anterior').innerHTML);
    }


}