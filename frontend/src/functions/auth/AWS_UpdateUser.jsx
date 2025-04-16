import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import getUserPool from "./AWS_GetUserPool";

export default function AWS_UpdateUser(formData) {
  const userPool = getUserPool();

  const { first_name, last_name, address, contact, city, state, profileImage } =
    formData;

  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
      reject("No user is currently signed in.");
      return;
    }

    const attributeList = [
      new CognitoUserAttribute({
        Name: "custom:first_name",
        Value: first_name,
      }),
      new CognitoUserAttribute({
        Name: "custom:last_name",
        Value: last_name,
      }),
      new CognitoUserAttribute({
        Name: "custom:address",
        Value: address,
      }),
      new CognitoUserAttribute({
        Name: "custom:contact",
        Value: contact,
      }),
      new CognitoUserAttribute({
        Name: "custom:city",
        Value: city,
      }),
      new CognitoUserAttribute({
        Name: "custom:state",
        Value: state,
      }),
      new CognitoUserAttribute({
        Name: "custom:profileImage",
        Value: profileImage,
      }),
    ];

    cognitoUser.getSession((err, session) => {
      if (err || !session.isValid()) {
        reject("Session is invalid or expired.");
        return;
      }

      cognitoUser.updateAttributes(attributeList, (err, result) => {
        if (err) {
          reject(`Failed to update attributes: ${err.message}`);
        } else {
          resolve(result);
        }
      });
    });
  });
}
