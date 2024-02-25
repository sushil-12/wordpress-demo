import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { domainSidebarLinks, logos, websites } from "@/constants";
import { INavLink } from "@/lib/types";
import { MenuIcon, Settings } from "lucide-react";
import { useUserContext } from "@/context/AuthProvider";
import * as React from "react";
import { formatString } from "@/lib/utils";

interface DropdownVisibilityState {
    [key: string]: boolean;
}

const LeftSidebar = () => {
    const { mutate: signOut, isSuccess } = useSignOutAccount();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, currentDomain, setCurrentDomain, rerender, setRerender } = useUserContext();
    const logoPath: string | undefined = logos[currentDomain as keyof typeof logos];

    const [dropdownVisibility, setDropdownVisibility] = useState<DropdownVisibilityState>({});
    const [activeSubmenu, setActiveSubmenu] = useState('');

    const toggleActiveSubmenu = (submenuKey: string) => {
        setActiveSubmenu(submenuKey);
        console.log("activeSubmenu", activeSubmenu, 'cdf', submenuKey)
    };

    const toggleDropdown = (label: any) => {
        // Use the label to identify the specific dropdown
        setDropdownVisibility((prevVisibility) => ({
            ...prevVisibility,
            [label]: !prevVisibility[label],
        }));

        // Toggle the rotated class for the dropdown arrow
        console.log(`${label}-dropdown-arrow`)
        const dropdownArrow = document.getElementById(`${label}-dropdown-arrow`);
        if (dropdownArrow) {
            dropdownArrow.classList.toggle('rotated');
        }
    };


    useEffect(() => {
        if (isSuccess) {
            navigate(0);
        }
        // getNavItems();
        // fetchDomains();
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
                        <ul className="overflow-y-auto scroll-m-6">
                            <li className="logo-container w-full mb-4">
                                <Link to="/" className="flex gap-3 items-center justify-center pt-6 pb-7 px-16">
                                    <img src={logoPath} alt="Logo" width={108} height={34} />
                                </Link>
                            </li>
                            {/* @ts-ignore */}
                            {domainSidebarLinks.comman?.map((link: INavLink) => {
                                const isActive = pathname.includes(link.route);

                                return (
                                    <React.Fragment key={link.label}>
                                        {link?.subcategory ? (
                                            <li className="left-sidebar-link border-y">
                                                <button type="button" className="flex items-center w-full" aria-controls={`${link?.label}-dropdown`} data-collapse-toggle={`${link?.label}-dropdown`} onClick={() => toggleDropdown(link.label || '')}>
                                                    <img src={link?.imgURL} alt={link?.label} className='pl-6 pr-1' />
                                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap my-[22px]">{link?.label}</span>
                                                    <img src="/assets/icons/down-arrow.svg" className={`${link?.label}-dropdown-arrow mr-5`} alt="" />
                                                </button>
                                                <ul id={`${link?.label}-dropdown`} className={`py-2 space-y-2 ${dropdownVisibility[link?.label || ''] ? 'block' : 'hidden'}`}>
                                                    {link.subcategory.map((subcategoryLink: INavLink) => ( // Changed variable name to avoid conflict
                                                        <li key={subcategoryLink.label} className={`leftsidebar-link group ${isActive ? 'bg-primary-500 text-white ' : ''}`}>
                                                            <div className="links">
                                                                <NavLink className="flex gap-4 items-center p-4" to={subcategoryLink.route}>
                                                                    <img src={subcategoryLink.imgURL} alt={subcategoryLink.label} className={`group-hover:invert-white ${isActive ? 'invert-white' : ''}`} />{subcategoryLink.label}
                                                                </NavLink>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ) : (
                                            <li className={`left-sidebar-link border-y hover:bg-gray-100 ${isActive ? 'bg-secondary-gray' : ''}`}>
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

                            <button type="button" className="flex items-center w-full" aria-controls={`websites-dropdown`} data-collapse-toggle={`websites-dropdown`} onClick={() => toggleDropdown('websites')}>
                                <img src={'/assets/icons/websites.svg'} alt={'websites'} className='pl-6 pr-1' />
                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap my-[22px]">{'Websites'}</span>
                                <img src="/assets/icons/down-arrow.svg" className={`websites-dropdown-arrow mr-5`} alt="" />
                            </button>
                            {/* Dropdown menu for "Websites" */}
                            <ul id={`websites-dropdown`} className={`${dropdownVisibility['websites'] ? 'block' : 'hidden'}`}>

                                {Object.entries(domainSidebarLinks.websites || {}).map(([submenuKey, submenuItems]) => (
                                    <React.Fragment key={submenuKey}>
                                        {/* Button to toggle submenu dropdown */}

                                        <li className="left-sidebar-link border-b bg-secondary-gray hover:bg-gray-100 ">
                                            <button type="button" className="flex items-center w-full" aria-controls={`${submenuKey}-dropdown`} data-collapse-toggle={`${submenuKey}-dropdown`} onClick={() => toggleActiveSubmenu(submenuKey)}>
                                                {/* @ts-ignore */}
                                                <img src={websites[submenuKey]} alt={submenuKey} className='pl-6 pr-1' />
                                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap my-[22px]">{formatString(submenuKey)}</span>
                                                <img src="/assets/icons/down-arrow.svg" className={`${submenuKey}-dropdown-arrow me-14`} alt="" />
                                            </button>

                                        </li>
                                        {/* Submenu dropdown */}
                                        <ul id={`${submenuKey}-dropdown`} className={` ${activeSubmenu === submenuKey ? 'block' : 'hidden'}`}>
                                            {/* Render submenu items */}
                                            {submenuItems.map((link: INavLink) => {
                                                const isWebActive = new RegExp(`\\b${submenuKey}${link.route}\\b`).test(pathname);
                                                // Assuming pathname is defined somewhere
                                                return (
                                                    <React.Fragment key={link.label}>
                                                        {link.category ? (
                                                            <li className="left-sidebar-web-link hover:bg-gray-100 ">
                                                                <button type="button" className="flex items-center w-full  links pl-0" aria-controls={`${link.label}-dropdown`} data-collapse-toggle={`${link.label}-dropdown`} onClick={() => toggleDropdown(link.label)}>
                                                                    <img src={link.imgURL} alt={link.label} className='pl-6 pr-1' />
                                                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap gap-4 ">{formatString(link.label)}</span>
                                                                    <img src="/assets/icons/down-arrow.svg" className="dropdown-arrow mr-5" alt="" />
                                                                </button>

                                                                <ul id={`${link?.label}-dropdown`} className={` ${dropdownVisibility[link?.label || ''] ? 'block' : 'hidden'}`}>
                                                                    <li className={`left-sidebar-web-link ${isWebActive ? 'bg-primary-500 text-white ' : ''}`}>
                                                                        <div className="links">
                                                                            <NavLink className="flex items-center" to={`${submenuKey}${link?.route}`}>
                                                                                <img src={link?.imgURL} alt={link?.label} className={`group-hover:invert-white pl-6 pr-1 ${isWebActive ? 'invert-white' : ''}`} />{link.label}
                                                                            </NavLink>
                                                                        </div>
                                                                    </li>
                                                                    <li className={`left-sidebar-web-link ${isWebActive ? 'bg-primary-500 text-white ' : ''}`}>
                                                                        <div className="links">
                                                                            <NavLink className="flex items-center " to={`${submenuKey}/category${link?.route}`}>
                                                                                <img src={link?.imgURL} alt={link?.label} className={`group-hover:invert-primary-500 pl-6 pr-1 ${isWebActive ? 'invert-white' : ''}`} />Manage category
                                                                            </NavLink>
                                                                        </div>
                                                                    </li>

                                                                </ul>
                                                            </li>
                                                        ) : (
                                                            <li key={link.label} className={`left-sidebar-web-link ${isWebActive ? 'bg-light-blue text-primary-500 border-b-primary-500' : ''}`}>
                                                                <div className="links">
                                                                    <NavLink className="flex gap-4 items-center" to={`${submenuKey}${link.route}`}>
                                                                        <img src={link.imgURL} alt={link.label} className="group-hover:invert-primary-500 text-primary-500" />
                                                                        {link.label}
                                                                    </NavLink>
                                                                </div>
                                                            </li>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </ul>

                                    </React.Fragment>
                                ))}
                            </ul>


                        </ul>
                        <div className="user_profile_actions bottom-0 mt-14">
                            <Link to={`/profile/${user.id}`} className="flex gap-3">
                                <img alt="profile" src={'/assets/icons/profile.svg'} width={50} height={50} className="h-14 w-14 rounded-full" />
                                <div className="flex flex-col">
                                    <p className="body-bold">
                                        {user?.firstName + ' ' + user?.lastName}
                                    </p>
                                    <p className="small-regular text-light-3">
                                        @{user.username}
                                    </p>
                                </div>

                            </Link>
                            <NavLink key='settings' className={`flex gap-4 items-center p-4 text-primary-500`} to={'/settings'}>
                                <Settings className="shad-button_ghost" />Settings
                            </NavLink>
                            <Button variant="ghost" className="shad-button_ghost" onClick={() => signOut()}>
                                <img src="/assets/icons/logout.svg" />
                                <p className="small-medium lg:base-medium" >Logout</p>
                            </Button>
                        </div>
                    </div>

                </aside>
            </div>

        </div>
    );
};

export default LeftSidebar;
