const path = require('path');
const fs = require('fs');
const awsParamStore = require('aws-param-store');
const ora = require('ora');

const defaultConfig = './config.json';

function putBuffer({ key: key, payload: payload }) {
    let results = awsParamStore.putParameterSync(key, payload.toString(), 'SecureString', {
        Overwrite: true
    })
    return results
}

function get({ key: key }) {
    let results = awsParamStore.getParameterSync(key)
    return JSON.parse(results.Value)
}
function write({ key: key, filename: filename }) {
    let filePayload = get({ key })
    try {
        filePayload = JSON.stringify(filePayload, null, 4)
        let fileReturn = fs.writeFileSync(`${filename}`, filePayload)
        return fileReturn
    } catch (error) {
        console.error(error)
    }
}

const command = {
    name: 'download',
    alias: ['get', 'd'],
    description: `download the configuration from parameter store to run the application`,
    run: async toolbox => {
        const { print, parameters, prompt } = toolbox

        let { overwrite, appKey } = parameters.options;

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

        let configFile = defaultConfig;

        if (!parameters.first) {
            //no file specified, promt for it/app/pegasus-dev
            const result = await prompt.ask({
                type: 'input',
                name: 'configFile',
                message: `Where do you want to save the config? (default: ${defaultConfig})`,
            })
            if (result && result.configFile) configFile = result.configFile;
        }

        const getOptions = { key: `/${appKey}` };
        const writeOptions = { key: `/${appKey}`, filename: configFile };



        const spinner = ora('Talking to AWS...').start();
        // let getReturn = get(getOptions);
        let writeReturn = write(writeOptions);
        spinner.stop();

        //     return new Promise( (resolve, reject) => {
        // setTimeout(() => {
        //             resolve();
        //         }, 2000);
        //     })


    }
}

module.exports = command
