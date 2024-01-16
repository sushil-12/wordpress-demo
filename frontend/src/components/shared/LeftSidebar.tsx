import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useGetAllDomains, useGetAllNavItems, useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { logos } from "@/constants";
import { INavLink } from "@/lib/types";
import { ChevronDown, Settings } from "lucide-react";
import { useUserContext } from "@/context/AuthProvider";
import * as React from "react";

interface domain {
    name: string;
    link: string;
    title: string;
}

const LeftSidebar = () => {
    const { mutate: signOut, isSuccess } = useSignOutAccount();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, currentDomain, setCurrentDomain, rerender, setRerender } = useUserContext();
    const { mutateAsync: getAllDomains, isPending: isDomainLoading } = useGetAllDomains();
    const [domain, setDomains] = useState<domain[]>([]);
    const logoPath: string | undefined = logos[currentDomain as keyof typeof logos];
    const [sidebarLinks, setSideBarLinks] = useState<INavLink[]>([]); // Corrected type
    const [showSubcategories, setShowSubcategories] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState('');
    const { mutateAsync: getAllNavItems, isPending: isNavLoading } = useGetAllNavItems();

    const handleToggleSubcategories = (label: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        setActiveDropdown(label)
        setShowSubcategories(!showSubcategories);
    };

    const fetchDomains = async () => {
        try {
            const fetchedDomains = await getAllDomains();
            setDomains(fetchedDomains.data);
        } catch (error) {
            console.error('Error fetching domains:', error);
        }
    };

    const getNavItems = async () => {
        try {
            const navItems = await getAllNavItems();
            setSideBarLinks(navItems.data.navigationItems);
        } catch (error) {
            console.error('Error fetching nav items:', error);
        }
    };

    const handleDomainChange = (value: string) => {
        setCurrentDomain(value);
        getNavItems();
        navigate('/dashboard');
    };

    useEffect(() => {
        if (isSuccess) {
            navigate(0);
        }
        getNavItems();
        fetchDomains();
    }, [isSuccess, rerender]);

    return (
        <div className="leftsidebar">
            <div className="flex flex-col gap-11">
                <select
                    id="location"
                    name="location"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={currentDomain}
                    onChange={(e) => handleDomainChange(e.target.value)}
                >
                    {domain.map((item) => (
                        <option key={item?.name} value={item?.name}>
                            {item.title}
                        </option>
                    ))}
                </select>
                <div className="logo-container">
                    <Link to="/" className="flex gap-3 items-center">
                        <img src={logoPath} alt="Logo" width={200} height={60} />
                    </Link>
                </div>
                <Link to={`/profile/${user.id}`} className="flex gap-3">
                    <img alt="profile" src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMuVZPUguhjwOPqFgeplotL_MmSDTV2Y-dJh72EC8yTQ&s'} width={50} height={50} className="h-14 w-14 rounded-full" />
                    <div className="flex flex-col">
                        <p className="body-bold">
                            {user?.firstName + ' ' + user?.lastName}
                        </p>
                        <p className="small-regular text-light-3">
                            @{user.username}
                        </p>
                    </div>
                </Link>
                <ul className="flex flex-col gap-6">
                    {sidebarLinks?.map((link: INavLink) => {
                        const isActive = pathname.includes(link.route);
                        const hasSubcategories = link.category;

                        return (
                            <React.Fragment key={link.label}>
                                {link?.category ? (
                                    <li>
                                        <button type="button" className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-primary-500 hover:text-white justify-between" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example" onClick={handleToggleSubcategories(link?.label)}>
                                            <div className="link flex gap-4"><img src={link?.imgURL} alt={link?.label} className={`group-hover:invert-white ${isActive ? 'invert-white' : ''}`} />{link.label}</div>
                                            <ChevronDown />
                                        </button>
                                        <ul id="dropdown-example" className={`py-2 space-y-2 ${showSubcategories && activeDropdown == link?.label ? '' : 'hidden'}`}>
                                            <li className={`leftsidebar-link group ${isActive ? 'bg-primary-500 text-white ' : ''}`}>
                                                <div className="links">
                                                    <NavLink className="flex gap-4 items-center p-4" to={link?.type == 'custom_post' ? `/posts/${link?.route}` : link?.route}>
                                                        <img src={link?.imgURL} alt={link?.label} className={`group-hover:invert-white ${isActive ? 'invert-white' : ''}`} />{link.label}
                                                    </NavLink>
                                                </div>
                                            </li>
                                            <li className={`leftsidebar-link group ${isActive ? 'bg-primary-500 text-white ' : ''}`}>
                                                <div className="links">
                                                    <NavLink className="flex gap-4 items-center p-4" to={link?.type == 'custom_post' ? `/category/${link?.route}` : link?.route}>
                                                        <img src={link?.imgURL} alt={link?.label} className={`group-hover:invert-white ${isActive ? 'invert-white' : ''}`} />Manage category
                                                    </NavLink>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                ) : (
                                    <li className={`leftsidebar-link group ${isActive ? 'bg-primary-500 text-white ' : ''}`}>
                                        <div className="link-container" >
                                            <NavLink className="flex gap-4 items-center p-4" to={link?.type == 'custom_post' ? `/posts/${link?.route}` : link?.route}>
                                                <img src={link?.imgURL} alt={link?.label} className={`group-hover:invert-white ${isActive ? 'invert-white' : ''}`} />{link.label}
                                            </NavLink>
                                        </div>
                                    </li>
                                )}
                            </React.Fragment>
                        );
                    })}
                </ul>
            </div>
            <div className="user_profile_actions">
                <NavLink key='settings' className={`flex gap-4 items-center p-4 text-primary-500`} to={'/settings'}>
                    <Settings className="shad-button_ghost" />Settings
                </NavLink>
                <Button variant="ghost" className="shad-button_ghost" onClick={() => signOut()}>
                    <img src="/assets/icons/logout.svg" />
                    <p className="small-medium lg:base-medium" >Logout</p>
                </Button>
            </div>
        </div>
    );
};

export default LeftSidebar;
