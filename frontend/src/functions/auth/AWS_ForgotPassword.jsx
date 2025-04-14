import { CognitoUser } from "amazon-cognito-identity-js";
import getUserPool from "./AWS_GetUserPool";

export default function AWS_ForgotPassword(email) {
  return new Promise((resolve, reject) => {
    const userPool = getUserPool();
    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    user.forgotPassword({
      onSuccess: (data) => {
        console.log("Code sent successfully:", data);
        resolve("A confirmation code has been sent to your email.");
      },
      onFailure: (err) => {
        console.error("Password reset request failed:", err);
        reject(err.message || "Password reset request failed.");
      },
    });
  });
}
