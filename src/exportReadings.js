import {Dao} from "./dao.js";
import {fileWrittenAlertTemplate} from "./htmlTemplates.js";

export class ExportReadings {
    constructor(mainTemplate) {
        this.mainTemplate = mainTemplate;
        this.setListeners();
    }

    setListeners() {
        const exportOption = document.getElementById("exportLecturas");
        exportOption.addEventListener("click", () => this._exportReadingsFile());
    }

    _exportReadingsFile() {
        const result = {
            members: this.mainTemplate._initialUsers,
            meta: this.mainTemplate._meta,
        };
        this.mainTemplate.repository
            .writeDataToFile(result, "lecturas_hechas.json")
            .then(() => {
                $(".navbar-collapse").collapse("hide");
                document.getElementById("alertsZone").innerHTML =
                    fileWrittenAlertTemplate;
            })
            .catch(error => {
                alert(`Error exportando fichero ${error.toString()}`);
            });
    }
}
