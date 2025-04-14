import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import getUserPool from "./AWS_GetUserPool";
import { UAParser } from "ua-parser-js";

export default async function AWS_LogIn(formData) {
  const userPool = getUserPool();
  const { email, password } = formData;

  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  const authenticationDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log("Login success:", result);
        const loginTime = new Date().toISOString();
        const parser = new UAParser();
        const deviceInfo = parser.getResult();
        const decodedPayload = result.getIdToken().decodePayload();

        const user = {
          id: decodedPayload["cognito:username"],
          email: decodedPayload["email"],
          firstName: decodedPayload["custom:first_name"],
          lastName: decodedPayload["custom:last_name"],
          contact: decodedPayload["custom:contact"],
          city: decodedPayload["custom:city"],
          state: decodedPayload["custom:state"],
          role: decodedPayload["custom:role"],
          address: decodedPayload["custom:address"],
          profileImage: decodedPayload["custom:profileImage"],
          time: loginTime,
          device: {
            browser: deviceInfo.browser.name,
            os: deviceInfo.os.name,
            device: deviceInfo.device.model || "Unknown Device",
          },
          token: result.getIdToken().getJwtToken(),
        };

        resolve(user);
      },
      onFailure: (err) => {
        console.error("Login failed:", err.message || JSON.stringify(err));
        reject(err);
      },
    });
  });
}
