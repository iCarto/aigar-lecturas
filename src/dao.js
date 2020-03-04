export class Dao {

    constructor() {
        this.dataDirectory = cordova.file.externalRootDirectory + 'download/';
    }

    getData() {
        window.localStorage.clear();

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
                            onReadFinish(dataJson);
                        };
                        reader.readAsText(file);
                    });
                }
            });
         });
    }



    writeFile(data) {
        window.resolveLocalFileSystemURL(this.dataDirectory, function(dir) {
            dir.getFile("lecturas.json", {create:false}, function(fileEntry) {
                if (fileEntry.isFile) {
                    fileEntry.remove();
                }
            });
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

    setData(dataJson) {
        window.localStorage.clear();
        window.localStorage.setItem('dataJson', dataJson);
        this.writeFile(dataJson);
    }
    
}
