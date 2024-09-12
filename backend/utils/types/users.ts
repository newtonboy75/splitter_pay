import { ObjectId } from "bson";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  comparePassword: (enteredPassword: string) => boolean;
  accessToken?: string
}

export interface UserInfo {
  _id: ObjectId;
  name: string;
  email: string;
}
