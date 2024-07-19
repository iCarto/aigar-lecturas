export class Dao {
    constructor() {
        this.dataDirectory = cordova.file.externalDataDirectory;
        this.importFileName = "lecturas.json";
        this.db = window.sqlitePlugin.openDatabase({
            name: "lecturas.sqlite",
            location: "default",
            androidDatabaseProvider: "system",
        });
        this._createDBTables();
    }

    getData() {
        const dataPromise = new Promise((resolve, reject) => {
            this.db.executeSql("SELECT * FROM users", [], function (rs) {
                const result = rs.rows.item(0).dataJSON;
                resolve(JSON.parse(result));
            });
        });
        const metaPromise = new Promise((resolve, reject) => {
            this.db.executeSql("SELECT * FROM meta", [], function (rs) {
                const result = rs.rows.item(0).dataJSON;
                resolve(JSON.parse(result));
            });
        });
        return Promise.all([dataPromise, metaPromise]);
    }

    setData(dataJson) {
        this.db.executeSql("UPDATE users SET dataJSON = ?", [dataJson]);
    }

    getDataFromFile() {
        return new Promise((resolve, reject) => {
            this._importDataFromFile().then(() => {
                this.getData().then(function (result) {
                    resolve(result);
                });
                this._removeFile();
            });
        });
    }

    writeDataToFile(data, filename) {
        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(this.dataDirectory, function (dir) {
                dir.getFile(
                    filename,
                    {create: true, exclusive: false},
                    function (file) {
                        var logOb = file;
                        logOb.createWriter(
                            function (fileWriter) {
                                fileWriter.seek(fileWriter.length);
                                const dataStr = JSON.stringify(data);
                                var blob = new Blob([dataStr], {type: "text/plain"});
                                fileWriter.truncate(0);
                                fileWriter.write(blob);
                                resolve(() => {
                                    console.log("File written");
                                });
                            },
                            function (e) {
                                alert(`Error exportando fichero ${e.toString()}`);
                            }
                        );
                    }
                );
            });
        });
    }

    _importDataFromFile() {
        return new Promise((resolve, reject) => {
            this.db.transaction(
                function (tx) {
                    tx.executeSql("DELETE FROM users;", []);
                    tx.executeSql("DELETE FROM meta;", []);
                },
                function (error) {
                    console.log("transaction error: " + error.message);
                },
                function () {
                    console.log("transaction ok");
                }
            );

            function onReadFinish(usersJSON, metaJSON) {
                const db = window.sqlitePlugin.openDatabase({
                    name: "lecturas.sqlite",
                    location: "default",
                });
                db.transaction(
                    function (tx) {
                        tx.executeSql("INSERT INTO users (dataJSON) VALUES (?)", [
                            usersJSON,
                        ]);
                        tx.executeSql("INSERT INTO meta (dataJSON) VALUES (?)", [
                            metaJSON,
                        ]);
                    },
                    function (error) {
                        console.log("transaction error: " + error.message);
                    },
                    function () {
                        console.log("transaction ok");
                        resolve();
                    }
                );
            }

            window.resolveLocalFileSystemURL(this.dataDirectory, dir => {
                dir.getFile(this.importFileName, {create: false}, function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function () {
                            const data = JSON.parse(this.result);
                            const usersJSON = JSON.stringify(data["members"]);
                            const metaJSON = JSON.stringify(data["meta"]);
                            onReadFinish(usersJSON, metaJSON);
                        };
                        reader.readAsText(file);
                    });
                });
            });
        });
    }

    _createDBTables() {
        this.db.sqlBatch(
            [
                "CREATE TABLE IF NOT EXISTS users (id integer primary key, dataJSON text)",
                "CREATE TABLE IF NOT EXISTS meta  (id integer primary key, dataJSON text)",
            ],
            function () {
                console.log("Populated database OK");
            },
            function (error) {
                alert("Error creando base de datos: " + error.message);
            }
        );
    }

    _removeFile() {
        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(this.dataDirectory, dir => {
                dir.getFile(this.importFileName, {create: false}, function (fileEntry) {
                    if (fileEntry.isFile) {
                        fileEntry.remove(null, function () {
                            alert(
                                'No se ha podido borrar el fichero importado "lecturas.json".' +
                                    " Debe borrarlo a mano y comprobar los permisos de almacenamiento de la aplicación"
                            );
                        });
                        resolve(() => {
                            console.log("File removed");
                        });
                    }
                });
            });
        });
    }
}
