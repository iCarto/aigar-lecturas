import {usersListTemplate} from './htmlTemplates.js';
import {ReadingTemplate} from './readingTemplate.js';

export class MainTemplate {
  constructor(order, sector, users) {
    this._order = order;
    this._sector = sector;
    this._initialUsers = users;
    this._users = users;

    document.getElementById('mainScreen').innerHTML = usersListTemplate;
    this._initializeWidgets();
    this._initializeUsersListByFilters();
  }
  
  get order() {
    return this._order;
  }
  
  set order(newOrder) {
    this._order = newOrder;
  }
  
  get sector() {
    return this._sector;
  }
  
  set sector(newSector) {
    this._sector = newSector;
  }
  
  get users() {
    return this._users;
  }
  
  set users(newUsers) {
    this._users = newUsers;
  }
  
  getUsersListElement() {
    return "usersList";
  }
  
  setListeners() {
    $("#findUser").on("keyup", () => this._filterUserByName());
    
    $('#orderButtons button').on("click", event => {
      $(event.target).addClass('active').siblings().removeClass('active');
      this._order = $(event.target).text();
      this._users = this._filterByOptions();
      this.fillUsersList(document.getElementById(this.getUsersListElement()));
      this._callReadingTemplateListener();
    });

    $('#sector').on('change', () => {
      this._sector = $("#sector").val();
      this._users = this._filterByOptions();
      this.fillUsersList(document.getElementById(this.getUsersListElement()));
      this._callReadingTemplateListener();
    });

    this._callReadingTemplateListener();
  }
  
  fillUsersList(element) {
    element.innerHTML = "";
    for (var i=0; i<this._users.length; i++) {
      var documentFragment = document.createDocumentFragment();
      var li = document.createElement("li");
      li.setAttribute("id", this._users[i]['id']);
      
      documentFragment.appendChild(li);
      var userName = document.createElement("h4");
      userName.setAttribute("id", this._users[i]['id']);
      userName.textContent = this._users[i]["name"];
      li.appendChild(userName);
      li.appendChild(document.createTextNode("Nº socio:" + this._users[i]['num_socio']));
      li.classList.add("list-group-item");
      element.appendChild(li); 
    }
  }

  _initializeWidgets() {
    document.getElementById(this._order).classList.add('active');
    $('#sector').val(this._sector);
  }

  _initializeUsersListByFilters() {
    this._users = this._filterByOptions();
    this.fillUsersList(document.getElementById(this.getUsersListElement()));
  }
  
  _filterUserByName() {
    const value = $("#findUser").val().toLowerCase();
    $("#usersList li").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    }); 
  }
  
  _filterByOptions() {
    this._users = this._initialUsers;
    if (this._order === "Alfabético") {
      this._users.sort(function(a, b){
        return a.name.localeCompare(b.name);
      });
    }else {
      this._users.sort(function(a, b){
        return a.orden - b.orden;
      });
    }
    
    if (this._sector === "Todos") {
      return this._users;
    }else {
      return this._users.filter(user => user.sector === parseInt(this._sector));
    }
    
  }

  _callReadingTemplateListener() {
    $('#usersList li').on('touchstart', event => {
      new ReadingTemplate(this, event.target.id);
    });
  }
       
}

