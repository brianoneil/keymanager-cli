###### WM Proprietary (Internal Use Only)

# Key Manager CLI

A CLI for managing configuration in AWS Parameter Store.

## Commands:

Name: `download`\
Alias: `read, get, d`\
Optoins:
* appKey - key name to use in Parameter Store
* region - the AWS_REGION to use when setting the parameter (only set in the running process)

Description: Download the configuration from parameter store to run the application

Name: `upload`\
Alias: `write, u, put`\
Optoins:
* appKey - key name to use in Parameter Store
* region - the AWS_REGION to use when setting the parameter (only set in the running process)

Description: Upload the configuration to parameter store

## Usage:

You can clone the repo locally and run the following command to make it available to your machine

```bash
yarn link
```


Get the configuration from Parameter Store to run locally

```bash
#Download key from Paramater Store to a local file
keymanager download ./localconfig.json --appKey keymanager/test-dev --region us-east-1

#Upload key to Parameter Store from local file
keymanager upload ./localconfig.json --appKey keymanager/test-dev --region us-east-1

```

*NOTE:* To use this CLI you must have valid credentials set on your machine.  Typically this is done using the following command.

```bash

docker run -it -v "$HOME/.aws:/aws" turnerlabs/samlkeygen authenticate --all-accounts \
--url 'https://sts.turner.com/adfs/ls/IdpInitiatedSignOn.aspx?loginToRp=urn:amazon:webservices' \
--domain Turner --user [your_user_name]

```

## Built with Glue Gun

Check out the documentation at https://github.com/infinitered/gluegun/tree/master/docs.

