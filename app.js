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

const finalTeam = buildTeam();
const renderedHtml = finalTeam.then(result => render(result));
const writeFile = renderedHtml.then(result => {
    fs.writeFile(outputPath, result, (err) => {
        err ? console.error(err) : console.log('Success!');
    })
});

async function buildTeam() {

    let team = [];
    let addNewEmp = true;

    console.log("======\nEnter employees to build your Org Chart\n======");
    while(addNewEmp) {
        const empType = await queryEmpType();
        const newEmp = await queryEmpDetails(empType);
        team.push(newEmp);
        addNewEmp = await queryContinue();
    }
    
    return team;
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

function queryEmpDetails(type) {

    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: `${type}'s Name:`
        },{
            type: "input",
            name: "id",
            message: `${type}'s Employee ID:`
        },{
            type: "input",
            name: "email",
            message: `${type}'s Email Address:`
        },{
            type: "input",
            name: "unique",
            message: `${type}'s ${setUniquePrompt(type)}:`
        }
    ]).then(response => {
        const {name, id, email, unique} = response;
        if(type === "Engineer") {
            return new Engineer(name, id, email, unique);
        } else if(type === "Intern") {
            return new Intern(name, id, email, unique);
        } else {
            return new Manager(name, id, email, unique);
        }
    });
}

function setUniquePrompt(type) {
    switch(type) {
        case "Engineer":
            return "GitHub Profile";
        case "Intern":
            return "School";
        case "Manager":
            return "Office Number";
    }
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
