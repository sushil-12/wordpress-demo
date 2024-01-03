import { Outlet, Navigate } from 'react-router-dom';
const AuthLayout = () => {
    // const isAuthenticated = sessionStorage.getItem('token')!==undefined || sessionStorage.getItem('token') !=='';
    return (
        <>
            {/* {isAuthenticated ? () */}
                {/* : */}
                {/* (<> */}
                    <section className='flex flex-1 justify-center items-center'>
                        <Outlet />
                    </section>
                    <img src='/assets/images/login-background.jpg' alt='Login page' className=" hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"/>
                {/* </>)} */}
        </>
    )
}

export default AuthLayout
