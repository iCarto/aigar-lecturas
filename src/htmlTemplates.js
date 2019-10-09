export const mainTemplate = `
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
<button type="button" class="btn btn-primary active">Recorrido</button>
<button type="button" class="btn btn-primary">Alfabético</button>
</div>
</div>

<div class="row" style="margin-bottom: 10px"></div>

<div class="row">
<div class="col-12 form-group">
<h6>Sector:</h6>
<select class="form-control" id="sector">
<option>Todos</option>
<option>1</option>
<option>2</option>
<option>3</option>
<option>4</option>
<option>5</option>
<option>6</option>
<option>7</option>
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