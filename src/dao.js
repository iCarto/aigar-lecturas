import {mockData} from './data.js';

export class Dao {

    getData() {
        window.localStorage.clear();
        const dataJson = JSON.stringify(mockData);
        window.localStorage.setItem('dataJson', dataJson);
            
        return window.localStorage.getItem('dataJson');
    }

    writeFile(data) {
        var type = LocalFileSystem.PERSISTENT;
        var size = 5*1024*1024;
        window.requestFileSystem(type, size, successCallback, errorCallback)
     
        function successCallback(fs) {
           fs.root.getFile('log.txt', {create: true}, function(fileEntry) {
     
              fileEntry.createWriter(function(fileWriter) {
                 var blob = new Blob([data], {type: 'text/plain'});
                 fileWriter.write(blob);
              }, errorCallback);
           }, errorCallback);
        }
     
        function errorCallback(error) {
           alert("ERROR: " + error.code)
        }
     }

    setData(dataJson) {
        window.localStorage.clear();
        window.localStorage.setItem('dataJson', dataJson);
        this.writeFile(dataJson);
    }
    
}
