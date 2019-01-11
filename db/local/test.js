const config = require("./config");
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
  region: config.dynamo.region,
  endpoint: new AWS.Endpoint(config.dynamo.endpoint)
});

let params = {
  TableName: config.dynamo.tableName,
  ExpressionAttributeValues: {
    ":animal_name": "Frankie"
  },
  KeyConditionExpression: "animal_name = :animal_name",
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
