const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const from_curr = document.querySelector(".from select");
const to_curr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const btn = document.querySelector("form button");

for (let select of dropdowns) {
    for (let currcode in countryList) {
        let newoptn = document.createElement("option");
        newoptn.innerText = currcode;
        newoptn.value = currcode;
        if (select.name == "from" && currcode == "USD") {
            newoptn.selected = "selected";    
        }
        else if (select.name == "to" && currcode == "INR") {
            newoptn.selected = "selected";    
        }
        select.append(newoptn);
    }
    select.addEventListener("change", (evt) => {
        updateflag(evt.target);
    });
}

const updateflag = (element) => {
    let currcode = element.value;
    let countrycode = countryList[currcode];
    let newsrc = `https://flagsapi.com/${countrycode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newsrc;
};

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amt = document.querySelector(".amount input"); // fixed space
    let amtval = amt.value;
    if (amtval == "" || amtval < 1) {
        amtval = 1;
        amt.value = "1";
    }
    const URL = `${BASE_URL}/${from_curr.value.toLowerCase()}/${to_curr.value.toLowerCase()}.json`;
    let response = await fetch(URL);
    let data = await response.json();
    let rate = data[to_curr.value.toLowerCase()];
    let final_amt = amtval * rate;
    msg.innerText = `${amtval} ${from_curr.value} = ${final_amt} ${to_curr.value}`; // fixed .value
});
