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
let mood = "create";
let index;
let searchMood = "title";

let allInputs = Array.from(document.querySelectorAll(".price input"));
let tableBody = document.querySelector(".table-body");

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function resetTotal() {
  total.lastElementChild.innerText = "";
  total.style.background = "#a00d02";
}

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

// Initialize data variable by checking localStorage
let data = localStorage.productData ? JSON.parse(localStorage.productData) : [];
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
    mood === "create";
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



window.onload = () => {
  updateTable();
  deleteAllDisplay();
  title.focus();
};
