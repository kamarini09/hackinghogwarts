"use strict";
import { getBloodStatus} from "./bloodstatus.js";


const endpoint = "https://petlatkea.dk/2021/hogwarts/students.json";

let globalObject ={filter: "*" ,prefects:[], squad:[] , sortBy: "firstname" , sortDir:""};
let hackingFlag = false;
 
 
start();

const allStudents = [];
const expelledStudents =[];

const Student = {
    firstName: "",
    lastName: "",
    middleName: "",
    nickName: "",
    gender: "",
    image: "",
    house: "",
    bloodstatus: "",
    squad: false ,
    prefect: false,
    isHacker: null
};
function start() {
  console.log("ready");
  loadJSON();
  triggerButtons();
  setTimeout(pishingPopUp, 8000);
  
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
    student.gender = jsonObject.gender;
    student.house = makeFirstCapital(jsonObject.house.trim()) ;
    student.firstname = makeFirstCapital(everyName.firstName);
    student.middlename = makeFirstCapital(everyName.middleName);
    student.nickname = everyName.nickName;
    student.lastname = makeLastNameCapital(everyName.lastName);
    student.image = putImage(everyName.lastName , everyName.firstName);
    //student.bloodstatus = getBloodStatus(everyName.lastName);


    
    
    
     if(hackingFlag===true){
      student.bloodstatus = messUpBlood(everyName.lastName);
     }else{
     student.bloodstatus = getBloodStatus(everyName.lastName);
     }
  
  
   

    
    allStudents.push(student);
  }); 
   buildList();
   showNumbers();
   //displayList(allStudents);
}
 //--------------------------------VIEW--------------------------------
 function showNumbers(){
  document.querySelector(".total-numbers .enrolled span").textContent = allStudents.length;
  document.querySelector(".total-numbers .expelled span").textContent = expelledStudents.length;


 }
 function buildList() {
  const currentList = filterList(allStudents);
  let sortedList = sortList(currentList);
  displayList(sortedList);
  document.querySelector(".list-length span").textContent = sortedList.length;
  //console.log(sortedList);
}
 function displayList(student) {
  showNumbers();
  // clear the list
  document.querySelector("section.students-list").innerHTML = "";
  student.forEach(displayStudent);
// build a new list
  
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // set clone data
  clone.querySelector("#image").src = student.image;
  clone.querySelector("[data-field=firstName]").textContent = student.firstname;
  clone.querySelector("[data-field=lastName]").textContent = student.lastname;

  clone.querySelector("#blood-status-icon").src = `images/icon-${student.bloodstatus.toLowerCase()}.svg`;
   
  if (student.squad) {
    clone.querySelector("#squad-icon").classList.remove("hide");  
  } 
  if (student.prefect) {
    clone.querySelector("#prefect-icon").classList.remove("hide");  
  } 


  
  if(student.house === "Gryffindor"){
    clone.querySelector("#single-student").classList.add("gryffindor");

  }else if(student.house === "Slytherin"){
    clone.querySelector("#single-student").classList.add("slytherin");
  }else if(student.house === "Ravenclaw"){
    clone.querySelector("#single-student").classList.add("ravenclaw");

  }else{
    clone.querySelector("#single-student").classList.add("hufflepuff");
  }

  
  
  document.querySelector(".house-Gryffindor span").textContent = allStudents.filter(student => student.house==="Gryffindor").length;
  document.querySelector(".house-Slytherin span").textContent = allStudents.filter(student => student.house==="Slytherin").length;
  document.querySelector(".house-Ravenclaw span").textContent = allStudents.filter(student => student.house==="Ravenclaw").length;
  document.querySelector(".house-Hufflepuff span").textContent = allStudents.filter(student => student.house==="Hufflepuff").length;
 



  clone.querySelector("div#single-student").addEventListener(`click`, () => {displayStudentCard(student)});
  
  // append clone to list
  document.querySelector(".students-list").appendChild(clone);
  
}

function displayStudentCard(student){
  const popup = document.querySelector("#student-card");
  popup.classList.remove("hide");
  expellButton();
  popup.querySelector("#dialog").classList ="";
  popup.querySelector("#image").src = student.image;
  popup.querySelector("[data-field=firstName]").textContent = student.firstname;
  popup.querySelector("[data-field=middleName]").textContent = student.middlename;
  popup.querySelector("[data-field=nickName").textContent = student.nickname;
  popup.querySelector("[data-field=lastName]").textContent = student.lastname;
  popup.querySelector("[data-field=gender").textContent = student.gender;
  popup.querySelector("[data-field=house]").textContent = student.house;
  
  if(student.house === "Gryffindor"){
    popup.querySelector("#dialog").classList.add("gryffindor");

  }else if(student.house === "Slytherin"){
    popup.querySelector("#dialog").classList.add("slytherin");
  }else if(student.house === "Ravenclaw"){
    popup.querySelector("#dialog").classList.add("ravenclaw");

  }else{
    popup.querySelector("#dialog").classList.add("hufflepuff");
  }
  popup.querySelector("[data-field=bloodStatus]").textContent = student.bloodstatus;
  
//------------------add someone to the squad-------------------------
  if (student.squad) {
    popup.querySelector("[data-field=squad]").textContent = "squad";
    popup.querySelector("[data-field=squad]").classList.add("active");
    //console.log("you are a squad member - change star");
  } else {
    popup.querySelector("[data-field=squad]").textContent = "Add to Squad";
    popup.querySelector("[data-field=squad]").classList.remove("active");

    //console.log("you are not squad");
  }
   
  // removeEventListeners();
  
   //add eventListeners
    popup.querySelector("[data-field=prefects]").addEventListener(`click`, isPrefect);
    popup.querySelector("[data-field=squad]").addEventListener(`click`, addToSquad);
    
  function removeEventListeners(){
    popup.querySelector("[data-field=prefects]").removeEventListener(`click`, isPrefect);
    popup.querySelector("[data-field=squad]").removeEventListener(`click`, addToSquad);
   popup.querySelector("[data-field=expell]").removeEventListener('click', expellStudent);

  }



  //popup.querySelector("[data-field=squad]").addEventListener(`click`, addToSquad);
   //popup.querySelector("[data-field=squad]").dataset.squad = student.squad;
  
  function addToSquad() {
    popup.querySelector("[data-field=squad]").removeEventListener(`click`, addToSquad);
    addToSquad2();
    
    if(hackingFlag){
     setTimeout( removeFromSquad, 3000);
     globalObject.squad = allStudents.filter(student => student.squad);
    console.log("addToSquad @@@@@@@@",globalObject.squad);

    }

    function addToSquad2(){
      console.log("im in the add to squad -not hacked mode");
      if (student.bloodstatus === "Pure-Blood" || student.house === "Slytherin") {
        student.squad = !student.squad;
        globalObject.squad = allStudents.filter(student => student.squad);
      } else {
        document.querySelector("#noSquad").classList.remove("hide");
        document.querySelector("#noSquad h1 span").textContent =`${student.firstname}`;
        document.querySelector("#noSquad .closebutton").addEventListener("click", closeDialog);
      }
      function closeDialog(){
      document.querySelector("#noSquad").classList.add("hide");
      document.querySelector("#noSquad .closebutton").removeEventListener("click", closeDialog);
        }
        displayStudentCard(student);
      buildList();
   
    }

    function removeFromSquad(){
      
      student.squad = false;
      console.log("im in the remove from squad",student)
      buildList();
      displayStudentCard(student);
    }
  }

  popup.querySelector(".closebutton").addEventListener('click', closeStudentCard);
//------------------make prefect-------------------------

if (student.prefect) {
  popup.querySelector("[data-field=prefects]").textContent = "Prefect";
  popup.querySelector("[data-field=prefects]").classList.add("active");
} else {
  popup.querySelector("[data-field=prefects]").textContent = "Add to Prefects";
  popup.querySelector("[data-field=prefects]").classList.remove("active");
}

popup.querySelector("[data-field=prefects]").dataset.prefect = student.prefect;

//popup.querySelector("[data-field=prefects]").addEventListener(`click`, isPrefect);
popup.querySelector(".closebutton").addEventListener('click', closeStudentCard);

// function to add or remove prefect
function isPrefect(){
  
  //removeEventListeners();
  
  if(student.prefect === true){
    student.prefect = false;

    
  } else {
    tryToMakeAPrefect(student);
   
  }
  
  buildList();
  displayStudentCard(student);
  
}

//------------------expell student-------------------------
popup.querySelector("[data-field=expell]").addEventListener('click', expellStudent);


function expellStudent(){
   document.querySelector("[data-field=expell]").classList.remove("active");
   document.querySelector("[data-field=expell]").classList.add("expelled");
   document.querySelector("[data-field=expell]").textContent="Expelled";



  if(student.isHacker){
    document.querySelector("#noExpell").classList.remove("hide");
    document.querySelector("#noExpell h1 span").textContent =`${student.firstname}`;
    document.querySelector("#noExpell .closebutton").addEventListener("click", closeDialog);
  }else {
  removeEventListeners();
  let oneStudent = allStudents.splice(allStudents.indexOf(student), 1)[0];
  expelledStudents.push(oneStudent);
  buildList();
  showNumbers();
  }
  function closeDialog(){
    document.querySelector("#noExpell").classList.add("hide");
    document.querySelector("#noExpell .closebutton").removeEventListener("click", closeDialog);
   }
}

//------------------close pop up------------------------


  function closeStudentCard(){
    console.log("CLOSE STUDENTC")
  popup.classList.add("hide");
  popup.querySelector("#dialog").classList = "";
  removeEventListeners();
  // popup.querySelector(".closebutton").removeEventListener("click", closeStudentCard());
  }
}
//------------------------CONTROLER-----------------------------------

//-----------------------cleaning data--------------------------------
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
    let nickName = "-";
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
    
    if (!middleName.trim()) {
      middleName = "-";
    }

    return {firstName , middleName , nickName , lastName}
  
  }


function putImage(lastname, firstname){

  if (lastname === "Patil"){
    return `images/${lastname.toLowerCase()}_${firstname.toLowerCase()}.png`
  
  }
  else if(lastname.includes('-')){
   
    return `images/${lastname.substring(lastname.indexOf("-") +1 ).toLowerCase()}_${firstname.charAt(0).toLowerCase()}.png`
  }
  else {
  return `images/${lastname.toLowerCase()}_${firstname[0].toLowerCase()}.png`
  }


}

function tryToMakeAPrefect(selectedStudent){
 globalObject.prefects = allStudents.filter(student => student.prefect)
  // i'm populating sameHouseAndGender when the selected students match the criteria on the return
  const sameHouseAndGender = globalObject.prefects.filter(student => student.house === selectedStudent.house && student.gender === selectedStudent.gender).shift();

    // if other is different than undefined, it means that is has been populated
    if (sameHouseAndGender !== undefined){
      console.log("Prefects must be a boy and a girl!");
      removeAorB(sameHouseAndGender, selectedStudent);
  } else {
      makePrefect(selectedStudent);
  }

  function removeAorB(studentA, studentB){
    // show names on buttons
    document.querySelector("#onlyonekind h1 span").textContent =`${studentB.firstname}`;
    document.querySelector("#onlyonekind [data-action=remove1] span").textContent =`${studentA.firstname}`;
    document.querySelector("#onlyonekind [data-action=remove2] span").textContent = `${studentB.firstname}`;
  
    // ask the user to ignore or remove 'A or B
    document.querySelector("#onlyonekind").classList.remove("hide");
    document.querySelector("#onlyonekind .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#onlyonekind [data-action=remove1]").addEventListener("click", clickRemoveA);
    document.querySelector("#onlyonekind [data-action=remove2]").addEventListener("click", clickRemoveB);
  
    // if ignore, do nothing
    function closeDialog(){
    document.querySelector("#onlyonekind").classList.add("hide");
    document.querySelector("#onlyonekind .closebutton").removeEventListener("click", closeDialog);
    document.querySelector("#onlyonekind [data-action=remove1]").removeEventListener("click", clickRemoveA);
    document.querySelector("#onlyonekind [data-action=remove2]").removeEventListener("click", clickRemoveB);
    }
  
  function clickRemoveA(){
        removePrefect(studentA);
        makePrefect(studentB);
        displayList(allStudents);
        closeDialog();
    }
  
  function clickRemoveB(){
    removePrefect(studentB);
    makePrefect(studentA);
    displayList(allStudents);
    closeDialog();
    }
  
  //------------filtering for prefect----------------------
  
}

// common to both solution 1 and 2 (check readme or documentation)
function removePrefect(student){
  console.log("remove prefect");
  student.prefect = false;
}

function makePrefect(student){
  student.prefect = true;
  if (globalObject.filter !== "*"){
    buildList();
  }
}

}


//--------------------triggerButtons--------------------------


function triggerButtons(){
  document.querySelector("#hacking").addEventListener("click", hackTheSystem);
  document.querySelectorAll(".filter").forEach((each) =>{each.addEventListener("click", filterInput);}); 
  document.querySelectorAll("[data-filter=prefects]").forEach((each) =>{each.addEventListener("click", filterByPrefect);}); 
  document.querySelectorAll("[data-filter=squad]").forEach((each) =>{each.addEventListener("click", filterBySquad);});
  document.querySelectorAll("#sort-options").forEach((each) =>{each.addEventListener("click", sortInput);});
  document.querySelectorAll("[data-filter=expelled]").forEach((each) =>{each.addEventListener("click", showExpelled);});
  document.querySelectorAll("[data-filter=enrolled]").forEach((each) =>{each.addEventListener("click", showEnrolled);});


  // document.querySelector("#sort-options").addEventListener("change", (event) => {
  //   let selectedOption = event.target.selectedOptions[0];
  //   globalObject.sortBy = selectedOption.dataset.sort;
  //   globalObject.sortDir = selectedOption.dataset.sortDirection;
  //   buildList()});
  document.querySelector("#searchbox").addEventListener("input", liveSearch);


}
//--------------------filtering--------------------------

  function filterInput(event){
    const filter = event.target.dataset.filter;
    setFilter(filter);
   }
  
 function setFilter(filter){
    globalObject.filter = filter;
    buildList();
}

 function filterList(filteredList){

  if (globalObject.filter !== "*") {
        filteredList = allStudents.filter(filterBy);
    } else {
        filteredList = allStudents;
    }
    return filteredList;
   
 }
  

  function filterBy(student){
    if(student.house.toLowerCase() === globalObject.filter ){
      return true
    }
    if(student.bloodstatus.toLowerCase() === globalObject.filter ){
      return true
    }
  }
 
  function filterByPrefect(){
    globalObject.prefects = allStudents.filter(student => student.prefect);
    displayList(globalObject.prefects);
    document.querySelector(".list-length span").textContent = globalObject.prefects.length;

    console.log(globalObject.prefects);
  }

  function filterBySquad(){
    //document.querySelector("[data-filter=squad]").classList.add("active");
    globalObject.squad = allStudents.filter(student => student.squad);

    displayList(globalObject.squad);
  document.querySelector(".list-length span").textContent = globalObject.squad.length;

    //buildList();
    console.log("filterBySquad @@@@@@@@",globalObject.squad);
  }
function showExpelled(){
  displayList(expelledStudents);
  document.querySelector(".list-length span").textContent = expelledStudents.length;

}

function showEnrolled(){
  displayList(allStudents);
  document.querySelector(".list-length span").textContent = allStudents.length;

}

//--------------------sorting--------------------------


function sortInput(event){

   const sortBy = event.target.dataset.sort;
   const sortDir = event.target.dataset.sortDirection;
   console.log(sortBy);
   console.log(sortDir);
  setSort(sortBy,sortDir);
  
}

function setSort(sortBy, sortDir){
  globalObject.sortBy = sortBy;
  globalObject.sortDir = sortDir;
  buildList();
}



function sortList(sortedList){
  
   let direction = 1;
   //for z-a
   if(globalObject.sortDir === "desc"){
       direction = -1;
    }
   sortedList = sortedList.sort(sortByInput);

  function sortByInput(studentA, studentB){
       //console.log(`sorted by ${globalObject.sortBy}`)
       //a-z
       //console.log(`im here and the globalObject sortBy is this ${globalObject.sortBy}`)
      if(studentA[globalObject.sortBy] < studentB[globalObject.sortBy]){
          return -1 * direction;
      }else{
          return 1 * direction;
      }
  }
   return sortedList;
  
     
}

  
//--------------------searching--------------------------

// ******* search bar ********
// https://css-tricks.com/in-page-filtered-search-with-vanilla-javascript/
// right now it's searching inside the entire student row, we need to narrow it down to only name, surname e nickname
function liveSearch() {
  // Locate the card elements
  let studentRow = document.querySelectorAll('#single-student');
  let studentName = document.querySelectorAll('#student-fullname');

  // Locate the search input
  let searchBar = document.getElementById("searchbox").value;

  // Loop through the cards
  for (let i = 0; i < studentRow.length; i++) {
    // If the text is within the card, and the text matches the search query, remove the `.is-hidden` class.
    if(studentName[i].innerText.toLowerCase().includes(searchBar.toLowerCase())){
      // we need to keep "remove hide" so that it keeps searching also when we delete a letter
      studentRow[i].classList.remove("hidden");
  } else {
    // Otherwise, add the class.
    studentRow[i].classList.add("hidden");
  }
  }}

  function hackTheSystem(){
    console.log("hacked!");
    if(hackingFlag === false){
    hackingFlag = true;
    document.querySelector("#pishing").classList.add("hide");
    const kama = createKama();
    const sofia = createSofia();
    allStudents.push(kama);
    allStudents.push(sofia);
    messUpBlood();
    buildList();
  }
  }
  
  function createKama(){
    const kama = Object.create(allStudents)
    kama.firstname = "Kamarini";
    kama.lastname= "Moragianni";
    kama.middlename= "";
    kama.nickname= "Koukoumafka";
    kama.gender= "girl";
    kama.image= "images/kamarini.png";
    kama.house= "Hufflepuff";
    kama.bloodstatus= "Muggle";
    kama.squad= false ;
    kama.prefect= false;
    kama.isHacker = true;

    return kama;
  }
  
  function createSofia(){
    const sofia = Object.create(allStudents);
    sofia.firstname = "Sofia";
    sofia.lastname = "Amoroso";
    sofia.middlename= "";
    sofia.nickname= "Olivia";
    sofia.gender= "Girl";
    sofia.image= "images/sofia.png";
    sofia.house= "Ravenclaw";
    sofia.bloodstatus= "Muggle";
    sofia.squad= false;
    sofia.prefect= false;
    sofia.isHacker = true;

    return sofia;
  }

  
 
  function messUpBlood(){
    allStudents.forEach((student) => {
      const randomNumbers = Math.floor(Math.random() * 3);
      const bloodTypes = ["Muggle", "Half-Blood", "Pure-Blood"];
      if (student.bloodstatus === "Half-Blood" || student.bloodstatus === "Muggle") {
        student.bloodstatus = "Pure-Blood";
      } else if (student.bloodstatus === "Pure-Blood") {
        student.bloodstatus = bloodTypes[randomNumbers];
      }
    });
  }
  
  function pishingPopUp(){
    document.querySelector("#pishing").classList.remove("hide");
  }

  function expellButton(){
    const statusButton = document.querySelector("[data-field=expell]");
    statusButton.addEventListener('mouseover', () => {
      statusButton.textContent = "Expell";
    });
    
    statusButton.addEventListener('mouseout', () => {
      statusButton.textContent = 'Enrolled';
    });
  }
  
  // function removeExpellButton(){
  //   const statusButton = document.querySelector("[data-field=expell]");
  //   statusButton.removeEventListener('mouseover', () => {
  //     statusButton.textContent = "Expell";
  //   });
    
  //   statusButton.removeEventListener('mouseout', () => {
  //     statusButton.textContent = 'Enrolled';
  //   });
  // }