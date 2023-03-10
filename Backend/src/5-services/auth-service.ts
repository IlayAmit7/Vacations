import { OkPacket } from "mysql";
import auth from "../2-utils/auth";
import hash from "../2-utils/cyber";
import dal from "../2-utils/dal";
import { UnauthorizedError, ValidationError } from "../4-models/client-errors";
import CredentialsModel from "../4-models/credentials-model";
import RoleModel from "../4-models/role-model";
import UserModel from "../4-models/user-model";

//* Add New User:
async function register(user: UserModel): Promise<string> {
  // <-- "string" because returning a new token

    user.password = hash(user.password);

  // Validate:
  const error = user.validate();
  if (error) throw new ValidationError(error);

  // Create minimum role:
  user.roleID = RoleModel.User;

  const sql = `INSERT INTO users VALUES(DEFAULT, ?, ?, ?, ?, ?)`;

  const result: OkPacket = await dal.execute(sql, [user.firstName,user.lastName,user.email,user.password,user.roleID + 1]);

  user.roleID = RoleModel.User+1;

  user.userID = result.insertId;

  //Delete password:
  delete user.password;

  // Generate new token:
  const token = auth.generateNewToken(user);

  return token;
}

//* Login:
async function login(credentials: CredentialsModel): Promise<string> {
  // Validate:

  credentials.password = hash(credentials.password);

  const error = credentials.validate();
  if (error) throw new ValidationError(error);

  const sql = `SELECT
                *
                FROM users
                WHERE email = ? AND password = ?`;

                // JOIN roles ON
                // users.roleID = roles.roleID

  // Get users from file:
  const users = await dal.execute(sql, [credentials.email, credentials.password]);

  const user = users[0];

  // If no such user exists:
  if (!user) throw new UnauthorizedError("Incorrect email or password");

  //Delete password:
  delete user.password;

  // Generate new token:
  const token = auth.generateNewToken(user);

  return token;
}

//* Check if the email is taken:
async function emailIsTaken(email: string): Promise<boolean> {
    
    const sql = `SELECT
                    1 FROM users
                    WHERE email = ?`;
    const users = await dal.execute(sql, email);
    
    if(users.length > 0) {
        return true
    } else {
        return false
    };
}

export default {
  register,
  login,
  emailIsTaken
};
