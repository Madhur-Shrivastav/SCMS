import getUserPool from "./AWS_GetUserPool";
import removeRetailer from "../lambda/RemoveRetailer";

export default function AWS_RemoveUser(user) {
  const userPool = getUserPool();
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      reject("No user is currently signed in.");
      return;
    }

    cognitoUser.getSession((err, session) => {
      if (err || !session.isValid()) {
        reject("Session is invalid or expired.");
        return;
      }

      cognitoUser.deleteUser((err, result) => {
        if (err) {
          reject(`Failed to delete user: ${err.message}`);
        } else {
          console.log("User deleted:", result);
          if (user.role === "Retailer") {
            removeRetailer(user.id);
          }
          resolve("User deleted successfully.");
        }
      });
    });
  });
}
