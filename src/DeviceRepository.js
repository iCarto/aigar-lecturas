import {Dao} from "./dao.js";

export class DeviceRepository {
    constructor() {
        this.dao = new Dao();
    }

    fileExists() {
        return this.dao.getDataFromFile();
    }

    fileNotExists() {
        return this.dao.getData();
    }

    init(onFileExists, onFileNotExists) {
        /* Workarround: Checking android filesystem permissions
        For some reason, cordova file plugin returns an error of file permissions
        when first action is deleting a file, though user has granted write permissions to the app. 
        If first action is writing a file, there are no problems with permissions. 
        Since that moment it's possible delete files as well.
        */
        window.resolveLocalFileSystemURL(dao.dataDirectory, function (dir) {
            dir.getFile(
                "check_write_permissions",
                {create: true},
                function (fileEntry) {
                    fileEntry.remove();
                },
                function (error) {
                    const errorMsg = `Error comprobando ficheros de escritura: ${error.code}`;
                    alert(errorMsg);
                    // document.getElementById("alertsZone").innerHTML = errorMsg;
                }
            );
        });

        window.resolveLocalFileSystemURL(this.dao.dataDirectory, function (dir) {
            dir.getFile(
                this.dao.importFileName,
                {create: false},
                onFileExists,
                onFileNotExists
            );
        });
    }
}
