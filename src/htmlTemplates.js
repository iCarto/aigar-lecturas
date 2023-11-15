export const usersListTemplate = `

<div class="container-fluid">     
 
<div class="row" style="margin-bottom: 15px"></div>

<div class="row">
<div class="col-2"> 
<h6>Orden:</h6>
</div>
<div id="orderButtons" class="col-12 btn-group btn-group-toggle">
<button id="Recorrido" type="button" class="btn btn-primary">Recorrido</button>
<button id="Alfabético" type="button" class="btn btn-primary">Alfabético</button>
</div>
</div>

<div class="row" style="margin-bottom: 10px"></div>

<div class="row">
<div class="col-12 form-group">
<h6>Sector:</h6>
<select class="form-control" id="sector">
</select>
</div>
</div>

<div class="row">           
<div class="col-12 input-group">
<input class="form-control py-2 border-right-0 border" type="search" value="Buscar usuario..." id="findUser">
<span class="input-group-append">
<div class="input-group-text bg-transparent"><i class="fas fa-address-book"></i></div>
</span>
</div>
</div>

<div class="row" style="margin-bottom: 15px"></div>

<div>
<ul id="usersList" class="list-group"></ul>
</div>
</div>
`
export const readingsTemplate = `
<div class="container-fluid">       

<div class="row" style="margin-bottom: 10px"></div>

<div class="row">
<div id="name" class="col-12">

</div>
</div>

<div class="row" style="margin-bottom: 10px"></div>

<div class="row">
<div class="col-12">
<form>
<div class="form-group">
<label for="">Número medidor</label>
<div class="input-group mb-3">
<input id="medidorTextField" type="number" class="form-control" readonly>
<div class="input-group-append">
<button class="btn btn-outline-primary" type="button" id="medidorButton">Cambiar</button>
</div>
</div>
</div>
<div class="form-group">
<label class="font-weight-bold col-form-label-lg" for="caudal_actual">Caudal actual</label>
<input id="caudal_actual" type="number" class="form-control form-control-lg text-right" autofocus>
</div>
</form>
</div>
</div>

<div class="row" style="margin-bottom: 10px"></div>

<div class="row">
<div class="col-10">
<label>Caudal anterior:</label>
</div>
<div class="col-2">
<label id="caudal_anterior"></label>
</div>
</div>

<div class="row">
<div class="col-10">
<label>Consumo:</label>
</div>
<div class="col-2">
<label id="consumo">--</label>
</div>
</div>

<div class="row">
<div class="col-10">
<label>Tarifa aproximada:</label>
</div>
<div class="col-2">
<label id="tarifa_calculada">--</label>
</div>
</div>

<div class="row" style="margin-bottom: 10px"></div>

<div class="row" style="margin-left: 2px; margin-right: 2px;">

<button id="previousButton" type="button" class="col-4 btn btn-primary">Anterior</button>
<div class="col-4"></div>
<button id="nextButton" type="button" class="col-4 btn btn-primary">Siguiente</button>

</div>

</div>
`
export const fileWrittenAlertTemplate = `
<div class="alert alert-warning alert-dismissible fade show" role="alert">
<strong>Fichero exportado correctamente</strong>
<button type="button" class="close" data-dismiss="alert" aria-label="Close">
  <span aria-hidden="true">&times;</span>
</button>
</div>`

export const dataImportedAlertTemplate = `
<div class="alert alert-warning alert-dismissible fade show" role="alert">
<strong>Datos importados correctamente desde el fichero. Se empieza un nuevo ciclo de lecturas.</strong>
<button type="button" class="close" data-dismiss="alert" aria-label="Close">
  <span aria-hidden="true">&times;</span>
</button>
</div>`