import { Dao } from './dao.js';
import { fileWrittenAlertTemplate } from './htmlTemplates.js';

export class ExportReadings {

    setListeners() {
        const exportOption = document.getElementById('exportLecturas');
        exportOption.addEventListener('click', () => this._exportReadingsFile());
    }

    _exportReadingsFile() {
        const dao = new Dao();
        dao.getData().then(function(result) {
            const promise = dao.writeDataToFile(result, 'lecturas_hechas.json');
            promise.then(() => {
                $('.navbar-collapse').collapse('hide');
                document.getElementById('alertsZone').innerHTML = fileWrittenAlertTemplate;
            });
        });
    }

}