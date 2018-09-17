let config = require("./config");
let AWS = require('aws-sdk');

AWS.config.update({
    region: config.dynamo.region
});

ddb = new AWS.DynamoDB({
    apiVersion: '2012-10-08'
});

var params = {
    AttributeDefinitions: [{
            AttributeName: 'animal_name',
            AttributeType: 'S'
        },
        {
            AttributeName: 'timestamp',
            AttributeType: 'N'
        }
    ],
    KeySchema: [{
            AttributeName: 'animal_name',
            KeyType: 'HASH'
        },
        {
            AttributeName: 'timestamp',
            KeyType: 'RANGE'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: config.dynamo.tableName,
    StreamSpecification: {
        StreamEnabled: true,
        StreamViewType: 'NEW_AND_OLD_IMAGES'
    },
};

ddb.createTable(params, function (err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data);
    }
});
