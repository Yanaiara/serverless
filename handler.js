'use strict';

const patients = [
  { id: 1, name: 'Maria', birth: '1998-06-6' },
  { id: 2, name: 'Tania', birth: '1989-09-3' },
  { id: 3, name: 'Josea', birth: '1967-11-7' },
]

const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: 'PATIENTS'
};

module.exports.patientsList = async (event) => {
  try {
    let data = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.log("Error", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown error",
      }),
    };
  }
};

module.exports.registrationPatient = async (event) => {
  const { patientId } = event.pathParameters

  const patient = patients.find(patient => patient.id == patientId)

  if (patient === undefined) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Patient not found' }, null, 2)
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        patient
      },
      null,
      2
    )
  }
};
