export type { IUserState } from "./model/types";
export type { IUser } from "./api/types";
export { 
    selectUser,
    selectUserLoading,
    selectUserError,
} from "./model/selectors";
export { userSlice } from "./model/userSlice";
export { default as userReducer } from "./model/userSlice";


export { getUserInfo } from "./model/userThunk";