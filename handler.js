'use strict';

const patients = [
  {id: 1, name: 'Maria', birth: '1998-06-6'},
  {id: 2, name: 'Tania', birth: '1989-09-3'},
  {id: 3, name: 'Josea', birth: '1967-11-7'},
]
module.exports.patientsList = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        patients
      },
      null,
      2
    ),
  };
};
