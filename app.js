//Import class constructors
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
//Require packages
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
//File paths
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
//Import html renderer
const render = require("./lib/htmlRenderer");

//Call function to build and save team array based on user input
const finalTeam = buildTeam();
//Render html with completed team array
const renderedHtml = finalTeam.then(result => render(result));
//Create a new file using the rendered html
const writeFile = renderedHtml.then(result => {
    fs.writeFile(outputPath, result, (err) => {
        err ? console.error(err) : console.log('Success!');
    })
});

async function buildTeam() {
    //Function to build team based on user input collected from inquirer prompts
    //Input: n/a
    //Output: Promise that will resolve to returning an array of Employee objects

    //Initialize team array
    let team = [];
    //Initialize while variable
    let addNewEmp = true;

    console.log("==========\nEnter Manager details to begin Org Chart\n==========")
    const newMgr = await queryEmpDetails("Manager");
    team.push(newMgr);

    console.log("==========\nEnter employees to build your Org Chart\n==========");

    //As long as the user wants to continue entering team members...
    while(addNewEmp) {
        //Call function to query new team member type
        const empType = await queryEmpType();
        //Call function to query user for team member details
        const newEmp = await queryEmpDetails(empType);
        //Push the new team member to the team array
        team.push(newEmp);
        console.log("==========")
        //Call function to see if user wants to add another team member
        addNewEmp = await queryContinue();
        console.log("==========")
    }
    
    //Return completed team array
    return team;
}

function queryEmpType() {
    //Function to query user asking what type of employee to add
    //Input: n/a
    //Output: Promise that will resolve to returning an employee type (string)

    return inquirer.prompt([
        {
            type: "list",
            name: "empType",
            message: "What type of Employee would you like to add to your Org Chart?",
            choices: [
                "Engineer",
                "Intern"
            ]
        }
    ]).then((response) => response.empType);
}

function queryEmpDetails(type) {
    //Function that will prompt user for necessary details to create a new Employee object
    //Input: employee type (string)
    //Output: Promise that will resolve to a new Employee sub-class object (object)

    //Prompt user for details
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
        //Return specific Employee class object based on type selected in "queryEmpType()"
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
    //Helper function to insert text into unique question for each Employee sub-class
    switch(type) {
        //Adds text for GitHub question for Engineers
        case "Engineer":
            return "GitHub Profile";
        //Adds text for School question for Interns
        case "Intern":
            return "School";
        //Adds text for Office Number for Managers
        case "Manager":
            return "Office Number";
    }
}

function queryContinue() {
    //Function that will ask user if they would like to continue adding new team members
    //Input: n/a
    //Output: Promise that will resolve to returning CONTINUE/TRUE or STOP/FALSE (boolean)

    return inquirer.prompt([
        {
            type: "confirm",
            name: "continue",
            message: "Would you like to add another Employee to your Org Chart?"
        }
    ]).then((response) => response.continue);
}