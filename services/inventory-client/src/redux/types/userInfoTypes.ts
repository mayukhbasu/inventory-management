export const FETCH_USERINFO_REQUEST = 'FETCH_USERINFO_REQUEST';
export const FETCH_USERINFO_SUCCESS = 'FETCH_USERINFO_SUCCESS';
export const FETCH_USERINFO_FAILURE = 'FETCH_USERINFO_FAILURE';

export interface FetchUserInfoSuccess {
  name: string;
  email: string;
  googleId: string;
}

export interface FetchUserInfoFailure {
  message: any;
}

interface FetchUserInfoActionRequest {
  type: typeof FETCH_USERINFO_REQUEST
}

interface FetchUserInfoActionSuccess {
  type: typeof FETCH_USERINFO_SUCCESS;
  payload: FetchUserInfoSuccess
}

interface FetchUserInfoActionFailure {
  type: typeof FETCH_USERINFO_FAILURE;
  payload: FetchUserInfoFailure
}

export type  FetchUserInfoType = FetchUserInfoActionRequest | FetchUserInfoActionSuccess | FetchUserInfoActionFailure;
