import { IContextType, IUser } from "@/lib/types";
import { useNavigate } from "react-router";
import { createContext, useContext, useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/appwrite/api";
export const INITIAL_USER = {id: '',firstName: '', lastName: '',username: '',email: '', role:'', permissions:[]};

export const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    setUser: () => { },
    isAuthenticated: false,
    rerender: false,
    setRerender:()=>{},
    setIsAuthenticated: () => { },
    currentDomain:'he_group', 
    setCurrentDomain: async (newDomain: string) => {},
    checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<IContextType>(INITIAL_STATE);
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const savedDomain:any = sessionStorage.hasOwnProperty('domain') ? sessionStorage.getItem('domain') :'he_group';
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [currentDomain, setCurrentDomain]= useState(savedDomain);
    const [rerender, setRerender] = useState(false); // Initialize the state
    const checkAuthUser = async () => {
        try {
            const currentAccount = await getCurrentUser();
            const userData = currentAccount?.data;
            if (currentAccount) {
                setUser({
                    id: userData?._id,
                    firstName: userData?.firstName,
                    lastName: userData?.lastName,
                    username: userData?.username,
                    email: userData?.email,
                    role:userData?.role,
                    permissions:userData?.permissions
                    
                }),
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.log(error)
            return false
        } finally {
            setIsLoading(false)
        }
    };
    useEffect (()=>{
        const cookieFallback = sessionStorage.getItem("token");
        if (cookieFallback === "[]" ||cookieFallback === null ||cookieFallback === undefined  ) {
          navigate("/login");
          return
        }
        checkAuthUser()
    }, [])
    const value = {
        user,
        setUser,
        isAuthenticated,
        rerender,
        setRerender,
        isLoading,
        currentDomain, 
        setCurrentDomain: async (newDomain: string) => {
            setCurrentDomain(newDomain);
            sessionStorage.setItem('domain', newDomain)
        },
        setIsAuthenticated,
        checkAuthUser
    }
    return (
       <AuthContext.Provider value={value}>
        {children}
       </AuthContext.Provider>
    )
}

export default AuthProvider;
export const useUserContext= () => useContext(AuthContext);
