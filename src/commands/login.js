const path = require('path');
const fs = require('fs');
const child = require("child_process");
const boxen = require('boxen');
const ora = require('ora');

const command = {
    name: 'login',
    alias: ['logon', 'l'],
    description: `Login and set local credentials for accessing AWS`,
    run: async toolbox => {
        const { print, parameters, prompt } = toolbox

        let { user, watch } = parameters.options;


        // const output = child
        //     .execSync(`git log --format=%B%H----DELIMITER---- ${commitQualifer}`)
        //     .toString("utf-8");

        if (!user) {
            const result = await prompt.ask({
                type: 'input',
                name: 'user',
                message: `User? `,
            })
            if (result && result.user) user = result.user;
            else {
                print.error(`a user name is required to run the command!`)
            }

        }


        const loginCommand = `docker run -it -v "$HOME/.aws:/aws" turnerlabs/samlkeygen authenticate --all-accounts \
--url 'https://sts.turner.com/adfs/ls/IdpInitiatedSignOn.aspx?loginToRp=urn:amazon:webservices' \
--domain Turner --user`


    }
}

module.exports = command
