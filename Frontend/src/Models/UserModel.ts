import RoleModel from "./RoleModel";

class UserModel {
    public userID: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public roleID: RoleModel;
}

export default UserModel;
