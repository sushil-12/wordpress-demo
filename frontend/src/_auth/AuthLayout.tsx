import { Outlet, Navigate } from 'react-router-dom';
const AuthLayout = () => {
    const token = localStorage.getItem('token');
    const isAuthenticated = token !== null && token !== '';
    console.log("ISAUTH", token, isAuthenticated)
    return (
        <>
            {isAuthenticated ? (<Navigate to="/" />)
                :
                (<>
                    <section className='flex flex-1 justify-center items-center bg-main-bg-900' >
                        <Outlet />
                    </section>
                </>)}
        </>
    )
}

export default AuthLayout
