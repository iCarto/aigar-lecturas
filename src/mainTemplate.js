import {ReadingTemplate} from "./readingTemplate.js";

export class MainTemplate {
    constructor(repository, users, meta) {
        this._initialUsers = users;
        this._users = users;
        this._meta = meta;
        this.repository = repository;

        this._initializeSectorWidget();

        this._filterByOptions();
        this.setListeners();
        this.readingTemplate = new ReadingTemplate(this, this.repository);
        this.readingTemplate.toggle(false);
    }

    setListeners() {
        $("#findUser").on("keyup", () => this._filterUserBySearch());

        $("#orderButtons button").on("click", event => {
            $(event.target).addClass("active").siblings().removeClass("active");
            this._filterByOptions();
        });

        $("#sector").on("change", () => {
            this._filterByOptions();
        });

        $("#onlyNotReaded").on("change", () => {
            this._filterByOptions();
        });

        document.getElementById("usersList").addEventListener("click", event => {
            const liElement = event.target.closest("li");
            const userID = parseInt(liElement.dataset.userid);
            this.readingTemplate.showUser(userID);
        });
        document.getElementById("navigateHome").addEventListener("click", event => {
            this.readingTemplate.toggle(false);
        });
    }

    _createElement(str) {
        var frag = document.createDocumentFragment();

        var elem = document.createElement("div");
        elem.innerHTML = str;

        while (elem.childNodes[0]) {
            frag.appendChild(elem.childNodes[0]);
        }
        return frag;
    }

    fillUsersList() {
        const element = document.getElementById("usersList");

        const liStr = this._users.map(user => {
            const memberName = user["name"];
            const memberId = user["id"];
            const memberCounter = user["medidor"];
            return `
            <li data-userid="${memberId}" class="list-group-item">
            <h4>${memberName}</h4>
            <span class="float-left">Nº socio: ${memberId}</span>
            <span class="float-right">Medidor: ${memberCounter}</span>
            </li>
            `;
        });
        element.innerHTML = liStr.join("");
        this._filterUserBySearch();
    }

    _initializeSectorWidget() {
        const sectores = new Set();
        for (const member of this._users) {
            sectores.add(member["sector"]);
        }
        const options = Array.from(sectores).map(
            sector => `<option value="${sector}">${sector}</option>`
        );
        options.sort();
        options.unshift(
            '<option value="Todos los sectores">Todos los sectores</option>'
        );
        document.getElementById("sector").innerHTML = options;
    }

    _filterUserBySearch() {
        const value = $("#findUser").val().toLowerCase().trim();
        if (!!value) {
            $("#usersList li").each(function (i, obj) {
                const textForSearching = $(this)
                    .text()
                    .toLowerCase()
                    .replace("nº socio:", "")
                    .replace("medidor:", "")
                    .replace(/\s+/g, " ")
                    .trim();

                const mustBeShown = textForSearching.includes(value);
                $(obj).toggle(mustBeShown);
            });
        } else {
            $("#usersList li").each(function (i, obj) {
                $(obj).toggle(true);
            });
        }
    }

    _filterByOptions() {
        const order = $("#orderButtons button.active").text();
        const sector = $("#sector").val();
        const showOnlyNotReaded = document.getElementById("onlyNotReaded").checked;

        let filteredUsers = [...this._initialUsers];
        if (order === "Alfabético") {
            filteredUsers.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
        } else {
            filteredUsers.sort(function (a, b) {
                return a.orden - b.orden;
            });
        }

        if (sector !== "Todos los sectores") {
            filteredUsers = filteredUsers.filter(user => user.sector == sector);
        }
        if (showOnlyNotReaded) {
            filteredUsers = filteredUsers.filter(user => !!!user.caudal_actual);
        }

        this._users = filteredUsers;

        this.fillUsersList();
    }
}
