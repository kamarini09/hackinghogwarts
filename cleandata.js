"use strict";

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
    house: ""
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
    student.lastname = makeFirstCapital(everyName.lastName);

    student.image = `images/${everyName.lastName.toLowerCase()}_${everyName.firstName.charAt(0).toLowerCase()}.png`



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
  //clone.querySelector('td[data-field="image"]>img').src = student.image;

  clone.querySelector("[data-field=house]").textContent = student.house;


  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}



//------------------------CONTROLER-----------------------------------
function makeFirstCapital(x){
return x.charAt(0).toUpperCase() + x.substring(1).toLowerCase();
}

function makeNickNameCapital(x){
    return x.substring(1).toLowerCase();
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
