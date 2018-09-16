let config = require("./config");
let AWS = require("aws-sdk");
let docClient = new AWS.DynamoDB.DocumentClient({
  region: config.dynamo.region
});

var fs = require('fs');
var catJson = JSON.parse(fs.readFileSync('cats.json', 'utf8'));

function addToCatsTable(cat) {
  let params = {
    TableName: config.dynamo.tableName,
    Item: {
      timestamp: new Date().getTime(),
      id: cat.cat_id,
      catName: cat.name,
      adopted: cat.adopted,
      like_counter: cat.like_counter,
      location: cat.location,
      cattributes: cat.cattributes,
      description: cat.description
    }
  };

  return docClient.put(params).promise()
};

catJson.forEach(cat => {
  addToCatsTable(cat);
});
