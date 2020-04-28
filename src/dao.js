export class Dao {

    constructor() {
        this.dataDirectory = cordova.file.externalRootDirectory + 'download/';
        this.db = window.sqlitePlugin.openDatabase({name: 'lecturas.sqlite', location: 'default'});
        this._createDBTables();
    }

    getData() {
        return new Promise((resolve, reject) => {
            const that = this;
            this.db.executeSql('SELECT * FROM users', [], function (rs) {
                const result = rs.rows.item(0).dataJSON;
                resolve(result);   
            });
        })
    }

    setData(dataJson) {
        this.db.executeSql('UPDATE users SET dataJSON = ?', [dataJson]);
    }

    getDataOnStart() {
        return new Promise((resolve, reject) => {

            var that = this;
            
            window.resolveLocalFileSystemURL(this.dataDirectory, function(dir) {
                dir.getFile("lecturas.json", {create:false}, fileExists, fileNotExists );
            });

            function fileExists() {
                const promise = that._importDataFromFile();
                promise.then(function() {
                    that.getData().then(function (result){
                        resolve(result);
                    });
                    that._removeFile();
                });
            }

            function fileNotExists() {
                that.getData().then(function (result){
                    resolve(result);
                });
            }

        })

    }

    writeDataToFile(data, filename) {
        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(this.dataDirectory, function(dir) {
                dir.getFile(filename, {create:true}, function(file) {
                    var logOb = file;      
                    logOb.createWriter(function(fileWriter) {
                        fileWriter.seek(fileWriter.length);
                        var blob = new Blob([data], {type:'text/plain'});
                        fileWriter.write(blob);
                        resolve(() => {console.log("File written")});
                    }, function(e){console.error(e);});
                });
            });
        })
    }

    _importDataFromFile() {
        return new Promise((resolve, reject) => {

            this.db.transaction(function (tx) {
                var executeQuery = 'DELETE FROM users';
                tx.executeSql(executeQuery, []);
            }, function (error) {
                console.log('transaction error: ' + error.message);
            }, function () {
                console.log('transaction ok');
            });

            function onReadFinish(result) {
                const db = window.sqlitePlugin.openDatabase({name: 'lecturas.sqlite', location: 'default'});
                db.transaction(function (tx) {
                    var executeQuery = 'INSERT INTO users (dataJSON) VALUES (?)';
                    tx.executeSql(executeQuery, [result]);
                }, function (error) {
                    console.log('transaction error: ' + error.message);
                }, function () {
                    console.log('transaction ok');
                    resolve();
                });
            }

            window.resolveLocalFileSystemURL(this.dataDirectory, function(dir) {
                dir.getFile("lecturas.json", {create:false}, function(fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function() {
                            const users = JSON.parse(this.result);
                            const dataJson = JSON.stringify(users);
                            onReadFinish(dataJson);
                        };
                        reader.readAsText(file);
                    });       
                });
            });

        })
    }

    _createDBTables() {
        this.db.sqlBatch([
            'CREATE TABLE IF NOT EXISTS users (id integer primary key, dataJSON text)',
          ], function() {
            console.log('Populated database OK');
          }, function(error) {
            console.log('SQL batch ERROR: ' + error.message);
          });
    }

    _removeFile() {
        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(this.dataDirectory, function(dir) {
                dir.getFile("lecturas.json", {create:false}, function(fileEntry) {
                    if (fileEntry.isFile) {
                        fileEntry.remove();
                        resolve(() => {console.log("File removed")});
                    }
                });
            });
        })
    }

    _writeFile(data, filename) {
        const promise = this._removeFile();
        promise.then(() => {
            this.writeDataToFile(data, filename);
        });
     }
    
}
