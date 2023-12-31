import { Routes, Route } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';

import './globals.css';
import 'primeicons/primeicons.css';
import { Home } from './_root/pages';
import SignInForm from './_auth/Forms/SignInForm';

// import SignUpForm from './_auth/Forms/SignUpForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout.tsx';
import { Toaster } from "@/components/ui/toaster"
import UsersList from './_root/pages/UsersList.tsx';
import Technology from './_root/pages/Technology.tsx';
import Media from './_root/pages/Media.tsx';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { MediaProvider } from './context/MediaProvider.tsx';

const App = () => {
    return (
        <PrimeReactProvider>
            <main className='flex h-screen'>
                <Routes>
                    {/* Private Routes start */}
                    <Route element={<RootLayout />} >
                        <Route index element={<Home />} />
                        <Route path='/users' element={<UsersList />} />
                        <Route path='/technologies' element={<Technology />} />
                        <Route path='/media' element={ <MediaProvider><Media /></MediaProvider>} />

                    </Route>
                    {/* Private Routes */}

                    {/* Public Routes start */}
                    <Route element={<AuthLayout />} >
                        <Route path='/login' element={<SignInForm />} />
                        {/* <Route path='/sign-up' element={<SignUpForm />} /> */}
                    </Route>
                    {/* Public Routes End */}



                </Routes>
                <Toaster />
            </main>
        </PrimeReactProvider>
    )
}

export default App
