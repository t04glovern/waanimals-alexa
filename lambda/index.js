/* eslint-disable  func-names */
/* eslint-disable  no-console */

const config = require("./config");
const Alexa = require('ask-sdk-core');
const AWS = require("aws-sdk");
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

/* INTENT HANDLERS */
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const speakOutput = requestAttributes.t('WELCOME_MESSAGE', requestAttributes.t('SKILL_NAME'), "Felix");
        const repromptOutput = requestAttributes.t('WELCOME_REPROMPT');

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    },
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
        if (request.intent.slots.first_name.value && request.intent.slots.first_name.value !== "?") {
            name = request.intent.slots.first_name.value;
        }

        let speakOutput = "";
        let catItems = await getCatByName(name);

        if (catItems.Count > 0) {
            let cat = catItems.Items[0];

            if (cat.adopted) {
                let response = cat.catName + " has been adopted";
                sessionAttributes.speakOutput = response;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

                return handlerInput.responseBuilder
                    .speak(sessionAttributes.speakOutput)
                    .getResponse();
            } else {
                let response = cat.catName + " has not been adopted";
                sessionAttributes.speakOutput = response;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

                return handlerInput.responseBuilder
                    .speak(sessionAttributes.speakOutput)
                    .getResponse();
            }
        } else {
            speakOutput = requestAttributes.t('CAT_NOT_FOUND_MESSAGE');
            const repromptSpeech = requestAttributes.t('CAT_NOT_FOUND_REPROMPT');
            if (name) {
                speakOutput += requestAttributes.t('CAT_NOT_FOUND_WITH_ITEM_NAME', name);
            } else {
                speakOutput += requestAttributes.t('CAT_NOT_FOUND_WITHOUT_ITEM_NAME');
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
        if (request.intent.slots.first_name.value && request.intent.slots.first_name.value !== "?") {
            name = request.intent.slots.first_name.value;
        }

        let speakOutput = "";
        let catItems = await getCatByName(name);

        if (catItems.Count > 0) {
            let cat = catItems.Items[0];
            let response = cat.description;
            sessionAttributes.speakOutput = response;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

            return handlerInput.responseBuilder
                .speak(sessionAttributes.speakOutput)
                .getResponse();
        } else {
            speakOutput = requestAttributes.t('CAT_NOT_FOUND_MESSAGE');
            const repromptSpeech = requestAttributes.t('CAT_NOT_FOUND_REPROMPT');
            if (name) {
                speakOutput += requestAttributes.t('CAT_NOT_FOUND_WITH_ITEM_NAME', name);
            } else {
                speakOutput += requestAttributes.t('CAT_NOT_FOUND_WITHOUT_ITEM_NAME');
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

const ImportantHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'ImportantIntent';
    },
    async handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const request = handlerInput.requestEnvelope.request;

        let name;
        if (request.intent.slots.first_name.value && request.intent.slots.first_name.value !== "?") {
            name = request.intent.slots.first_name.value;
        }

        let speakOutput = "";
        let catItems = await getCatByName(name);

        if (catItems.Count > 0) {
            let cat = catItems.Items[0];

            let vaccinated = cat.cattributes.includes("vaccinated");
            let microchipped = cat.cattributes.includes("microchipped");
            let desexed = cat.cattributes.includes("desexed");
            let children = cat.cattributes.includes("children");

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
            speakOutput = requestAttributes.t('CAT_NOT_FOUND_MESSAGE');
            const repromptSpeech = requestAttributes.t('CAT_NOT_FOUND_REPROMPT');
            if (name) {
                speakOutput += requestAttributes.t('CAT_NOT_FOUND_WITH_ITEM_NAME', name);
            } else {
                speakOutput += requestAttributes.t('CAT_NOT_FOUND_WITHOUT_ITEM_NAME');
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
            SKILL_NAME: 'W.A Animal Adoptions',
            WELCOME_MESSAGE: 'Welcome to %s. You can ask questions such as, has %s been adopted...Now, what can I help you with?',
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Info about %s.',
            HELP_MESSAGE: 'You can ask questions such as, has %s been adopted, or, you can say exit...Now, what can I help you with?',
            HELP_REPROMPT: 'You can say things like, has %s been adopted, or you can say exit...Now, what can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
            CAT_REPEAT_MESSAGE: 'Try saying repeat.',
            CAT_NOT_FOUND_MESSAGE: 'I\'m sorry, I currently do not know ',
            CAT_NOT_FOUND_WITH_ITEM_NAME: 'the cat names %s. ',
            CAT_NOT_FOUND_WITHOUT_ITEM_NAME: 'that cat. ',
            CAT_NOT_FOUND_REPROMPT: 'What else can I help with?'
        },
    }
};
const docClient = new AWS.DynamoDB.DocumentClient({
    region: config.dynamo.region
});

// Find cat based on name
function getCatByName(name) {
    return new Promise((resolve, reject) => {
        let params = {
            TableName: config.dynamo.tableName,
            ExpressionAttributeValues: {
                ":catName": name
            },
            KeyConditionExpression: "catName = :catName",
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
        AdoptedHandler,
        DetailedHandler,
        ImportantHandler,
        HelpHandler,
        RepeatHandler,
        ExitHandler,
        SessionEndedRequestHandler
    )
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .lambda();
