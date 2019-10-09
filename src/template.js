export class Template {

    constructor(html, element, data) {
        this._html = html;
        this._element = element;
        this._data = data;
        element.innerHTML = this._html;
    }

    changeTemplate(html, data) {
        this._html = html;
        this._data = data;
        element.innerHTML = this._html;
    }

    fillUsersList(element, users) {
        element.innerHTML = "";
          for (var i=0; i<users.length; i++) {
            var documentFragment = document.createDocumentFragment();
            var li = document.createElement("li");
            li.setAttribute("id", users[i]['id']);
  
            documentFragment.appendChild(li);
            var userName = document.createElement("h4");
            userName.textContent = users[i]["name"];
            li.appendChild(userName);
            li.appendChild(document.createTextNode("Nº socio:" + users[i]['num_socio']));
            li.classList.add("list-group-item");
            element.appendChild(li); 
          }
    }
}


