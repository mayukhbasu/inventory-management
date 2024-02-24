import axios from "axios";
import { FETCH_USERINFO_FAILURE, FETCH_USERINFO_REQUEST, FETCH_USERINFO_SUCCESS, FetchUserInfoFailure, FetchUserInfoSuccess, FetchUserInfoType } from "../types/userInfoTypes"
import { Dispatch } from "redux";

const fetchUserInfoRequest = (): FetchUserInfoType => {
  return {
    type: FETCH_USERINFO_REQUEST
  }
}

const fetchUserInfoSuccess = (response: FetchUserInfoSuccess): FetchUserInfoType => {
  return {
    type: FETCH_USERINFO_SUCCESS,
    payload: response
  }
}

const fetchUserInfoFailure = (response: FetchUserInfoFailure): FetchUserInfoType => {
  return {
    type: FETCH_USERINFO_FAILURE,
    payload: response
  }
}

export const userInfo = () => {
  return async (dispatch: Dispatch<FetchUserInfoType>) => {
    dispatch(fetchUserInfoRequest());
    try {
      const result = await axios.get(`http://localhost:8080/api/userinfo`, {withCredentials: true});
      return dispatch(fetchUserInfoSuccess(result.data));
    } catch(err:any) {
      return dispatch(fetchUserInfoFailure(err));
    }
  }
}