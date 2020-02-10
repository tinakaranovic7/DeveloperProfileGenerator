const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const convertFactory = require('electron-html-to');

inquirer.prompt([
    {
        type: "input",
        name: "username",
        message: "Enter your Github username?"
    },
    {
        type: "list",
        message: "Enter your favorite color?",
        name: "color",
        choices: [
            "grey",
            "yellow",
            "orange"
        ]
    }
]).then(function (data) {
    const queryURL = `http://api.github.com/users/${data.username}`;
    axios.get(queryURL)
    .then(function (res) {
        var html = makeHTML(res.data,  data.color)
        const conversion = convertFactory({
            converterPath: convertFactory.converters.PDF
          });
          conversion({ html: html, pdf: {
            printBackground: true,
          }}, function(err, result) {
            if (err) {
              return console.error(err);
            }
        
            console.log(result.numberOfPages);
            console.log(result.logs);
            result.stream.pipe(fs.createWriteStream(path.join(__dirname, "resume.pdf")));
            conversion.kill(); 
          });
    })
})
function makeHTML(data, color) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Resume</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    </head>
    <body class="text-white" style="background-color: pink;">
        <div class="container">
            <div class="row justify-content-center">
                <img src="${data.avatar_url}" alt="Avatar" class="rounded-circle border border-white position-relative"
                    style="height: 200px; width: auto; top: 80px;">
            </div>
        </div>
    
        <div class="container py-3 rounded" style="background-color: ${color};">
            <br>
            <br>
            <div class="row justify-content-center mt-4">
                <h1>Hi!</h1>
            </div>
            <div class="row justify-content-center">
                <h2>I'm ${data.name}</h2>
            </div>
            <div class="row justify-content-center">
                <h4>I'm working at ${data.company}</h4>
            </div>
            <div class="row justify-content-center">
                <div class="col-2 text-center"><a href="https://www.google.com/maps/search/${data.location}" class="text-white">${data.location}</a></div>
                <div class="col-2 text-center"><a href="https://github.com/${data.login}" class="text-white">Github</a></div>
                <div class="col-2 text-center"><a href="${data.blog}" class="text-white">My website</a></div>
            </div>
        </div>
        <h2 class="text-center my-3">My role is ${data.bio}</h2>
        <div class="container">
            <div class="row text-center">
                <div class="col-4 ml-auto mr-3 rounded pt-3" style="background-color: ${color};">
                    <h5>Repositories</h5>
                    <p>${data.public_repos}</p>
                </div>
                <div class="col-4 ml-3 mr-auto rounded pt-3" style="background-color: ${color};">
                    <h5>Followers</h5>
                    <p>${data.followers}</p>
                </div>
            </div>
            <div class="row text-center mt-3" style="margin-bottom: 200px;">
                <div class="col-4 ml-auto mr-3 rounded pt-3" style="background-color: ${color};">
                    <h5>Github Stars</h5>
                    <p>0</p>
                </div>
                <div class="col-4 ml-3 mr-auto rounded pt-3" style="background-color: ${color};">
                    <h5>Following</h5>
                    <p>${data.following}</p>
                </div>
            </div>
        </div>
    </body>
    </html>`
}