import { INewUser } from "../types";
import Apiservices from "../api/Apiservices";
import AuthenticatedApiService from "../api/AuthenticatedApiService";

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  try {
    console.log("USERS", user)
    // async register(username: string, email: string, password: string, firstName:string, lastName:string): Promise<any> {
    const newAccount = await Apiservices.authService.register(user);
    if (!newAccount) throw Error;
    return newAccount;
  } catch (error) {
    return error;
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await Apiservices.authService.login(user.email, user.password);
    sessionStorage.setItem("token", session?.data?.data?.token);
    return session;
  } catch (error) {
    return error;
  }
}

// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const currentAccount = await authenticatedApiService.getAccount();
    return currentAccount;
  } catch (error) {
    return error;
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const currentAccount = await authenticatedApiService.getAccount();

    return currentAccount?.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// ============================== SIGN OUT
export async function signOutAccount() {
  try {
    sessionStorage.removeItem("token");
  } catch (error) {
    console.log(error);
  }
}
