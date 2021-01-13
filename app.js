const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// const team = buildTeam();
// buildTeam();

async function buildTeam() {

    let team = [];
    let addNewEmp = true;

    console.log("======\nEnter employees to build your Org Chart\n======");
    while(addNewEmp) {
        const empType = await queryEmpType();
        const empDetails = await queryEmpDetails(empType);
        team.push(empType);
        addNewEmp = await queryContinue();
    }
    console.log(team);
}

function queryEmpType() {
    return inquirer.prompt([
        {
            type: "list",
            name: "empType",
            message: "What type of Employee would you like to add to your Org Chart?",
            choices: [
                "Engineer",
                "Intern",
                "Manager"
            ]
        }
    ]).then((response) => response.empType);
}
queryEmpDetails("Engineer");
// queryEmpDetails("Intern");
// queryEmpDetails("Manager");
function queryEmpDetails(type) {
    let uniqueKey;
    switch(type) {
        case "Engineer":
            uniqueKey = "GitHub Profile";
            break;
        case "Intern":
            uniqueKey = "School";
            break;
        case "Manager":
            uniqueKey = "Office Number";
            break;
    }

    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: `Enter new ${type}'s Name:`
        },{
            type: "input",
            name: "id",
            message: `Enter new ${type}'s Employee ID:`
        },{
            type: "input",
            name: "email",
            message: `Enter new ${type}'s Email Address:`
        },{
            type: "input",
            name: "unique",
            message: `Enter new ${type}'s ${uniqueKey}:`
        }
    ]).then(response => console.log(response));
}

function queryContinue() {
    return inquirer.prompt([
        {
            type: "confirm",
            name: "continue",
            message: "Would you like to add another Employee to your Org Chart?"
        }
    ]).then((response) => response.continue);
}

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
