import { useUserContext } from "@/context/AuthProvider";
import { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/lib/types";

const LeftSidebar = () => {
    const { mutate: signOut, isSuccess } = useSignOutAccount();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user } = useUserContext();
    console.log(user);

    useEffect(() => {
        if (isSuccess) {
            navigate(0);
        }
    }, [isSuccess])
    return (
        <div className="leftsidebar">
            <div className="flex flex-col gap-11">
                <Link to="/" className="flex gap-3 items-center">
                    <img src="/assets/images/logo.png" alt="Logo" width={200} height={60} />
                </Link>
                <Link to={`/profile/${user.id}`} className="flex gap-3">
                    <img alt="profile" src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMuVZPUguhjwOPqFgeplotL_MmSDTV2Y-dJh72EC8yTQ&s'} width={50} height={50} className="h-14 w-14 rounded-full" />
                    <div className="flex flex-col">
                        <p className="body-bold">
                            {user?.firstName+ ' ' +user?.lastName}
                        </p>
                        <p className="small-regular text-light-3">
                            @{user.username}
                        </p>
                    </div>
                </Link>
                <ul className="flex flex-col gap-6">
                    {sidebarLinks?.map((link: INavLink) => {
                        const isActive = pathname === link.route;
                        return (
                            <li className={`leftsidebar-link group ${isActive ? 'bg-primary-500 text-white ' : ''}`} key={link?.label}>
                                <NavLink className="flex gap-4 items-center p-4" to={link?.route}>
                                    <img src={link?.imgURL} alt={link?.label} className={`group-hover:invert-white  ${isActive ? 'invert-white' : ''}`} />{link.label}
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>

            </div>
            <Button variant="ghost" className="shad-button_ghost" onClick={() => signOut()}>
                <img src="/assets/icons/logout.svg" />
                <p className="small-medium lg:base-medium" >Logout</p>
            </Button>
        </div>
    )
}

export default LeftSidebar
