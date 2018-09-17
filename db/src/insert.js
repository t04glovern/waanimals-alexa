let config = require("./config");
let AWS = require("aws-sdk");
let docClient = new AWS.DynamoDB.DocumentClient({
  region: config.dynamo.region
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
      attributes: animal.cattributes,
      description: animal.description
    }
  };

  return docClient.put(params).promise()
};

animalJson.forEach(animal => {
  addToAnimalTable(animal);
});
