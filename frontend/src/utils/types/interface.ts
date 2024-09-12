import { Dispatch, SetStateAction } from "react";

export type LoginType = {
  id: string;
  name: string;
  email: string;
  password: string;
  accessToken: string;
  refreshToken: string;
};

export interface AuthContextInterface {
  auth: LoginType | undefined;
  setAuth: Dispatch<SetStateAction<LoginType>>;
}

export type UserData = Omit<LoginType, "password">;

export interface Props {
  modalShow: () => void;
}

interface SplitDetails {
  id?: number;
  name: string;
  email: string;
  share_amount: string;
  is_initiator?: boolean;
}

export interface SplitterSingleSectionProps {
  splitDetails: SplitDetails;
  removeSplitItem: (email: string) => void;
}

export type WebSocketHook = {
  sendMessage: (message: string) => void;
  lastMessage: string | any | null;
  readyState: number;
};
