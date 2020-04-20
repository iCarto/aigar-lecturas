export class Dao {

    constructor() {
        this.dataDirectory = cordova.file.externalRootDirectory + 'download/';
    }

    getData() {
        window.localStorage.clear();

        return new Promise((resolve, reject) => {

            function onReadFinish(result) {
                window.localStorage.setItem('dataJson', result);
            }

            window.resolveLocalFileSystemURL(this.dataDirectory, function(dir) {
                dir.getFile("lecturas.json", {create:false}, function(fileEntry) {
                    if (fileEntry.isFile) {
                        fileEntry.file(function (file) {
                            var reader = new FileReader();
                            reader.onloadend = function() {
                                const users = JSON.parse(this.result);
                                const dataJson = JSON.stringify(users);
                                resolve(onReadFinish(dataJson));
                            };
                            reader.readAsText(file);
                        });
                    } else {
                        reject(new Error("No es un fichero"));
                    }
                });
            });
        })
    }

    removeFile() {
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

    writeData(data) {
        window.resolveLocalFileSystemURL(this.dataDirectory, function(dir) {
            dir.getFile("lecturas.json", {create:true}, function(file) {
                var logOb = file;      
                logOb.createWriter(function(fileWriter) {
                    fileWriter.seek(fileWriter.length);
                    var blob = new Blob([data], {type:'text/plain'});
                    fileWriter.write(blob);
                }, function(e){console.error(e);});
            });
        });
    }

    writeFile(data) {
        const promise = this.removeFile();
        promise.then(() => {
            this.writeData(data);
        });
     }

    setData(dataJson) {
        window.localStorage.clear();
        window.localStorage.setItem('dataJson', dataJson);
        this.writeFile(dataJson);
    }
    
}
