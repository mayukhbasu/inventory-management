interface UserInfo {
  name: string;
  email: string;
  googleId: string;
}

export interface UserInfoResponse {
  loading: boolean;
  data: UserInfo;
  error: any;
}