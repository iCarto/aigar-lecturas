export class Template {

    constructor(html, element, data) {
        this._html = html;
        this._element = element;
        this._data = data;
        this._element.innerHTML = html;
    }

    changeTemplate(html, data) {
        this._data = data;
        this._element.innerHTML = html;
        console.log(this._element);
    }

    get html() {
        this._html;
        console.log(this._html);
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


