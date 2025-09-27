const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const meals = ["lunch", "dinner"];
const people = ["S", "R"];

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

            for (person of people) {
                let div = document.createElement("div");
                div.innerText = person;
                div.classList.add(curMeal);
                div.classList.add(person);
                div.classList.add("person-meal");
                div.addEventListener("click", function (event) {
                    const div = event.currentTarget;
                    div.classList.toggle('meal-on');
                });
                td.appendChild(div);
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
                    mealSchedule[curDay][curMeal].push(person);
                }
            }
        }
    }

    // console.log(mealSchedule);
    let mealSummary = document.getElementById("meal-summary");
    mealSummary.innerText = "";
    let mealParaSummary = document.createElement("p");
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
                summaryString += " S&R✅ ";
            } else if (mealArr.length == 1) {
                if (mealArr[0] == "R") {
                    summaryString += " S❌R✅ ";
                } else if (mealArr[0] == "S") {
                    summaryString += " S✅R❌ ";
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

    // TODO: Copy para text button;
}

generateMealTable();
document.getElementById("summarise-meals").addEventListener("click", summariseMeals);
