# WA Animals Alexa

## CloudFormation Deploy

[![https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=WA-Animals-Alexa-Service&templateURL=https://s3.amazonaws.com/waanimals-deployment-scripts/catastic-alexa/waa-cf-deploy.json)

Make the necessary changes in `aws/waa-cf-parameters.json` / change the stack name; then deploy the stack using the following.

```bash
aws cloudformation create-stack --stack-name "WA-Animals-Alexa-Service" \
--template-body file://aws/waa-cf-deploy.json \
--parameters file://aws/waa-cf-parameters.json \
--capabilities CAPABILITY_IAM
```

You can view the progress of your stack with the following

```bash
aws cloudformation describe-stacks --stack-name "WA-Animals-Alexa-Service"
```

You can use the OutputValue `FunctionARN` as your skill ARN when registering your skill on [https://developer.amazon.com/alexa/console](https://developer.amazon.com/alexa/console)

### Deploying Your Own

To deploy your own one, you'll need to create a new bucket and upload a zip of the contents of `lambda`. Follow the [instructions there](lambda/README.md)

## DB Management

You can use the tools in `db/` to create, insert and test data inserts into DynamoDB
