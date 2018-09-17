/* eslint-disable  func-names */
/* eslint-disable  no-console */

const config = require("./config");
const Alexa = require('ask-sdk-core');
const AWS = require("aws-sdk");
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

/* CUSTOM INTENT HANDLERS */
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const speakOutput = requestAttributes.t('WELCOME_MESSAGE', requestAttributes.t('SKILL_NAME'), "Felix", "Frankie");
        const repromptOutput = requestAttributes.t('WELCOME_REPROMPT');

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    },
};

const InformationHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'InformationIntent';
    },
    async handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const speakOutput = requestAttributes.t('ADOPTION_INFORMATION');
        const repromptOutput = requestAttributes.t('WELCOME_REPROMPT');

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();

    }
};

const AdoptedHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AdoptedIntent';
    },
    async handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const request = handlerInput.requestEnvelope.request;

        let name;
        if (request.intent.slots.animal_name.value && request.intent.slots.animal_name.value !== "?") {
            name = request.intent.slots.animal_name.value;
        }

        let speakOutput = "";
        let animalItems = await getAnimalByName(name);

        if (animalItems.Count > 0) {
            let animal = animalItems.Items[0];

            if (animal.adopted) {
                let response = animal.catName + " has been adopted";
                sessionAttributes.speakOutput = response;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

                return handlerInput.responseBuilder
                    .speak(sessionAttributes.speakOutput)
                    .getResponse();
            } else {
                let response = animal.catName + " has not been adopted";
                sessionAttributes.speakOutput = response;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

                return handlerInput.responseBuilder
                    .speak(sessionAttributes.speakOutput)
                    .getResponse();
            }
        } else {
            speakOutput = requestAttributes.t('ANIMAL_NOT_FOUND_MESSAGE');
            const repromptSpeech = requestAttributes.t('ANIMAL_NOT_FOUND_REPROMPT');
            if (name) {
                speakOutput += requestAttributes.t('ANIMAL_NOT_FOUND_WITH_ITEM_NAME', name);
            } else {
                speakOutput += requestAttributes.t('ANIMAL_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speakOutput += repromptSpeech;

            sessionAttributes.speakOutput = speakOutput;
            sessionAttributes.repromptSpeech = repromptSpeech;

            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

            return handlerInput.responseBuilder
                .speak(sessionAttributes.speakOutput)
                .reprompt(sessionAttributes.repromptSpeech)
                .getResponse();
        }
    }
};

const DetailedHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'DetailedIntent';
    },
    async handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const request = handlerInput.requestEnvelope.request;

        let name;
        if (request.intent.slots.animal_name.value && request.intent.slots.animal_name.value !== "?") {
            name = request.intent.slots.animal_name.value;
        }

        let speakOutput = "";
        let animalItems = await getAnimalByName(name);

        if (animalItems.Count > 0) {
            let animal = animalItems.Items[0];
            let response = animal.description;
            sessionAttributes.speakOutput = response;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

            return handlerInput.responseBuilder
                .speak(sessionAttributes.speakOutput)
                .getResponse();
        } else {
            speakOutput = requestAttributes.t('ANIMAL_NOT_FOUND_MESSAGE');
            const repromptSpeech = requestAttributes.t('ANIMAL_NOT_FOUND_REPROMPT');
            if (name) {
                speakOutput += requestAttributes.t('ANIMAL_NOT_FOUND_WITH_ITEM_NAME', name);
            } else {
                speakOutput += requestAttributes.t('ANIMAL_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speakOutput += repromptSpeech;

            sessionAttributes.speakOutput = speakOutput;
            sessionAttributes.repromptSpeech = repromptSpeech;

            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

            return handlerInput.responseBuilder
                .speak(sessionAttributes.speakOutput)
                .reprompt(sessionAttributes.repromptSpeech)
                .getResponse();
        }
    }
};

const AttributeHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AttributeIntent';
    },
    async handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const request = handlerInput.requestEnvelope.request;

        let name;
        if (request.intent.slots.animal_name.value && request.intent.slots.animal_name.value !== "?") {
            name = request.intent.slots.animal_name.value;
        }

        let speakOutput = "";
        let animalItems = await getAnimalByName(name);

        if (animalItems.Count > 0) {
            let animal = animalItems.Items[0];

            let vaccinated = animal.attributes.includes("vaccinated");
            let microchipped = animal.attributes.includes("microchipped");
            let desexed = animal.attributes.includes("desexed");
            let children = animal.attributes.includes("children");

            let response = name;

            if (vaccinated) {
                response += " is Vaccinated, "
            } else {
                response += " is not Vaccinated yet, "
            }
            if (microchipped) {
                response += "has been Microchipped, "
            } else {
                response += "has not been Microchipped, "
            }
            if (desexed) {
                response += "and has been desexed. "
            } else {
                response += "and needs to be desexed. "
            }
            if (children) {
                if (desexed) {
                    response += name + " is also good with children!"
                } else if (!desexed) {
                    response += name + " is however very good with children!"
                }
            }

            sessionAttributes.speakOutput = response;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

            return handlerInput.responseBuilder
                .speak(sessionAttributes.speakOutput)
                .getResponse();
        } else {
            speakOutput = requestAttributes.t('ANIMAL_NOT_FOUND_MESSAGE');
            const repromptSpeech = requestAttributes.t('ANIMAL_NOT_FOUND_REPROMPT');
            if (name) {
                speakOutput += requestAttributes.t('ANIMAL_NOT_FOUND_WITH_ITEM_NAME', name);
            } else {
                speakOutput += requestAttributes.t('ANIMAL_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speakOutput += repromptSpeech;

            sessionAttributes.speakOutput = speakOutput;
            sessionAttributes.repromptSpeech = repromptSpeech;

            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

            return handlerInput.responseBuilder
                .speak(sessionAttributes.speakOutput)
                .reprompt(sessionAttributes.repromptSpeech)
                .getResponse();
        }
    }
};

const WhereHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'WhereIntent';
    },
    async handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const request = handlerInput.requestEnvelope.request;

        let name;
        if (request.intent.slots.animal_name.value && request.intent.slots.animal_name.value !== "?") {
            name = request.intent.slots.animal_name.value;
        }

        let speakOutput = "";
        let animalItems = await getAnimalByName(name);

        if (animalItems.Count > 0) {
            let animal = animalItems.Items[0];

            let response = name + " can be picked up from a carer in " + animal.location;
            sessionAttributes.speakOutput = response;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

            return handlerInput.responseBuilder
                .speak(sessionAttributes.speakOutput)
                .getResponse();
        } else {
            speakOutput = requestAttributes.t('ANIMAL_NOT_FOUND_MESSAGE');
            const repromptSpeech = requestAttributes.t('ANIMAL_NOT_FOUND_REPROMPT');
            if (name) {
                speakOutput += requestAttributes.t('ANIMAL_NOT_FOUND_WITH_ITEM_NAME', name);
            } else {
                speakOutput += requestAttributes.t('ANIMAL_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speakOutput += repromptSpeech;

            sessionAttributes.speakOutput = speakOutput;
            sessionAttributes.repromptSpeech = repromptSpeech;

            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

            return handlerInput.responseBuilder
                .speak(sessionAttributes.speakOutput)
                .reprompt(sessionAttributes.repromptSpeech)
                .getResponse();
        }
    }
};

/* GENERIC INTENT HANDLERS */
const HelpHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.speakOutput = requestAttributes.t('HELP_MESSAGE', "Felix");
        sessionAttributes.repromptSpeech = requestAttributes.t('HELP_REPROMPT', "Felix");

        return handlerInput.responseBuilder
            .speak(sessionAttributes.speakOutput)
            .reprompt(sessionAttributes.repromptSpeech)
            .getResponse();
    },
};

const RepeatHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        return handlerInput.responseBuilder
            .speak(sessionAttributes.speakOutput)
            .reprompt(sessionAttributes.repromptSpeech)
            .getResponse();
    },
};

const ExitHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('STOP_MESSAGE', requestAttributes.t('SKILL_NAME'));

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak('Sorry, I can\'t understand the command. Please say again.')
            .reprompt('Sorry, I can\'t understand the command. Please say again.')
            .getResponse();
    },
};

/* CONSTANTS */
const skillBuilder = Alexa.SkillBuilders.custom();
const languageStrings = {
    en: {
        translation: {
            SKILL_NAME: 'W.A Animals Adoption',
            WELCOME_MESSAGE: 'Welcome to %s. You can ask questions such as, has %s been adopted, or is %s good with children. Now, what can I help you with?',
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Info about %s.',
            HELP_MESSAGE: 'You can ask questions such as, has %s been adopted, or, you can say exit...Now, what can I help you with?',
            HELP_REPROMPT: 'You can say things like, has %s been adopted, or you can say exit...Now, what can I help you with?',
            ADOPTION_INFORMATION: 'For information about adoption, check out W.A animals.org.au',
            STOP_MESSAGE: 'Goodbye!',
            ANIMAL_REPEAT_MESSAGE: 'Try saying repeat.',
            ANIMAL_NOT_FOUND_MESSAGE: 'I\'m sorry, I currently do not know ',
            ANIMAL_NOT_FOUND_WITH_ITEM_NAME: 'the animal named %s. ',
            ANIMAL_NOT_FOUND_WITHOUT_ITEM_NAME: 'that animal. ',
            ANIMAL_NOT_FOUND_REPROMPT: 'What else can I help with?'
        },
    }
};
const docClient = new AWS.DynamoDB.DocumentClient({
    region: config.dynamo.region
});

// Find animal based on name
function getAnimalByName(name) {
    return new Promise((resolve, reject) => {
        let params = {
            TableName: config.dynamo.tableName,
            ExpressionAttributeValues: {
                ":animal_name": name
            },
            KeyConditionExpression: "animal_name = :animal_name",
            ScanIndexForward: false,
            Limit: 1
        };

        docClient.query(params, function (err, data) {
            if (err) {
                console.log("GetItem threw an error:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                resolve(data);
            }
        });
    });
};

// Finding the locale of the user
const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.t(...args);
        };
    },
};

/* LAMBDA SETUP */
exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        InformationHandler,
        AdoptedHandler,
        DetailedHandler,
        AttributeHandler,
        WhereHandler,
        HelpHandler,
        RepeatHandler,
        ExitHandler,
        SessionEndedRequestHandler
    )
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .lambda();
