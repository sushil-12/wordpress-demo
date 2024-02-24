import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useGetAllDomains, useGetAllNavItems, useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { domainSidebarLinks, logos, websites } from "@/constants";
import { INavLink } from "@/lib/types";
import { MenuIcon, Settings } from "lucide-react";
import { useUserContext } from "@/context/AuthProvider";
import * as React from "react";
import { formatString } from "@/lib/utils";

interface domain {
    name: string;
    link: string;
    title: string;
}
interface DropdownVisibilityState {
    [key: string]: boolean;
}

const LeftSidebar = () => {
    const { mutate: signOut, isSuccess } = useSignOutAccount();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, currentDomain, setCurrentDomain, rerender, setRerender } = useUserContext();
    // const { mutateAsync: getAllDomains, isPending: isDomainLoading } = useGetAllDomains();
    // const [domain, setDomains] = useState<domain[]>([]);
    const logoPath: string | undefined = logos[currentDomain as keyof typeof logos];
    // const [sidebarLinks, setSideBarLinks] = useState<INavLink[]>([]); // Corrected type
    // const [showSubcategories, setShowSubcategories] = useState(false);
    // const [activeDropdown, setActiveDropdown] = useState('');
    // const { mutateAsync: getAllNavItems, isPending: isNavLoading } = useGetAllNavItems();
    const [dropdownVisibility, setDropdownVisibility] = useState<DropdownVisibilityState>({});
    const [activeSubmenu, setActiveSubmenu] = useState('');

    const toggleActiveSubmenu = (submenuKey: string) => {
        setCurrentDomain(submenuKey)
        setActiveSubmenu(submenuKey);
        console.log("activeSubmenu", activeSubmenu, 'cdf', submenuKey)
    };

    // const handleToggleSubcategories = (label: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    //     setActiveDropdown(label)
    //     setShowSubcategories(!showSubcategories);
    // };

    const toggleDropdown = (label: any) => {
        // Use the label to identify the specific dropdown
        setDropdownVisibility((prevVisibility) => ({
            ...prevVisibility,
            [label]: !prevVisibility[label],
        }));
    };

    // const fetchDomains = async () => {
    //     try {
    //         const fetchedDomains = await getAllDomains();
    //         setDomains(fetchedDomains.data);
    //     } catch (error) {
    //         console.error('Error fetching domains:', error);
    //     }
    // };

    // const getNavItems = async () => {
    //     try {
    //         const navItems = await getAllNavItems();
    //         setSideBarLinks(navItems.data.navigationItems);
    //     } catch (error) {
    //         console.error('Error fetching nav items:', error);
    //     }
    // };

    // const handleDomainChange = (value: string) => {
    //     setCurrentDomain(value);
    //     getNavItems();
    //     navigate('/dashboard');
    // };

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
                {/* <select
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
                </select> */}

                {/* <Link to={`/profile/${user.id}`} className="flex gap-3">
                    <img alt="profile" src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMuVZPUguhjwOPqFgeplotL_MmSDTV2Y-dJh72EC8yTQ&s'} width={50} height={50} className="h-14 w-14 rounded-full" />
                    <div className="flex flex-col">
                        <p className="body-bold">
                            {user?.firstName + ' ' + user?.lastName}
                        </p>
                        <p className="small-regular text-light-3">
                            @{user.username}
                        </p>
                    </div>

                </Link> */}
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
                            {domainSidebarLinks.comman?.map((link: INavLink) => {
                                const isActive = pathname.includes(link.route);

                                return (
                                    <React.Fragment key={link.label}>
                                        {link?.subcategory ? (
                                            <li className="left-sidebar-link border-y">
                                                <button type="button" className="flex items-center w-full" aria-controls={`${link?.label}-dropdown`} data-collapse-toggle={`${link?.label}-dropdown`} onClick={() => toggleDropdown(link.label || '')}>
                                                    <img src={link?.imgURL} alt={link?.label} className='pl-6 pr-1' />
                                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap my-[22px]">{link?.label}</span>
                                                    <img src="/assets/icons/down-arrow.svg" className="dropdown-arrow mr-5" alt="" />
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
                                <img src="/assets/icons/down-arrow.svg" className="dropdown-arrow mr-5" alt="" />
                            </button>
                            {/* Dropdown menu for "Websites" */}
                            <ul id={`websites-dropdown`} className={`${dropdownVisibility['websites'] ? 'block' : 'hidden'}`}>

                                {Object.entries(domainSidebarLinks.websites || {}).map(([submenuKey, submenuItems]) => (
                                    <React.Fragment key={submenuKey}>
                                        {/* Button to toggle submenu dropdown */}

                                        <li className="left-sidebar-link border-b bg-secondary-gray hover:bg-gray-100 ">
                                            <button type="button" className="flex items-center w-full" aria-controls={`${submenuKey}-dropdown`} data-collapse-toggle={`${submenuKey}-dropdown`} onClick={() => toggleActiveSubmenu(submenuKey)}>
                                                <img src={websites[submenuKey]} alt={submenuKey} className='pl-6 pr-1' />
                                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap my-[22px]">{formatString(submenuKey)}</span>
                                                <img src="/assets/icons/down-arrow.svg" className="dropdown-arrow me-14" alt="" />
                                            </button>

                                        </li>
                                        {/* Submenu dropdown */}
                                        <ul id={`${submenuKey}-dropdown`} className={` ${activeSubmenu === submenuKey ? 'block' : 'hidden'}`}>
                                            {/* Render submenu items */}
                                            {submenuItems.map((link: INavLink) => {
                                                const isWebActive = pathname.includes(link.route); // Assuming pathname is defined somewhere
                                                return (
                                                    <React.Fragment key={link.label}>
                                                        {link.subcategory ? (
                                                            <li className="left-sidebar-web-link hover:bg-gray-100 ">
                                                                <button type="button" className="flex items-center w-full" aria-controls={`${link.label}-dropdown`} data-collapse-toggle={`${link.label}-dropdown`} onClick={() => toggleDropdown(link.label)}>
                                                                    <img src={link.imgURL} alt={link.label} className='pl-6 pr-1' />
                                                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap my-[22px]">{formatString(link.label)}</span>
                                                                    {/* <img src="/assets/icons/down-arrow.svg" className="dropdown-arrow mr-5" alt="" /> */}
                                                                </button>

                                                                {/* <ul id={`${link.label}-dropdown`} className={`${dropdownVisibility[link.label] ? 'block' : 'hidden'}`}>
                                                                    {link.subcategory?.map((subcategoryLink: INavLink) => (
                                                                        <li key={subcategoryLink.label} className="leftsidebar-link group">
                                                                            <div className="links">
                                                                                <NavLink className="flex gap-4 items-center p-4" to={subcategoryLink.route}>
                                                                                    <img src={subcategoryLink.imgURL} alt={subcategoryLink.label} className="group-hover:invert-white" />
                                                                                    {subcategoryLink.label}
                                                                                </NavLink>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul> */}
                                                            </li>
                                                        ) : (
                                                            <li key={link.label} className={`leftsidebar-link ${isWebActive ? 'bg-light-blue text-primary-500' : ''}`}>
                                                                <div className="links">
                                                                    <NavLink className="flex gap-4 items-center p-4" to={`${link.route}`}>
                                                                        <img src={link.imgURL} alt={link.label} className="group-hover:invert-primary-500" />
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
                {/* <ul className="flex flex-col gap-6">
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
                </ul> */}
            </div>

        </div>
    );
};

export default LeftSidebar;
