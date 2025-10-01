const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const meals = ["lunch", "dinner"];
const people = ["S", "R"];
const timeOptions = ["any", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30"];

function generateMealTable() {
    const table = document.getElementById("meal-table");

    let headerRow = document.createElement("tr");
    const emptyTD = document.createElement("td");
    headerRow.appendChild(emptyTD);
    for (curMeal of meals) {
        var th = document.createElement("th");
        th.innerText = curMeal.toUpperCase();
        th.className = curMeal;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    for (curDay of days) {
        let dayRow = document.createElement("tr");
        dayRow.id = curDay;
        let rowHeader = document.createElement("th");
        rowHeader.innerText = curDay;
        dayRow.appendChild(rowHeader);

        for (curMeal of meals) {
            var td = document.createElement("td");
            td.classList.add(curMeal);
            td.classList.add("meal-cell");

            for (person of people) {
                let personMeal = document.createElement("div");
                personMeal.className = "person-meal";

                let personMealToggle = document.createElement("div");
                personMealToggle.innerText = person;
                personMealToggle.classList.add(curMeal);
                personMealToggle.classList.add(person);
                personMealToggle.classList.add("person-meal-toggle");
                personMealToggle.addEventListener("click", function (event) {
                    const div = event.currentTarget;
                    div.classList.toggle('meal-on');

                    // const timeDropdownEle = div.parentNode.querySelector('option');
                    const timeDropdownEle = div.nextElementSibling;
                    timeDropdownEle.disabled = !div.classList.contains('meal-on');
                });
                personMeal.appendChild(personMealToggle);

                let timeDropdown = document.createElement("select");
                timeDropdown.setAttribute("name", "time");
                for (timeOption of timeOptions) {
                    let optionEle = document.createElement("option");
                    optionEle.value = timeOption;
                    optionEle.innerText = timeOption;
                    if (timeOption == timeOptions[0]) {
                        optionEle.selected = true;
                    }
                    timeDropdown.style.display = "block";
                    timeDropdown.disabled = true;
                    timeDropdown.appendChild(optionEle);
                }
                if (curMeal == "lunch") { // Only lunch have timings
                    personMeal.appendChild(timeDropdown);
                }

                td.appendChild(personMeal);
            }

            dayRow.appendChild(td);
        }

        table.appendChild(dayRow);
    }
}

function summariseMeals() {
    console.log("Summarise");
    let mealSchedule = {};

    for (curDay of days) {
        mealSchedule[curDay] = {};
        for (curMeal of meals) {
            mealSchedule[curDay][curMeal] = [];
        }
    }

    for (curDay of days) {
        let dayRow = document.getElementById(curDay);
        // console.log(dayRow);
        for (curMeal of meals) {
            let mealTD = dayRow.getElementsByClassName(curMeal)[0];
            // console.log(mealTD);
            for (person of people) {
                let personDiv = mealTD.querySelector("." + person);
                // console.log(personDiv);
                if (personDiv.classList.contains("meal-on")) {
                    // console.log(person + " has " + curDay + " " + curMeal);
                    const timeslot = curMeal == "lunch" ? personDiv.nextElementSibling.value : timeOptions[0];
                    mealSchedule[curDay][curMeal].push({ person: person, timeslot: timeslot });
                }
            }
        }
    }

    // console.log(mealSchedule);
    let mealSummary = document.getElementById("meal-summary");
    mealSummary.innerText = "";
    let mealParaSummary = document.createElement("p");
    mealParaSummary.id = "copy-target";
    var summaryString = "Meals for the week:\n";
    for (curDay of days) {
        summaryString += curDay + ": ";
        for (curMeal of meals) {
            summaryString += curMeal;
            mealArr = mealSchedule[curDay][curMeal];
            // TODO: This is VERRRRRY hardcoded. Make more elegent with persons.
            // So that in future just add one or two more and the whole system would scale.
            if (mealArr.length == 0) {
                summaryString += " S&R❌ ";
            } else if (mealArr.length == 2) {
                const timeslot_S = mealArr[0].timeslot;
                const timeslot_R = mealArr[1].timeslot;
                summaryString += ` S${timeslot_S == timeOptions[0] ? "" : "(" + timeslot_S + ")"}&R${timeslot_R == timeOptions[0] ? "" : "(" + timeslot_R + ")"}✅ `;
            } else if (mealArr.length == 1) {
                if (mealArr[0].person == "R") {
                    const timeslot = mealArr[0].timeslot;
                    summaryString += ` S❌R${timeslot == timeOptions[0] ? "" : "(" + timeslot + ")"}✅ `;
                } else if (mealArr[0].person == "S") {
                    const timeslot = mealArr[0].timeslot;
                    summaryString += ` S${timeslot == timeOptions[0] ? "" : "(" + timeslot + ")"}✅R❌ `;
                } else {
                    console.log("ERROR CASE UNKNOWN FIRST ITEM IN MEAL ARR: " + curDay + ", " + curMeal + ", " + mealArr);
                }
            } else {
                console.log("ERROR CASE: " + curDay + ", " + curMeal + ", " + mealArr);
            }
        }
        summaryString += "\n";
    }
    mealParaSummary.innerText = summaryString;
    mealSummary.appendChild(mealParaSummary);

    // NOTE: Copy para text button;
    let copyButton = document.createElement("button");
    copyButton.innerText = "Copy to Clipboard";
    copyButton.addEventListener("click", function (event) {
        var copyText = document.getElementById("copy-target").innerText;
        console.log(copyText);
        navigator.clipboard.writeText(copyText);
        alert("Copied the text: \n" + copyText);
    })
    copyButton.id = "copy-button";
    mealSummary.appendChild(copyButton);
}

generateMealTable();
document.getElementById("summarise-meals").addEventListener("click", summariseMeals);
