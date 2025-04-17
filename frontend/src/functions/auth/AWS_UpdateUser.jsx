import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import getUserPool from "./AWS_GetUserPool";
import updateRetailer from "../lambda/UpdateRetailer";

export default function AWS_UpdateUser(formData, retailer_id) {
  const userPool = getUserPool();

  const {
    first_name,
    last_name,
    email,
    address,
    contact,
    city,
    state,
    profileImage,
    role,
  } = formData;

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
        Name: "email",
        Value: email,
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
          console.log(result);
          if (role === "Retailer") {
            updateRetailer(
              retailer_id,
              email,
              first_name + " " + last_name,
              contact,
              city,
              state,
              address,
              role,
              profileImage
            );
          }
          resolve(result);
        }
      });
    });
  });
}
