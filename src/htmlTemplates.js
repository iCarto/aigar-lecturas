export const usersListTemplate = `
<div class="container-fluid">       
<div class="row" style="margin-bottom: 20px"></div>
<div class="row">
<div class="col-12 progress" style="height: 30px;">
<h3>AIGAR Lecturas</h3>
</div>
</div>

<div class="row" style="margin-bottom: 20px"></div>

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
<option value="Todos">Todos</option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
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

<div class="row" style="margin-bottom: 20px"></div>

<div>
<ul id="usersList" class="list-group"></ul>
</div>
</div>
`
export const readingsTemplate = `
<div class="container-fluid">       
<div class="row" style="margin-bottom: 20px"></div>
<div class="row">
<div class="col-12 progress" style="height: 30px;">
<h3>AIGAR Lecturas</h3>
</div>
</div>

<div class="row" style="margin-bottom: 20px"></div>

<div class="row">
<div id="name" class="col-12">

</div>
</div>

<div class="row" style="margin-bottom: 20px"></div>

<div class="row">
<div class="col-12">
<form>
<div class="form-group">
<label for="">Número contador</label>
<div class="input-group mb-3">
<input type="text" class="form-control" aria-describedby="button-addon2" readonly>
<div class="input-group-append">
<button class="btn btn-outline-primary" type="button" id="button-addon2">Cambiar</button>
</div>
</div>
</div>
<div class="form-group">
<label class="font-weight-bold col-form-label-lg" for="exampleFormControlTextarea1">Lectura</label>
<input type="number" class="form-control form-control-lg text-right" autofocus>
</div>
</form>
</div>
</div>

<div class="row" style="margin-bottom: 20px"></div>

<div class="row">
<div class="col-10">
<label>Lectura anterior:</label>
</div>
<div class="col-2">
<label>25</label>
</div>
</div>

<div class="row">
<div class="col-10">
<label>Consumo calculado:</label>
</div>
<div class="col-2">
<label>--</label>
</div>
</div>

<div class="row">
<div class="col-10">
<label>Tarifa aproximada:</label>
</div>
<div class="col-2">
<label>--</label>
</div>
</div>

</div>
`