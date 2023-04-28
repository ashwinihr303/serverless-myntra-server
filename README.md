**Steps to run**
1.nvm use
2.npm install
3.To run locally with npm, run the command 'npm run start'
4.To run using serverless locally (offline) install serverless-offile npm package and add it under plugins in serverless.yml file as the last parameter. And in the command promt run the command 'serverless offline'

**Steps tpo deploy the serverless app to AWS API gateway:-**

1. .aws file under users/.aws contains aws creds, As of now aded root user secrete key and value, which needs to be chnaged with iam user secrete key by creating a new role with all required permissions like cloudformation, cloudwatch etc

2.npm i -g serverless && serverless and select the template of the app and other details // enter aws creds after creating security key in aws console for first time when .aws file does not exist

3.sls deploy //command to deploy serverless code , which will be deployed the code to API gateway

4.serverless --console // sets the serverless console

**Local development serverless-offline and serverless-dynamodb-offline**

It is also possible to emulate DynamoDB, API Gateway and Lambda locally using the `serverless-dynamodb-local` and `serverless-offline` plugins. In order to do that, run:

```bash
serverless plugin install -n serverless-dynamodb-local
serverless plugin install -n serverless-offline
```

It will add both plugins to `devDependencies` in `package.json` file as well as will add it to `plugins` in `serverless.yml`. Make sure that `serverless-offline` is listed as last plugin in `plugins` section:

```
plugins:
  - serverless-dynamodb-local
  - serverless-offline
```

You should also add the following config to `custom` section in `serverless.yml`:

```
custom:
  (...)
  dynamodb:
    start:
      migrate: true
    stages:
      - dev
```

Additionally, we need to reconfigure `AWS.DynamoDB.DocumentClient` to connect to our local instance of DynamoDB. We can take advantage of `IS_OFFLINE` environment variable set by `serverless-offline` plugin and replace:

```javascript
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
```

with the following:

```javascript
const dynamoDbClientParams = {};
if (process.env.IS_OFFLINE) {
  dynamoDbClientParams.region = "localhost";
  dynamoDbClientParams.endpoint = "http://localhost:8000";
}
const dynamoDbClient = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);
```

After that, running the following command with start both local API Gateway emulator as well as local instance of emulated DynamoDB:

```bash
serverless offline start
```

To learn more about the capabilities of `serverless-offline` and `serverless-dynamodb-local`, please refer to their corresponding GitHub repositories:

- https://github.com/dherault/serverless-offline
- https://github.com/99x/serverless-dynamodb-local
