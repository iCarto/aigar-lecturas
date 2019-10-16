export class Dao {
    constructor(file) {
        this._file = file;
    }

    getData() {
        if (window.localStorage.getItem('dataJson') == null) {
            // window.localStorage.clear();
            const mockData = [
                {"id": 1, "name": "Maria del Transito de la O", "num_socio": 1, "orden": 1, "sector": 1, "lectura_anterior": 20, "lectura": null, "consumo_calculado": "--"},
                {"id": 2, "name": "Maria Ester Alfaro", "num_socio": 2, "orden": 2, "sector": 1, "lectura_anterior": 15, "lectura": null, "consumo_calculado": "--"},
                {"id": 3, "name": "Jose German Arias", "num_socio": 3, "orden": 3, "sector": 1, "lectura_anterior": 18, "lectura": null, "consumo_calculado": "--"},
                {"id": 4, "name": "Ezequiel Neftali Colocho", "num_socio": 4, "orden":4, "sector": 2, "lectura_anterior": 34, "lectura": null, "consumo_calculado": "--"},
                {"id": 5, "name": "Oscar Mauricio Barraza", "num_socio": 5, "orden":5, "sector": 3, "lectura_anterior": 22, "lectura": null, "consumo_calculado": "--"},
                {"id": 6, "name": "Juana Luz Chevez", "num_socio": 6, "orden": 6, "sector": 4, "lectura_anterior": 16, "lectura": null, "consumo_calculado": "--"},
                {"id": 7, "name": "Maria Sara Lara", "num_socio": 7, "orden": 7, "sector": 7, "lectura_anterior": 48, "lectura": null, "consumo_calculado": "--"}
            ];

            const dataJson = JSON.stringify(mockData);
            window.localStorage.setItem('dataJson', dataJson );
            return window.localStorage.getItem('dataJson');
        }else {
            return window.localStorage.getItem('dataJson');
        }   
    }

    setData(dataJson) {
        window.localStorage.clear();
        window.localStorage.setItem('dataJson', dataJson);
    }
}
