export class Filter {
  constructor(order, sector) {
    this._order = order;
    this._sector = sector;
  }

  get order() {
    return this._order;
  }

  set order(newOrder) {
    this._order = newOrder;
  }

  get sector() {
    return this._sector;
  }

  set sector(newSector) {
    this._sector = newSector;
  } 

  filterByOptions(users) {
    if (this._order === "Alfabético") {
      users.sort(function(a, b){
        return a.name.localeCompare(b.name);
      });
    }else {
      users.sort(function(a, b){
        return a.orden - b.orden;
      });
    }

    if (this._sector === "Todos") {
      return users;
    }else {
      return users.filter(user => user.sector === parseInt(this._sector));
    }

  }

}

//ToDo: Mover a la clase Filter
export let Filters = {
    filterUserByName() {
        const value = $(this).val().toLowerCase();
        $("#usersList li").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        }); 
      }
};