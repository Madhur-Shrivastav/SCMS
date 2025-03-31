import { CognitoUserPool } from "amazon-cognito-identity-js";

export default function getUserPool() {
  return new CognitoUserPool({
    UserPoolId: "",
    ClientId: "",
  });
}
