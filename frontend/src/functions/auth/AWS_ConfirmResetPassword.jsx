import { CognitoUser } from "amazon-cognito-identity-js";
import getUserPool from "./AWS_GetUserPool";

export default function AWS_ConfirmResetPassword(formData) {
  return new Promise((resolve, reject) => {
    const { email, code, newpassword } = formData;
    const userPool = getUserPool();
    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    user.confirmPassword(code, newpassword, {
      onSuccess: () => {
        console.log("Password reset successful.");
        resolve("Password has been reset successfully.");
      },
      onFailure: (err) => {
        console.error("Password reset failed:", err);
        reject(err.message || "Password reset failed.");
      },
    });
  });
}
