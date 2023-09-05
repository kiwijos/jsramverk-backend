## Description
This is the backend part of our web application. By documenting our development process, this README will serve as a comprehensive reflection of our work in this course.

## Getting the application to run
### Fixing vulnerabilities
All vulnerabilities found when initially scanning the project using the npm audit tool were fixed by running the `npm audit fix` command – updating any vulnerable dependencies.

Some packages were vulnerable to Regular Expression DoS attacks, likely due to some sort of inefficient processing of certain inputs that causes the regular expressions to work very slowly. This vulnerability was sometimes related to another vulnerability, namely Inefficient Regular Expression Complexity. This means that the regular expressions had inefficient, or even exponential, worst-case computational complexities, resulting in excessive processing demands if certain patterns are input or when increasing the input length.

Another type of vulnerability was Exposure of Sensitive Information to an Unauthorized Actor. This seems to only have affected one package. The vulnerability suggests that, under certain conditions, an unauthorized actor could access sensitive information.

Yet another set of related vulnerabilities were Prototype Pollution Protection Bypass and Prototype Pollution. Prototype Pollution Protection Bypass means that an attacker could bypass the protections put in place to stop them from modifying global JavaScript object prototypes – causing Prototype Pollution.

### Generating database and table schema
When running the application and navigating from the front page to a single delayed train, an SQLite database was automatically created. When navigating back to the front page, the server would crash due to a missing "tickets" table in the database. The error was resolved by generating the table schema using the reset_db bash script.

### Getting API keys and loading environment variables
To get the backend up and running correctly we needed to create a .env file for the application to load in our environment variables. The variable we needed was "TRAFIKVERKET_API_KEY", so we also had to create accounts at Trafikverket to be able to create and use API keys to communicate with their API.

## Backend framwork
Express has been the recomended framework for our project. Chosing Express is however a common and well justified choice for several other reasons as well. It is one of the most widely adopted Node.js framworks in the industry, no doubt due to it's speed and simplicity and active development community. These features align closely with the requirements of the project. No wonder it is the recomended choice.
