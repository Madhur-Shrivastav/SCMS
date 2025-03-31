import { CognitoUserPool } from "amazon-cognito-identity-js";

export default function getUserPool() {
  return new CognitoUserPool({
    UserPoolId: "ap-south-1_6YeC0ceA7",
    ClientId: "19gij5jtm9hjtvlk043tqkdrkr",
  });
}
