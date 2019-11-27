# Key Manager CLI

A CLI for managing configuration in AWS Parameter Store.

## Commands:

Name: `download`\
Alias: `read, get, d`\
Description: Download the configuration from parameter store to run the application

Name: `upload`\
Alias: `write, u, put`\
Optoins:\
* appKey - key name to use in Parameter Store
* region - the AWS_REGION to use when setting the parameter (only set in the running process)

Description: Upload the configuration to parameter store

## Usage:

Get the configuration from Parameter Store to run locally

```bash
keymanager download ./localconfig.json --appKey keymanager/test-dev --region us-east-1

```

## Built with Glue Gun

Check out the documentation at https://github.com/infinitered/gluegun/tree/master/docs.

