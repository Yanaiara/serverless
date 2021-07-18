'use strict';

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');

const { timeStamp } = require("console");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: 'PATIENTS'
};

module.exports.patientsList = async (event) => {
  try {
    let data = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items)
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
  try {
    const { patientId } = event.pathParameters;

    const data = await dynamoDb
      .get({
        ...params,
        Key: {
          patient_id: patientId,
        },
      })
      .promise();

    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Patient not found" }, null, 2),
      };
    }

    const patient = data.Item;

    return {
      statusCode: 200,
      body: JSON.stringify(patient, null, 2),
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

module.exports.createPatients = async (event) => {
  console.log(event);
  try {
    let data = JSON.parse(event.body);

    const { name, birth, phone, email } = data;

    const patient = {
      patient_id: uuidv4(),
      name,
      birth,
      email,
      phone,
      status: true,
      created_at: timeStamp,
      updated_at: timeStamp
    };

    await dynamoDb.put({
      TableName: "PATIENTS",
      Item: patient
    })
      .promise();

    return {
      statusCode: 201
    }
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
