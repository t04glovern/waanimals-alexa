# Catastic Alexa

Lambda function executed through Alexa to pull from DynamoDB

## Deploying Catastic Alexa

Create a lambda function in your AWS account.
Grab the zip version of this code by `cd`-ing into the `src` directory and running

```bash
zip -r ../catastic-alexa.zip *
```

Then upload this zip file to your new lambda function.

## Intent Schema

You can view the schema that needs to be used with this bot in `IntentSchema.json`

```json
{
  "interactionModel": {
    "languageModel": {
      "invocationName": "catastic adoptions",
      "intents": [{
          "name": "AMAZON.CancelIntent",
          "samples": []
        },
        {
          "name": "AMAZON.HelpIntent",
          "samples": []
        },
        {
          "name": "AMAZON.StopIntent",
          "samples": []
        },
        {
          "name": "AMAZON.NavigateHomeIntent",
          "samples": []
        },
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
        }
      ],
      "types": []
    }
  }
}

```
