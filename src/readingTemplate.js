import {readingsTemplate} from "./htmlTemplates.js";
import {MainTemplate} from "./mainTemplate.js";

export class ReadingTemplate {
    constructor(mainTemplate, repository) {
        this._mainTemplate = mainTemplate;
        this.repository = repository;
        this._setListeners();
    }

    toggle(showReading) {
        const backbuttonEventListener = () => {
            this.toggle(false);
        };

        if (showReading) {
            document.getElementById("mainScreenUserList").classList.add("d-none");
            document.getElementById("mainScreenReading").classList.remove("d-none");
            document.addEventListener("backbutton", backbuttonEventListener, false);
        } else {
            document.getElementById("mainScreenUserList").classList.remove("d-none");
            document.getElementById("mainScreenReading").classList.add("d-none");
            document.removeEventListener("backbutton", backbuttonEventListener, false);
        }
    }

    showUser(id) {
        this._showUser(id);
        this.toggle(true);
    }

    _showUser(id) {
        this._id = id;
        this._addUserDataToTemplate();
    }

    _setListeners() {
        $("#caudal_actual").on("keyup", () => this._setNewReading());

        $("#medidorButton").on("click", () => this._changeMeterNumber());

        $("#previousButton").on("click", () => {
            const index = this._getUserCurrentIdx();
            if (index == 0) {
                return;
            }
            this._showUser(this._mainTemplate._users[index - 1]["id"]);
        });

        $("#nextButton").on("click", () => {
            const index = this._getUserCurrentIdx();
            if (index + 1 >= this._mainTemplate._users.length) {
                return;
            }
            this._showUser(this._mainTemplate._users[index + 1]["id"]);
        });
        
        $("#medidorButtonCancelar").on("click", () => {
            const index = this._getUserCurrentIdx();
            this._showUser(this._mainTemplate._users[index]["id"]);
        });
    }

    _getUserFromID() {
        const index = this._getUserCurrentIdx();
        return this._mainTemplate._users[index];
    }

    _getUserCurrentIdx() {
        return this._mainTemplate._users.findIndex(
            obj => obj.id === parseInt(this._id)
        );
    }

    _addUserDataToTemplate() {
        const user = this._getUserFromID();
        document.getElementById("name").innerHTML = "<h4>" + user["name"] + "</h4>";
        
        const medidorTextField = document.getElementById("medidorTextField");
        medidorTextField.value = user["medidor"];
        medidorTextField.setAttribute("readonly", true);
        document.getElementById("medidorButton").innerText = "Cambiar";

        document.getElementById("medidorButtonCancelarParent").classList.add("d-none");
        
        document.getElementById("caudal_anterior").innerHTML = user["caudal_anterior"];
        document.getElementById("caudal_actual").value = user["caudal_actual"];
        document.getElementById("consumo").innerHTML = user["consumo"];
        document.getElementById("tarifa_calculada").innerHTML =
            user["tarifa_calculada"];

        document.getElementById("caudal_actual").focus();
        
    }

    _setNewReading(extraData = {}) {
        const consumo = this._calculateConsumo();
        const tarifa = this._calculateTarifa();
        this.updateUser({
            caudal_actual: parseInt(document.getElementById("caudal_actual").value),
            consumo: consumo,
            tarifa_calculada: tarifa,
            ...extraData,
        });

        document.getElementById("consumo").innerHTML = consumo || "";
        document.getElementById("tarifa_calculada").innerHTML = tarifa || "";
    }

    _calculateConsumo() {
        return (
            parseInt(document.getElementById("caudal_actual").value) -
            parseInt(document.getElementById("caudal_anterior").innerHTML)
        );
    }

    _calculateTarifa() {
        const user = this._getUserFromID();
        const tipo_uso = user["tipo_uso"].toLowerCase();

        const cuotaFija = parseFloat(window.AIGAR.meta[`${tipo_uso}_cuota_fija`]);
        const comision = parseFloat(window.AIGAR.meta["comision"]);
        const ahorro = parseFloat(window.AIGAR.meta["ahorro"]);

        const cuotaVariable = this._calculateVariableFee(tipo_uso);

        return cuotaFija + cuotaVariable + comision + ahorro;
    }

    _calculateVariableFee(tipo_uso) {
        const stretches = window.AIGAR.meta[`${tipo_uso}_tramos`];

        let remaining_consumption = this._calculateConsumo();
        let partial_sum = 0;
        let last_limit = 0;
        for (const stretch of stretches) {
            if (remaining_consumption <= 0) {
                break;
            }
            let current_limit = parseFloat(stretch["limit"]) - last_limit;
            let consuption = Math.min(current_limit, remaining_consumption);
            partial_sum += consuption * parseFloat(stretch["cost"]);
            remaining_consumption -= consuption;
            last_limit = parseFloat(stretch["limit"]);
        }
        return partial_sum;
    }

    _changeMeterNumber() {
        const input = document.getElementById("medidorTextField");
        const button = document.getElementById("medidorButton");
        if (button.innerText === "Cambiar") {
            button.innerText = "Guardar";
            input.removeAttribute("readonly");
            input.focus();
            document.getElementById("caudal_anterior").innerHTML = 0;
            document.getElementById("consumo").innerHTML = this._calculateConsumo() || "";
            document.getElementById("tarifa_calculada").innerHTML = this._calculateTarifa() || "";
            
            document.getElementById("medidorButtonCancelarParent").classList.remove("d-none");
            
            
        } else if (button.innerText === "Guardar") {
            this._setNewReading({
                medidor: document.getElementById("medidorTextField").value,
                caudal_anterior: 0,
                cambio_medidor: true,
            })
            button.innerText = "Cambiar";
            input.readOnly = true;
            document.getElementById("medidorButtonCancelarParent").classList.add("d-none");
        }
    }


    updateUser(data) {
        const user = this._getUserFromID();
        for (let [key, value] of Object.entries(data)) {
            if (key === "caudal_anterior") {
                user.caudal_anterior_org = user.caudal_anterior_org == null ? user.caudal_anterior: user.caudal_anterior_org;
            }
            user[key] = value;
        }

        const users = this._mainTemplate._initialUsers;
        const dataJson = JSON.stringify(users);
        this.repository.setData(dataJson);
    }
}
