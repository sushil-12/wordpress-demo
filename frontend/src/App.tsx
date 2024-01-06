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
import PostComponent from './_root/pages/PostComponent.tsx';
import Setting from './_root/pages/Setting.tsx';
import Media from './_root/pages/Media.tsx';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { MediaProvider } from './context/MediaProvider.tsx';
import PostOperation from './plugin/post/_custom_post/PostOperation.tsx';
import Category from './plugin/category/Category.tsx';

const App = () => {
    return (
        <PrimeReactProvider>
            <main className='flex h-screen'>
                <Routes>
                    {/* Private Routes start */}
                    <Route element={<RootLayout />} >
                        <Route index element={<Home />} />
                        <Route path='/users' element={<UsersList />} />
                        <Route path='/media' element={ <MediaProvider><Media /></MediaProvider>} />
                        <Route path='/settings' element={ <Setting />} />
                        <Route path='/category/:post_type' element={ <Category/>} />
                        {/* START____Will be a dynamic routes for creating Custom Post Types (ROUTE NAME MUST BE SIMILAR TO post_type) */}
                        <Route path='/posts/:post_type' element={<PostComponent />} />
                        {/* END____Will be a dynamic routes for creating Custom Post Types */}
                        <Route path='/post/:post_type/:post_id?' element={ <PostOperation />} /> 

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
