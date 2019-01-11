const config = require("./config");
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({
  region: config.dynamo.region,
  endpoint: new AWS.Endpoint(config.dynamo.endpoint)
});

var fs = require('fs');
var animalJson = JSON.parse(fs.readFileSync('animals.json', 'utf8'));

function addToAnimalTable(animal) {
  let params = {
    TableName: config.dynamo.tableName,
    Item: {
      timestamp: new Date().getTime(),
      id: animal.animal_id,
      animal_name: animal.name,
      adopted: animal.adopted,
      like_counter: animal.like_counter,
      location: animal.location,
      attributes: animal.attributes,
      description: animal.description
    }
  };

  return docClient.put(params).promise()
};

animalJson.forEach(animal => {
  addToAnimalTable(animal);
});
