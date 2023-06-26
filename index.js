
import chalk from "chalk";
import { exec } from "child_process";
import fs from "fs";
import util from "util";
import { format, formatDistanceToNow, isAfter, isBefore, isFuture, isPast, parse, set} from "date-fns";
import { Command } from "commander";

const startMsg = `
To run, enter a date to terminal with
"node index.js --date yyyy-mm-dd"
`;
const title = `
Uppgift 2 Javascript Ramverk`;
const first = "Ceridwen";
const last = "Roberts";
const name = `${chalk.whiteBright.bold(first + " " + last)}`;

const asyncExec = util.promisify(exec);
const { stdout: gitVersion, stderr } = await asyncExec("git --version");
const { stdout: npmVersion, stderr: npmErr } = await asyncExec("npm --version");

let node = process.env.npm_config_user_agent;
if (node === undefined) {
node = `node version ${process.versions.node}, npm version ${npmVersion}`;
};

console.log(chalk.magentaBright.underline(title))
console.log(chalk.bgMagenta(startMsg));
console.log(`name: ${name}`);
console.log(`npm & node: ${node}`);
console.log(gitVersion);

const argumentParser = new Command();
argumentParser.option("--date")
argumentParser.parse();

const dateStringSentAsArgument = argumentParser.args[0];
const dateSentAsArgument = parse(dateStringSentAsArgument, 'yyyy-MM-dd', new Date());
const formattedDateArgument = format(dateSentAsArgument, 'yyyy-MM-dd');

const startOfCourse = new Date(2023, 0, 31);
const timeSinceStartOfCourse = formatDistanceToNow(startOfCourse);

const now = format(new Date(), 'yyyy-MM-dd HH:mm');
const currentDate = set(new Date(), {hours: 0, minutes: 0, seconds: 0, milliseconds: 0});

const before = isBefore(dateSentAsArgument, currentDate);
const after = isAfter(dateSentAsArgument, currentDate);
const timeRel = before ? "before" : (after ? "after" : " ")

// name: ${first} ${last}
// npm & node: ${node} 
// ${gitVersion}
const fileContent = `
Program last run: ${now}
Date entered by user: ${formattedDateArgument}.
The entered date is ${timeRel} today.
Time since start of course: ${timeSinceStartOfCourse}
`;

const markupContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
<header>
<h1>${title}</header>
<div>
<p>by ${first} ${last}</p>
<p>Run with ${node} and ${gitVersion}</p>
<p>${startMsg}</p>
</div>
    <p>
    Program last run: ${now}<br>
    Date entered by user: ${formattedDateArgument}.<br>
    The entered date is ${timeRel} today.<br>
    <br>
    Time since start of course: ${timeSinceStartOfCourse}
    </p>
</body>
</html>
`

await fs.promises.writeFile("index.md", fileContent);
await fs.promises.writeFile("index.html", markupContent);