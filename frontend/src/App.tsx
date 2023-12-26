import { Routes, Route } from 'react-router-dom';
import './globals.css';
import {Home} from './_root/pages';
import SignInForm from './_auth/Forms/SignInForm';
import SignUpForm from './_auth/Forms/SignUpForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout.tsx';
import { Toaster } from "@/components/ui/toaster"
import UsersList from './_root/pages/UsersList.tsx';
import Technology from './_root/pages/Technology.tsx';

const App = () => {
    return (
        <main className='flex h-screen comment-added'>
            
            <Routes>
                {/* Public Routes start */}
                <Route element={<AuthLayout />} >
                    <Route path='/sign-in' element={<SignInForm />} />
                    <Route path='/sign-up' element={<SignUpForm />} />
                </Route>
                {/* Public Routes End */}

                {/* Private Routes start */}
                <Route element={<RootLayout />} >
                    <Route index element={<Home />} />
                    <Route path='/all-users' element={<UsersList />} />
                    <Route path='/all-technologies' element={<Technology />} />
                </Route>

                {/* Private Routes */}

            </Routes>
            <Toaster />
        </main>
    )
}

export default App
