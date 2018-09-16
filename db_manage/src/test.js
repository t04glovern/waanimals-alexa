const config = require("./config");
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
    region: config.dynamo.region
});

let params = {
    TableName: config.dynamo.tableName,
    ExpressionAttributeValues: { ":catName": "Frankie" },
    KeyConditionExpression: "catName = :catName",
    ScanIndexForward: false,
    Limit: 1
};

docClient.query(params, function (err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data.Items[0]);
    }
});
