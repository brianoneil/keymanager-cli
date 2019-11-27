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
        const { print, parameters, prompt } = toolbox
        let { overwrite, appKey, region } = parameters.options;

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

        print.info(boxen(`Using AWS_PROFILE: ${process.env.AWS_PROFILE}`, {padding : 1}));

        if (!region) {

            if (process.env.AWS_REGION) {
                print.debug(`using process.env.AWS_REGION ${process.env.AWS_REGION }`)
                region = process.env.AWS_REGION
            }
            else {
                const result = await prompt.ask({
                    type: 'input',
                    name: 'region',
                    message: `No region set.  Please enter the AWS_REGION!`,
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

        let configFile = defaultConfig;

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
