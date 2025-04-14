import { CognitoUser } from "amazon-cognito-identity-js";
import getUserPool from "./AWS_GetUserPool";

const AWS_ConfirmSignUp = async (formData) => {
  const userPool = getUserPool();
  return new Promise((resolve, reject) => {
    const { email, code } = formData;
    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);
    console.log(cognitoUser);

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        console.error(
          "Confirmation failed:",
          err.message || JSON.stringify(err)
        );
        reject(err);
      } else {
        console.log("Confirmation successful:", result);
        resolve(result);
      }
    });
  });
};

export default AWS_ConfirmSignUp;
