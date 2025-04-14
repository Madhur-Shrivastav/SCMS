import { CognitoUserPool } from "amazon-cognito-identity-js";

export default function getUserPool() {
  return new CognitoUserPool({
    UserPoolId: "ap-south-1_dz1oUFGFN",
    ClientId: "42f227fjp3jv081h84slvn45ur",
  });
}
