"use strict";

const endpoint = "https://petlatkea.dk/2021/hogwarts/families.json";

let half = {};
let pure = {};

loadJSON();

function loadJSON() {
    fetch(endpoint)
      .then((response) => response.json())
      .then((jsonData) => {
        // when loaded, prepare objects
       half = jsonData.half;
       pure = jsonData.pure;
    //    console.log(half);
    //    console.log(pure);
       getBloodStatus();
      });
  }

  export function getBloodStatus(lastname){
    if(half.includes(lastname)){
        return "Half-Blood"
    }
    else if(pure.includes(lastname)){
        return "Pure Blood"
    }else{
        return "Muggle"
    }

}
 
