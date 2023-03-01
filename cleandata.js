"use strict";
import { getBloodStatus } from "./bloodstatus.js";


const endpoint = "https://petlatkea.dk/2021/hogwarts/students.json";
 
start();

const allStudents = [];

const Student = {
    firstname: "",
    lastName: "",
    middleName: "",
    nickName: "",
    gender: "",
    image: "",
    house: "",
    bloodstatus: ""
};
function start() {
  console.log("ready");

  loadJSON();
}
//--------------------MODEL--------------------------
function loadJSON() {
  fetch(endpoint)
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
    const student = Object.create(Student);
    let everyName = createName(jsonObject.fullname.trim());
    //console.log(createName(jsonObject.fullname));
    student.gender = jsonObject.gender;
    student.house = makeFirstCapital(jsonObject.house.trim()) ;
    
    
    student.firstname = makeFirstCapital(everyName.firstName);
    student.middlename = makeFirstCapital(everyName.middleName);
    student.nickname = everyName.nickName;
    student.lastname = makeLastNameCapital(everyName.lastName);

    student.image = putImage(everyName.lastName , everyName.firstName);
    
    student.bloodstatus = getBloodStatus(everyName.lastName);

    allStudents.push(student);
  }); 

  displayList();
}
 //--------------------------------VIEW--------------------------------
function displayList() {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  allStudents.forEach(displayStudent);
}

function displayStudent(student) {
   
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstname;
  clone.querySelector("[data-field=middleName]").textContent = student.middlename;
  clone.querySelector("[data-field=nickName]").textContent = student.nickname;
  clone.querySelector("[data-field=lastName]").textContent = student.lastname;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("#image").src = student.image;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=bloodStatus]").textContent = student.bloodstatus;
  


  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}



//------------------------CONTROLER-----------------------------------
function makeFirstCapital(x){
return x.charAt(0).toUpperCase() + x.substring(1).toLowerCase();
}

    
function makeLastNameCapital(x){
    const hyp = /[-]/;
    let hasHyphen = x.search(hyp);
    if(hasHyphen === -1){
      return x.charAt(0).toUpperCase() + x.substring(1).toLowerCase();
    }else{
      let first = x.charAt(0).toUpperCase() + x.substring(1,hasHyphen).toLowerCase();
      let second = x.charAt(hasHyphen+1).toUpperCase() + x.substring(hasHyphen+2).toLowerCase();
      
      return `${first}-${second}`
    
    }

    
  }
    

function createName(fullname){
    let firstName = fullname.substring(0, fullname.indexOf(" "));
    let lastName = fullname.substring(fullname.lastIndexOf(" ")+1);
    let nickName;
    let middleName;
   
    //this is for the single name
    const singleName = /[ ]/
    let isSingleName = fullname.search(singleName);
    if(isSingleName === -1){
        firstName = fullname;
        lastName = "";
    }

    //this is for the nickname
    const nic = /["]/;
    let isNick = fullname.search(nic);
    if (isNick === -1){
     middleName = fullname.substring(fullname.indexOf(" ")+1, fullname.lastIndexOf(" "));
    }else{
      nickName = fullname.substring(isNick +1, fullname.lastIndexOf("\""));
      middleName = fullname.substring(fullname.indexOf(" ")+1, isNick -1);
    }
    
    return {firstName , middleName , nickName , lastName}
  
  }


function putImage(lastname, firstname){

  if (lastname === "Patil"){
    return `images/${lastname.toLowerCase()}_${firstname.toLowerCase()}.png`
  
  }
  else if(lastname.includes('-')){
    return `images/${lastname.substring(lastname.indexOf("-") +1 )}_${firstname.charAt(0).toLowerCase()}.png`
  }
  else {
  return `images/${lastname.toLowerCase()}_${firstname[0].toLowerCase()}.png`
  }


}
