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
        return "Pure-Blood"
    }else{
        return "Muggle"
    }

}

// export function messUpBlood(lastname){
    
//     let blood;
//     if(half.includes(lastname)){
//         blood = "Pure-Blood"
       
//     }
//     else if(!pure.includes(lastname) && !half.includes(lastname)){
//        blood = "Pure-Blood"
//     }else{
//         blood = generateRandomBloodType()
//     }
 
//     return blood;

//   function generateRandomBloodType() {
//     const randomNumbers = Math.floor(Math.random() * 3);
//     const bloodTypes = ["Muggle", "Half-Blood", "Pure-Blood"];
//     return bloodTypes[randomNumbers];
//   }
// };

 
