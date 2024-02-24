import { UserInfoResponse } from "../../models/UserInfo";
import { FETCH_USERINFO_FAILURE, FETCH_USERINFO_REQUEST, FETCH_USERINFO_SUCCESS, FetchUserInfoType } from "../types/userInfoTypes";

const initialState: UserInfoResponse = {
  loading: false,
  data: {
    name: "",
    email: "",
    googleId: ""
  },
  error: null
}

const userInfoReducer = (state = initialState, action: FetchUserInfoType): UserInfoResponse => {
  switch(action.type) {
    case FETCH_USERINFO_REQUEST:
      return {
        ...state,
        loading: true
      }
    case FETCH_USERINFO_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload
      }
    case FETCH_USERINFO_FAILURE:
      return {
        ...state,
        loading: false,
        data: action.payload.message
      }
    default:
      return state
  }
}

export default userInfoReducer;