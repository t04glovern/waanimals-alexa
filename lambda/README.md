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
    "name": "animal_name",
    "type": "AMAZON.FirstName"
  }],
  "samples": [
    "find if {animal_name} has been adopted",
    "find out if {animal_name} has been adopted",
    "tell me if {animal_name} has been adopted",
    "is {animal_name} ready for adoption",
    "find whether {animal_name} has been adopted",
    "has {animal_name} been adopted",
    "what is {animal_name} adoption status",
    "was {animal_name} adopted"
  ]
},
{
  "name": "DetailedIntent",
  "slots": [{
    "name": "animal_name",
    "type": "AMAZON.FirstName"
  }],
  "samples": [
    "give me details about {animal_name}",
    "what can you tell me about {animal_name}",
    "describe {animal_name}",
    "whats the backstory of {animal_name}",
    "whats {animal_name} story",
    "tell me about {animal_name}"
  ]
},
{
  "name": "AttributeIntent",
  "slots": [{
    "name": "animal_name",
    "type": "AMAZON.FirstName"
  }],
  "samples": [
    "tell me whether {animal_name} is good with children",
    "tell me whether {animal_name} has been microchipped",
    "tell me whether {animal_name} has been vaccinated",
    "tell me whether {animal_name} has been desexed",
    "has {animal_name} been desexed",
    "has {animal_name} been vaccinated",
    "has {animal_name} been microchipped",
    "is {animal_name} microchipped",
    "is {animal_name} vaccinated",
    "is {animal_name} desexed",
    "is {animal_name} good with children",
    "what attributes does {animal_name} have",
    "what important things do I need to know about {animal_name}"
  ]
},
{
  "name": "InformationIntent",
  "slots": [],
  "samples": [
    "tell me how to adopt",
    "tell me how I can adopt",
    "how I can apply to adopt",
    "where can I find more information",
    "where can I find information about adoption",
    "how do I apply to adopt"
  ]
},
{
  "name": "WhereIntent",
  "slots": [{
    "name": "animal_name",
    "type": "AMAZON.FirstName"
  }],
  "samples": [
    "where can {animal_name} be picked up",
    "where can {animal_name} be adopted from",
    "where is {animal_name}",
    "tell me where {animal_name} can be adopted from",
    "where can I meet {animal_name}"
  ]
}
```
