const path = require('path');
const fs = require('fs');
const boxen = require('boxen');
const ora = require('ora');

const command = {
    name: 'login',
    alias: ['logon', 'l'],
    description: `Login and set local credentials for accessing AWS`,
    run: async toolbox => {
        const { print, parameters, prompt, commandLine, filesystem } = toolbox

        let { user, watch } = parameters.options;


        // const output = child
        //     .execSync(`git log --format=%B%H----DELIMITER---- ${commitQualifer}`)
        //     .toString("utf-8");

        // if (!user) {
        //     const result = await prompt.ask({
        //         type: 'input',
        //         name: 'user',
        //         message: `User? `,
        //     })
        //     if (result && result.user) user = result.user;
        //     else {
        //         print.error(`a user name is required to run the command!`)
        //     }

        // }

        const findCreds = /\[(?:(?!\]).)*/g

        const home = process.env.HOME;
        const credsPath = `${home}/.aws/credentials`;

        if(filesystem.exists(credsPath)) {
            const creds = filesystem.read(credsPath);
            const m = creds.match(findCreds).map(s => s.replace('[', ''));
            print.debug(JSON.stringify(m, null, 4));
        }

       

        


        // const loginCommand = `docker` 
        // const home = process.env.HOME;
        // const args = [`run`, `-it`, `-v`, `${home}/.aws:/aws`, `turnerlabs/samlkeygen`, `authenticate`, `--all-accounts`, `--url`, `'https://sts.turner.com/adfs/ls/IdpInitiatedSignOn.aspx?loginToRp=urn:amazon:webservices'`, `--domain`, `Turner`, `--user`, `${user}`]
        
        // // const args = [`run`, `-it`, `-v`, `${home}/.aws:/aws`, `turnerlabs/samlkeygen`, `version`]
        // /*
        // docker run -it -v "$HOME/.aws:/aws" turnerlabs/samlkeygen authenticate --all-accounts \
        // --url 'https://sts.turner.com/adfs/ls/IdpInitiatedSignOn.aspx?loginToRp=urn:amazon:webservices' \
        // --domain Turner --user <user_name>
        // */

        // const { spawn } = require('child_process');
        // const child = spawn(`docker`, args, { stdio: 'inherit'});
        // child.on('exit', (code) => {
        //     console.log(`Child process exited with code ${code}`);
        // });
    }
}

module.exports = command
