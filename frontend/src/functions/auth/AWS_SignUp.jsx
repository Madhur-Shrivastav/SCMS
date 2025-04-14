import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import getUserPool from "./AWS_GetUserPool";
import addRetailer from "../lambda/AddRetailer";

export default function AWS_SignUp(formData) {
  const userPool = getUserPool();
  const {
    first_name,
    last_name,
    email,
    password,
    address,
    contact,
    city,
    state,
    role,
    profileImage,
  } = formData;

  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({
        Name: "email",
        Value: email,
      }),
      new CognitoUserAttribute({
        Name: "custom:address",
        Value: address,
      }),
      new CognitoUserAttribute({
        Name: "custom:first_name",
        Value: first_name,
      }),
      new CognitoUserAttribute({
        Name: "custom:last_name",
        Value: last_name,
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
        Name: "custom:role",
        Value: role,
      }),
      new CognitoUserAttribute({
        Name: "custom:profileImage",
        Value: profileImage,
      }),
    ];
    userPool.signUp(
      email,
      password,
      attributeList,
      null,
      async (err, result) => {
        if (err) {
          reject(`Error: ${err.message}`);
        } else {
          addRetailer(
            result.userSub,
            email,
            first_name + " " + last_name,
            contact,
            city,
            state,
            address,
            role,
            profileImage
          );
          resolve(`Success! User ${JSON.stringify(result.userSub)} created.`);
        }
      }
    );
  });
}
