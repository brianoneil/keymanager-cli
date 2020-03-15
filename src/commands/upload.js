const path = require('path');
const fs = require('fs');
const boxen = require('boxen');
const awsParamStore = require('aws-param-store');

const defaultConfig = './config.json';

function putBuffer({ key: key, filepath: configFilePath }) {
    let rawBuffer = fs.readFileSync(`${configFilePath}`)
    let results = awsParamStore.putParameterSync(key, rawBuffer.toString(), 'SecureString', {
        Overwrite: true
    })
    return results
}



const command = {
    name: 'upload',
    alias: ['write', 'u', 'put'],
    description: `upload the configuration to parameter store`,
    run: async toolbox => {
        const { print, parameters, prompt, filesystem } = toolbox
        let { overwrite, appKey, region, profile } = parameters.options;

        if (!appKey) {
            if (process.env.AWS_KEYNAME) {
                appKey = process.env.AWS_KEYNAME;
            }
            else {
                const result = await prompt.ask({
                    type: 'input',
                    name: 'appKey',
                    message: `Please enter the AWS_KEYNAME!`,
                })
                if (result && result.appKey) appKey = result.appKey;

            }
        }


        if(!profile) {
            const result = await prompt.ask({
                type: 'confirm',
                name: 'useProfile',
                message: `Do you want to use: ${process.env.AWS_PROFILE}?`
            })
            if (result && !result.useProfile) {

                const findCreds = /\[(?:(?!\]).)*/g

                const home = process.env.HOME;
                const credsPath = `${home}/.aws/credentials`;

                if (filesystem.exists(credsPath)) {
                    const creds = filesystem.read(credsPath);
                    const m = creds.match(findCreds).map(s => s.replace('[', ''));

                    const r = await prompt.ask({
                        type: 'select',
                        name: 'profile',
                        message: 'Which profile?',
                        choices: m
                    })
                    if (r && r.profile) {
                        process.env.AWS_PROFILE = r.profile;
                    }
                }
            }
        }
        else {
            process.env.AWS_PROFILE = profile;
        }
        
        print.info(boxen(`Using AWS_PROFILE: ${process.env.AWS_PROFILE}`, { padding: 1 }));


        if (!region) {

            if (process.env.AWS_REGION) {
                //print.debug(`using process.env.AWS_REGION ${process.env.AWS_REGION }`)
                region = process.env.AWS_REGION
            }
            else {
                const result = await prompt.ask({
                    type: 'select',
                    name: 'region',
                    message: `No region set.  Please enter the AWS_REGION!`,
                    choices: [
                        `us-east-2`,
                        `us-east-1`,
                        `us-west-1`,
                        `us-west-2`,
                        // `eu-central-1`,
                        // `eu-west-1`,
                        // `eu-west-2`,
                        // `eu-west-3`,
                        // `eu-north-1`,
                    ]
                })
                if (result && result.region) {
                    region = result.region;

                    //set the region for the process
                    process.env.AWS_REGION = region;
                }
            }
        }
        else {
            process.env.AWS_REGION = region;
        }

        let configFile = parameters.first || defaultConfig;

        if (!parameters.first) {
            //no file specified, promt for it
            const result = await prompt.ask({
                type: 'input',
                name: 'configFile',
                message: `What file do you want to read the config from? (default: ${defaultConfig})`,
            })
            if (result && result.configFile) configFile = result.configFile;
        }

        const writeOptions = { key: `/${appKey}`, filepath: configFile };

        //print.debug(JSON.stringify(writeOptions, null, 4));

        putBuffer(writeOptions)

    }
}

module.exports = command
