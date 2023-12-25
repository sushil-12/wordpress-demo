import Loader from '@/components/shared/Loader';
import { useUserContext } from '@/context/AuthProvider';
import { Outlet, Navigate } from 'react-router-dom';
const AuthLayout = () => {
    const { isAuthenticated, isLoading } = useUserContext();
    
    if (isLoading) {
        return <Loader />;
    }
    return (
        <>
            {isAuthenticated ? (<Navigate to="/" />)
                :
                (<>
                    <section className='flex flex-1 justify-center items-center'>
                        <Outlet />
                    </section>
                    <img src='/assets/images/login-background.jpg' alt='Login page' className=" hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"/>
                </>)}
        </>
    )
}

export default AuthLayout
