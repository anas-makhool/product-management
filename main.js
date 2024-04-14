let title = document.querySelector("#title");
let price = document.querySelector("#price");
let taxes = document.querySelector("#taxes");
let ads = document.querySelector("#ads");
let discount = document.querySelector("#discount");
let total = document.querySelector("#total");
let count = document.querySelector("#count");
let category = document.querySelector("#category");
let submit = document.querySelector("#submit");
let search = document.querySelector("#search");
let deleteAll = document.querySelector("#deleteAll");
let checkInput = document.querySelector("#check");
let mood = "create";
let index;
let searchMood = "title";

let allInputs = Array.from(document.querySelectorAll(".price input"));
let tableBody = document.querySelector(".table-body");

function applyTheme() {
  const isChecked = localStorage.getItem("check") === "true";

  if (isChecked) {
    checkInput.checked = true
    document.body.classList.add("body-theme");
    document.querySelector(".table-handle").classList.add("check");
    document.querySelector("input:not(#check)").classList.add("check");
    document
    .querySelectorAll("input:not(#check)")
    .forEach((ele) => ele.classList.add("check"));
  } else {
    checkInput.checked = false
    document.body.classList.remove("body-theme");
    document.querySelector(".table-handle").classList.remove("check");
    document.querySelector("input:not(#check)").classList.remove("check");
    document
      .querySelectorAll("input:not(#check)")
      .forEach((ele) => ele.classList.remove("check"));
  }
}

checkInput.onclick = (e) => {
  localStorage.setItem("check", e.target.checked);
  applyTheme();

};

// Function to scroll to the top of the page smoothly
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Function to reset the total display area
function resetTotal() {
  total.lastElementChild.innerText = "";
  total.style.background = "#a00d02";
}

// Function to calculate and display the total amount
function getTotal() {
  if (price.value === "") return;
  let result = +price.value + +taxes.value + +ads.value - +discount.value;
  let totalText = total.lastElementChild;
  let check = allInputs.every((ele) => ele.value !== "");
  if (check) {
    totalText.textContent = result;
    total.style.background = "#4CAF50";
  } else {
    resetTotal();
  }
}

let data;

// Error Handling
try {
  data = localStorage.productData ? JSON.parse(localStorage.productData) : [];
} catch (error) {
  console.error("Error parsing localStorage data:", error);
  data = [];
}
// handle button delete all
function deleteAllDisplay() {
  if (data.length > 0) {
    deleteAll.style.display = "block";
    deleteAll.innerHTML = `Delete All (${data.length})`;
    document.querySelector(".table-handle").style.display = "block";
  } else {
    deleteAll.style.display = "none";
    document.querySelector(".table-handle").style.display = "none";
  }
  title.focus();
}
function deleteData() {
  const isConfirmed = confirm("Are you sure you want to delete all items?");
  if (isConfirmed) {
    localStorage.removeItem("productData");
    data = [];
    tableBody.innerHTML = "";
    deleteAllDisplay();
  }
  title.focus();
  scrollToTop();
}

// handle update product function
function updateFun(i) {
  let ele = data[i];
  title.value = ele.title;
  price.value = ele.price;
  ads.value = ele.ads;
  taxes.value = ele.taxes;
  discount.value = ele.discount;
  getTotal();
  count.style.display = "none";
  category.value = ele.category;

  submit.innerHTML = "Update";
  mood = "update";
  index = i;
  title.focus();
  scrollToTop();
}
// handle delete product function
function deleteFun(i) {
  const isConfirmed = confirm("Are you sure you want to delete this item?");
  if (isConfirmed) {
    data.splice(i, 1);
    localStorage.setItem("productData", JSON.stringify(data));
    updateTable();
    deleteAllDisplay();
    scrollToTop();
  }
  title.focus();
}

// Function to update the table with the latest data
function updateTable() {
  tableBody.innerHTML = ""; // Clear the table body before adding new data
  let newData = data.filter((ele) => ele !== null);
  newData.forEach((ele, i) => {
    let newTable = `<tr>
                            <td>${i + 1}</td>
                            <td>${ele.title}</td>
                            <td>${ele.price}</td>
                            <td>${ele.taxes}</td>
                            <td>${ele.ads}</td>
                            <td>${ele.discount}</td>
                            <td>${ele.total}</td>
                            <td>${ele.category}</td>
                            <td><button id="update${i}" onclick="updateFun(${i})">Update</button></td>
                            <td><button id="delete${i}" onclick="deleteFun(${i})">Delete</button></td>
                        </tr>`;
    tableBody.innerHTML += newTable;
  });
}

// Handle click event on submit button
submit.onclick = () => {
  let check =
    allInputs.every((ele) => ele.value !== "") &&
    title.value !== "" &&
    category.value !== "";

  if (!check) return;

  let newPro = {
    title: title.value,
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.lastElementChild.innerText,
    count: count.value,
    category: category.value,
  };
  if (mood === "create") {
    for (let i = 0; i < newPro.count; i++) {
      data.push(newPro);
    }
  } else if (mood === "update") {
    data[index] = newPro;
    // With the index, the item is updated in its spatial order
    // reset the data
    mood = "create";
    count.style.display = "block";
    submit.innerHTML = "Create";
  }

  document.querySelectorAll("input").forEach((ele) => (ele.value = ""));
  resetTotal();

  // Update localStorage with the latest data
  localStorage.setItem("productData", JSON.stringify(data));
  console.log(data);

  // Update the table with the latest data
  updateTable();
  deleteAllDisplay();
  scrollToTop();
};

// search handling with mood , category or title
function getSearchMood(e) {
  search.value = "";
  updateTable();
  if (e.id === "searchTitle") {
    searchMood = "title";
    search.placeholder = "Search By Title";
  } else if (e.id === "searchCategory") {
    searchMood = "category";
    search.placeholder = "Search By Category";
  }
  search.focus();
}

// Searching
function searchData(v) {
  tableBody.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    let ele = data[i];
    if (
      ele[searchMood].includes(v.toUpperCase()) ||
      ele[searchMood].includes(v.toLowerCase())
    ) {
      let newTable = `<tr>
                            <td>${i + 1}</td>
                            <td>${ele.title}</td>
                            <td>${ele.price}</td>
                            <td>${ele.taxes}</td>
                            <td>${ele.ads}</td>
                            <td>${ele.discount}</td>
                            <td>${ele.total}</td>
                            <td>${ele.category}</td>
                            <td><button id="update${i}" onclick="updateFun(${i})">Update</button></td>
                            <td><button id="delete${i}" onclick="deleteFun(${i})">Delete</button></td>
                        </tr>`;

      tableBody.innerHTML += newTable;
    }
  }
}

window.onload = () => {
  updateTable();
  deleteAllDisplay();
  title.focus();
  applyTheme();
};

// fix issus with mood
