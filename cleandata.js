"use strict";
import { getBloodStatus } from "./bloodstatus.js";
//import { tryToMakeAPrefect } from "./prefect.js";


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
    bloodstatus: "",
    spuad: false,
    prefect: false
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

  if(student.squad){
    clone.querySelector("[data-field=squad]").textContent = "⭐";  
  } else {
    clone.querySelector("[data-field=squad]").textContent = "☆";
  }
  // set clone data
  clone.querySelector("#image").src = student.image;
  clone.querySelector("[data-field=firstName").textContent = student.firstname;
  clone.querySelector("[data-field=middleName]").textContent = student.middlename;
  clone.querySelector("[data-field=nickName").textContent = student.nickname;
  clone.querySelector("[data-field=lastName]").textContent = student.lastname;
  clone.querySelector("[data-field=gender").textContent = student.gender;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=bloodStatus]").textContent = student.bloodstatus;

  //add someone to the squad
  clone.querySelector("[data-field=squad]").addEventListener(`click`, addToSquad);
    function addToSquad(){
      if(student.bloodstatus ==="Pure Blood" || student.house ==="Slytherin"){
        student.squad = !student.squad;
       }else{
         alert("you cannott")
       }
      }

  //put a student in prefect
  clone.querySelector("[data-field=prefects]").dataset.prefect = student.prefect;
  clone.querySelector("[data-field=prefects]").addEventListener(`click`, makePrefect);

    function makePrefect(){
       console.log("im in makePrefect function")
        // untoggle an animal is always possible, but not toggle it (2 winners for each category)
        if(student.prefect === true){
            student.prefect = false;
        } else {
            tryToMakeAPrefect(student);
            console.log("im in the else")
        }
        //buildList();
        //displayList(); //??????????????????
    displayList();
    }
      
     
    
  

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

function tryToMakeAPrefect(selectedStudent){
  const prefects = allStudents.filter(student => student.prefect)
  const numberOfPrefects = prefects.length;
  const other = prefects.filter(student => student.house === selectedStudent.house ).shift();
  // if there is another of the same type
  if (other !== undefined){
      console.log("there can only be one prefect of each house!");
      removeOther(other);
  } else if (numberOfPrefects >= 3 ){ //testing
      console.log("there can only be two prefects");
      removeAorB(prefects[0], prefects[1]);
  } else {
      makePrefect(selectedStudent);
  }

  makePrefect(selectedStudent);


function removeOther(other){
  // show name on button
  document.querySelector("#onlyonekind p button span").textContent =`${other.firstname}, the ${other.house}`;

  // ask the user to ignore or remove the other
  document.querySelector("#onlyonekind").classList.remove("hide");
  document.querySelector("#onlyonekind .closebutton").addEventListener("click", closeDialog);
  document.querySelector("#onlyonekind p button").addEventListener("click", clickRemoveOther);
  // if ignore, do nothing (remove the event listeneras good practice)
  function closeDialog(){
  document.querySelector("#onlyonekind").classList.add("hide");
  document.querySelector("#onlyonekind .closebutton").removeEventListener("click", closeDialog);
  document.querySelector("#onlyonekind p button").removeEventListener("click", clickRemoveOther);
  }

function clickRemoveOther(){
  removePrefect(other);
  makePrefect(selectedStudent);
  // buildList();
  displayList();
  closeDialog();
  }
  }
  
function removeAorB(studentA, studentB){
  // show names on buttons
  document.querySelector("#onlytwowinners [data-action=remove1] span").textContent =`${studentA.name}, the ${studentA.house}`;
  document.querySelector("#onlytwowinners [data-action=remove2] span").textContent = `${studentB.name}, the ${studentB.house}`;

  // ask the user to ignore or remove 'A or B
  document.querySelector("#onlytwowinners").classList.remove("hide");
  document.querySelector("#onlytwowinners .closebutton").addEventListener("click", closeDialog);
  document.querySelector("#onlytwowinners [data-action=remove1]").addEventListener("click", clickRemoveA);
  document.querySelector("#onlytwowinners [data-action=remove2]").addEventListener("click", clickRemoveB);

  // if ignore, do nothing
  function closeDialog(){
  document.querySelector("#onlytwowinners").classList.add("hide");
  document.querySelector("#onlytwowinners .closebutton").removeEventListener("click", closeDialog);
  document.querySelector("#onlytwowinners [data-action=remove1]").removeEventListener("click", clickRemoveA);
  document.querySelector("#onlytwowinners [data-action=remove2]").removeEventListener("click", clickRemoveB);
  }

function clickRemoveA(){
      removePrefect(studentA);
      makePrefect(selectedStudent);
      // buildList();
      displayList();
      closeDialog();
  }

function clickRemoveB(){
  // else - if removeB
  removePrefect(studentB);
  makePrefect(selectedStudent);
  // buildList();
  displayList();
  closeDialog();
  }
   
}

function removePrefect(prefectStudent){
  console.log("remove prefect");
  prefectStudent.prefect = false;
}

function makePrefect(student){
  student.prefect = true;
}
}
