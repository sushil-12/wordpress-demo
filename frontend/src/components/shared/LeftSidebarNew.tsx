import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useGetAllDomains, useGetAllNavItems, useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { domainSidebarLinks, logos, websites } from "@/constants";
import { INavLink } from "@/lib/types";
import { MenuIcon, Settings } from "lucide-react";
import { useUserContext } from "@/context/AuthProvider";
import * as React from "react";

interface domain {
    name: string;
    link: string;
    title: string;
}
interface DropdownVisibilityState {
    [key: string]: boolean;
}

const LeftSidebarNew = () => {
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
    const [dropdownVisibility, setDropdownVisibility] = useState<DropdownVisibilityState>({});

    const handleToggleSubcategories = (label: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        setActiveDropdown(label)
        setShowSubcategories(!showSubcategories);
    };

    const toggleDropdown = (label: any) => {
        // Use the label to identify the specific dropdown
        setDropdownVisibility((prevVisibility) => ({
            ...prevVisibility,
            [label]: !prevVisibility[label],
        }));
    };

    console.log(domainSidebarLinks, 'domainSiidebarLinks')
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
        <div className="leftsidebar ">
            <div className="flex flex-col">
                <button data-drawer-target="sidebar-multi-level-sidebar" data-drawer-toggle="sidebar-multi-level-sidebar" aria-controls="sidebar-multi-level-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                    <span className="sr-only">Open sidebar</span>
                    <MenuIcon />
                </button>
                <aside id="sidebar-multi-level-sidebar" className="fixed border-r  top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                    <div className="h-full overflow-y-auto bg-light-1 dark:bg-gray-800">
                        <ul className="">
                            <li className="logo-container w-full mb-4">
                                <Link to="/" className="flex gap-3 items-center justify-center pt-6 pb-7 px-16">
                                    <img src={logoPath} alt="Logo" width={108} height={34} />
                                </Link>
                            </li>
                            {sidebarLinks?.map((link: INavLink) => {
                                const isActive = pathname.includes(link.route);
                                const hasSubcategories = link.category;

                                return (
                                    <React.Fragment key={link.label}>
                                        {link?.category ? (
                                            <li className="left-sidebar-link border-y hover:bg-gray-100 ">
                                                <button type="button" className="flex items-center w-full" aria-controls={`${link?.label}-dropdown`} data-collapse-toggle={`${link?.label}-dropdown`} onClick={() => toggleDropdown(link.label || '')}>
                                                    <img src={link?.imgURL} alt={link?.label} className='pl-6 pr-1' />
                                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap me-[100px] my-[22px]">{link?.label}</span>
                                                    <img src="/assets/icons/down-arrow.svg" className="dropdown-arrow relative right-5" alt="" />
                                                </button>
                                                <ul id={`${link?.label}-dropdown`} className={`py-2 space-y-2 ${dropdownVisibility[link?.label || ''] ? 'block' : 'hidden'}`}>
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

                                            <li className={`left-sidebar-link border-y hover:bg-gray-100 ${isActive ? 'bg-primary-500 text-white ' : ''}`}>
                                                <div className="link-container" >
                                                    <NavLink className="flex items-center rounded-lg dark:text-main-bg  dark:hover:bg-gray-700 group" to={link?.type == 'custom_post' ? `/posts/${link?.route}` : link?.route}>
                                                        <img src={link?.imgURL} alt={link?.label} className={`pl-6 pr-1' : ''}`} />
                                                        <span className="ms-3  my-[22px]">{link.label}</span>

                                                    </NavLink>
                                                </div>
                                            </li>
                                        )}
                                    </React.Fragment>
                                );
                            })}

                            <div className="user_profile_actions">
                                <NavLink key='settings' className={`flex gap-4 items-center p-4 text-primary-500`} to={'/settings'}>
                                    <Settings className="shad-button_ghost" />Settings
                                </NavLink>
                                <Button variant="ghost" className="shad-button_ghost" onClick={() => signOut()}>
                                    <img src="/assets/icons/logout.svg" />
                                    <p className="small-medium lg:base-medium" >Logout</p>
                                </Button>
                            </div>
                        </ul>
                    </div>

                </aside>
            </div>

        </div>
    );
};

export default LeftSidebarNew;
