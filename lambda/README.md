# WA Animals Alexa (Lambda)

Lambda function executed through Alexa to pull from DynamoDB

## Deploying WA Animals Alexa

Create a lambda function in your AWS account.

Run `npm run deploy`. this will perform the following three steps

```bash
zip -r catastic-alexa.zip *
aws s3 cp catastic-alexa.zip s3://waanimals-deployment-scripts/catastic-alexa/
rm catastic-alexa.zip
```

## Intent Schema

You can view the schema that needs to be used with this bot in `IntentSchema.json`

```json
{
  "name": "AdoptedIntent",
  "slots": [{
    "name": "first_name",
    "type": "AMAZON.FirstName"
  }],
  "samples": [
    "has {first_name} been adopted",
    "what is {first_name} adoption status",
    "was {first_name} adopted"
  ]
},
{
  "name": "DetailedIntent",
  "slots": [{
    "name": "first_name",
    "type": "AMAZON.FirstName"
  }],
  "samples": [
    "what can you tell me about {first_name}",
    "describe {first_name}",
    "whats the backstory of {first_name}",
    "whats {first_name} story",
    "tell me about {first_name}"
  ]
},
{
  "name": "ImportantIntent",
  "slots": [{
    "name": "first_name",
    "type": "AMAZON.FirstName"
  }],
  "samples": [
    "is {first_name} microchipped",
    "is {first_name} vaccinated",
    "is {first_name} desexed",
    "is {first_name} good with children",
    "what attributes does {first_name} have",
    "what important things do I need to know about {first_name}"
  ]
}
```
