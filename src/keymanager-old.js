
/// ### https://hackernoon.com/managing-encryption-keys-with-aws-kms-in-node-js-c320c860019a
let path = require('path'),
    fs = require('fs');
const awsParamStore = require('aws-param-store');
const appDir = path.dirname(require.main.filename);
const appKey = process.env.AWS_KEYNAME;

function putBuffer({ key: key, payload: payload }) {
    let results = awsParamStore.putParameterSync(key, payload.toString(), 'SecureString', {
        Overwrite: true
    })
    return results
}

function get({ key: key }) {
    console.log(key)
    let results = awsParamStore.getParameterSync(key)
    return JSON.parse(results.Value)
}
function write({ key: key, filename: filename }) {
    let filePayload = get({ key })
    try {
        filePayload = JSON.stringify(filePayload)
        let fileReturn = fs.writeFileSync(`${appDir}/${filename}`, filePayload)
        console.log(fileReturn)
        return fileReturn
    } catch (error) {
        console.error(error)
    }
}



let configFile = 'config.json';
//let rawBuffer = fs.readFileSync(`${appDir}/${configFile}`)

//let putReturn = putBuffer({ key: `/${appKey}`, payload: rawBuffer });
let getReturn = get({ key: `/${appKey}` })
let writeReturn = write({ key: `/${appKey}`, filename: "config.json" })
