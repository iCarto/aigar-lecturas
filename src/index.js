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
            meta: result,
        };
    }
    function loadMainTemplate(users, meta) {
        const mainTemplate = new MainTemplate(repository, users, meta);
        const exportReadings = new ExportReadings(mainTemplate);
    }

    function onFileExists() {
        const successMsg = dataImportedAlertTemplate;
        const errorMsg = "Error importando lecturas.json";

        repository
            .fileExists()
            .then(function (result) {
                loadMeta(result[1]);
                loadMainTemplate(result[0], result[1]);
                if (!!successMsg) {
                    document.getElementById("alertsZone").innerHTML = successMsg;
                }
            })
            .catch(error => {
                console.log(error);
                document.getElementById("alertsZone").innerHTML = errorMsg;
            });
    }
    function onFileNotExists() {
        const successMsg = "";
        const errorMsg = "Error leyendo datos de bd";

        repository
            .fileNotExists()
            .then(function (result) {
                loadMeta(result[1]);
                loadMainTemplate(result[0]);
                if (!!successMsg) {
                    document.getElementById("alertsZone").innerHTML = successMsg;
                }
            })
            .catch(error => {
                console.log(error);
                document.getElementById("alertsZone").innerHTML = errorMsg;
            });
    }

    repository.init(onFileExists, onFileNotExists);
}
