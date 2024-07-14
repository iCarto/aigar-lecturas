import {MainTemplate} from "./mainTemplate.js";
import {ExportReadings} from "./exportReadings.js";
import {dataImportedAlertTemplate} from "./htmlTemplates.js";

import "../www/libs/jquery.min.js";
import {DeviceRepository} from "./DeviceRepository.js";
import {DevRepository} from "./DevRepository.js";

"cordova" in window
    ? document.addEventListener("deviceready", initDevice, false)
    : initDev();

function initDevice() {
    init(DeviceRepository);
}
function initDev() {
    init(DevRepository);
}
function init(Repository) {
    const repository = new Repository();
    function loadMeta(result) {
        window.AIGAR = {
            meta: JSON.parse(result),
        };
    }
    function loadUsersList(result) {
        const users = JSON.parse(result);
        const mainTemplate = new MainTemplate("Recorrido", "Todos", users);
        const usersList = document.getElementById(mainTemplate.getUsersListElement());
        mainTemplate.fillUsersList(usersList);
        mainTemplate.setListeners();

        const exportReadings = new ExportReadings();
        exportReadings.setListeners();
    }
    function onFileExists() {
        repository
            .onFileExists()
            .then(function (result) {
                loadMeta(result[1]);
                loadUsersList(result[0]);

                document.getElementById("alertsZone").innerHTML =
                    dataImportedAlertTemplate;
            })
            .catch(error => {
                document.getElementById("alertsZone").innerHTML =
                    "Error importando lecturas.json";
            });
    }
    function onFileNotExists() {
        repository
            .onFileNotExists()
            .then(function (result) {
                loadMeta(result[1]);
                loadUsersList(result[0]);
                document.getElementById("alertsZone").innerHTML =
                    dataImportedAlertTemplate;
            })
            .catch(error => {
                document.getElementById("alertsZone").innerHTML =
                    "Error leyendo datos de bd";
            });
    }

    repository.init(onFileExists, onFileNotExists);
}
