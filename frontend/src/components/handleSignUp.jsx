import {
  CognitoUserPool,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "ap-south-1_JPVmTqWfQ", // Replace with your Cognito User Pool ID
  ClientId: "3bugp6l46qva766u4knq45lrgn", // Replace with your App Client ID
};

const userPool = new CognitoUserPool(poolData);

export default async function handleSignUp(formData) {
  const { first_name, last_name, email, contact, city, state, password } =
    formData;

  const attributeList = [
    new CognitoUserAttribute({ Name: "given_name", Value: first_name }),
    new CognitoUserAttribute({ Name: "family_name", Value: last_name }),
    new CognitoUserAttribute({ Name: "email", Value: email }),
    new CognitoUserAttribute({ Name: "phone_number", Value: contact }),
    new CognitoUserAttribute({ Name: "custom:city", Value: city }),
    new CognitoUserAttribute({ Name: "custom:state", Value: state }),
  ];

  try {
    // Wrapping the sign-up call in a promise to handle it asynchronously
    const result = await new Promise((resolve, reject) => {
      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          reject(err); // Reject if there is an error
        } else {
          resolve(result); // Resolve with the result if successful
        }
      });
    });

    console.log("Sign-up successful:", result);
    // You can perform further actions like redirecting the user or showing a confirmation message
  } catch (error) {
    console.error("Sign-up failed:", error);
    // You can show an error message to the user based on the error
  }
}
