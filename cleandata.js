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
    // Then I come here and I create a new object with the cleaned data.
    const student = Object.create(Student);
    student.gender = jsonObject.gender;
    student.house = makeFirstCapital(jsonObject.house.trim()) ;
   

    // This is where I turn the fullname's value into an array with "split"
    const text = jsonObject.fullname.split(" ");

    // Now I have the extra info in an array.
    // So I grab each array item and I store it in the allAnimals array in new properties
    // student.firstname = text[0];
    // student.lastname= text[2];
    // student.middlename= text[2];
    // student.nickname= text[2];
    

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
//   clone.querySelector("[data-field=firstname]").textContent = student.firstname;
//   clone.querySelector("[data-field=lastname]").textContent = student.lastname;
//   clone.querySelector("[data-field=middlename]").textContent = student.middlename;
//   clone.querySelector("[data-field=nickname]").textContent = student.nickname;
  clone.querySelector("[data-field=gender").textContent = student.gender;
//   clone.querySelector("[data-field=image").textContent = student.image;
  clone.querySelector("[data-field=house]").textContent = student.house;


  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}



//------------------------CONTROLER-----------------------------------
function makeFirstCapital(x){
return x.charAt(0).toUpperCase() + x.substring(1).toLowerCase();
}

//return nickname = name.substring(name.indexOf(`"`)+1,name.lastIndexOf(`"`));