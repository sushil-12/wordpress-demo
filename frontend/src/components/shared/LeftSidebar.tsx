import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { domainSidebarLinks, logos, websites } from "@/constants";
import { INavLink } from "@/lib/types";
import { MenuIcon, Settings } from "lucide-react";
import { useUserContext } from "@/context/AuthProvider";
import * as React from "react";
import { createSlug, formatString } from "@/lib/utils";
import SvgComponent from "@/utils/SvgComponent";

interface DropdownVisibilityState {
    [key: string]: boolean;
}

const LeftSidebar = () => {
    const { mutate: signOut, isSuccess } = useSignOutAccount();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, currentDomain, rerender } = useUserContext();
    const [renderSidebar, rerenderSideBar] = useState(rerender);
    const logoPath: string | undefined = logos[currentDomain as keyof typeof logos];

    const [dropdownVisibility, setDropdownVisibility] = useState<DropdownVisibilityState>({});
    const [activeSubmenu, setActiveSubmenu] = useState('');

    const toggleActiveSubmenu = (submenuKey: string) => {
        setActiveSubmenu(submenuKey);
        const dropdownArrows = document.getElementsByClassName(`${createSlug(submenuKey)}-dropdown-arrow`);
        for (let i = 0; i < dropdownArrows.length; i++) {
            dropdownArrows[i].classList.toggle('rotated');
        }
    };

    const toggleDropdown = (label: any) => {
       
        console.log("sdsd")
        Object.keys(dropdownVisibility).forEach((dropdownLabel) => {
            if (dropdownLabel !== label && dropdownVisibility[dropdownLabel]) {
                closeDropdown(dropdownLabel);
            }
        });
        setDropdownVisibility((prevVisibility) => ({
            ...prevVisibility,
            [label]: !prevVisibility[label],
        }));
      
        const dropdownArrow = document.getElementsByClassName(`${createSlug(label)}-dropdown-arrow`)[0];
        if (dropdownArrow) {
            dropdownArrow.classList.toggle('rotated');
        }
    };
    const closeDropdown = (label: any) => {
        setDropdownVisibility((prevVisibility) => ({
            ...prevVisibility,
            [label]: false,
        }));
    };


    useEffect(() => {
        if (isSuccess) {
            navigate(0);
        }
        console.log(rerender, "TEST REE")
        const websiteKeys = Object.keys(websites);
        let matchedKey = null;
        websiteKeys.some(key => {
            if (pathname.includes(key)) {
                matchedKey = key;
                return true; // Stop iteration
            }
        });
        if (matchedKey != null) { setActiveSubmenu(matchedKey) }

    }, [isSuccess, rerender, renderSidebar]);

    return (
        <div className="leftsidebar overflow-hidden">
            <div className="flex flex-col">
                <button data-drawer-target="sidebar-multi-level-sidebar" data-drawer-toggle="sidebar-multi-level-sidebar" aria-controls="sidebar-multi-level-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                    <span className="sr-only">Open sidebar</span>
                    <MenuIcon />
                </button>
                <aside id="sidebar-multi-level-sidebar" className="fixed border-r h-full  top-0 left-0 z-40 w-64 transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                    <div className="cu-simple-bar-resizer-handle ng-tns-c2398600540-13"></div>
                    <div className="h-[10%] flex gap-3 items-center justify-center px-16">
                        <Link to="/" className="m-0">
                            <img src={logoPath || '/assets/images/logo-dashboard.svg'} alt="Logo" width={108} height={34} />
                        </Link>
                    </div>
                    <div className=" bg-light-1 dark:bg-gray-800  min-h-[80%] max-h-[80%] overflow-y-auto overflow-x-hidden">

                        <ul className="scroll-m-6 ">

                            {/* @ts-ignore */}
                            {domainSidebarLinks.comman?.map((link: INavLink) => {
                                const regex = new RegExp(`^${link.route}(\/.*)?$`);
                                const isActive = regex.test(pathname);

                                return (
                                    <React.Fragment key={link.label}>
                                        {link?.subcategory ? (
                                            <li className="left-sidebar-link border-b">
                                                <button type="button" className="flex items-center  pl-6 w-full" aria-controls={`${link?.label}-dropdown`} data-collapse-toggle={`${link?.label}-dropdown`} onClick={() => toggleDropdown(link.label || '')}>
                                                    {/* <img src={link?.imgURL} alt={link?.label} className='pl-6 pr-1' /> */}
                                                    <div className="flex items-center gap-[8px]">
                                                        <SvgComponent className=" leftsidebar_icon" svgName={link.imgURL || 'briefcase'} />
                                                        <span className="flex-1 text-left rtl:text-right whitespace-nowrap text-ellipsis overflow-hidden max-w-[150px] min-w-[150px] ">{link?.label}</span>
                                                    </div>

                                                    <img src="/assets/icons/down-arrow.svg" className={`${createSlug(link?.label)}-dropdown-arrow absolute right-5 `} alt="" />
                                                </button>
                                                <ul id={`${link?.label}-dropdown`} className={`py-2 space-y-2 ${dropdownVisibility[link?.label || ''] ? 'block' : 'hidden'}`}>
                                                    {link.subcategory.map((subcategoryLink: INavLink) => ( // Changed variable name to avoid conflict
                                                        <li key={subcategoryLink.label} className={`leftsidebar-link group ${isActive ? 'bg-primary-500 text-white ' : ''}`}>
                                                            <div className="links">
                                                                <NavLink className="flex gap-4 items-center p-4" to={subcategoryLink.route}>
                                                                    <SvgComponent className=" leftsidebar_icons group-hover:invert-white " svgName={subcategoryLink.imgURL || 'briefcase'} />
                                                                    {subcategoryLink.label}
                                                                </NavLink>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ) : (
                                            <li className={`left-sidebar-link border-b hover:bg-gray-100 ${isActive ? 'bg-secondary-gray' : ''}`}>
                                                <div className="link-container" >
                                                    <NavLink className="flex items-center rounded-lg dark:text-main-bg pl-6 dark:hover:bg-gray-700 group" to={link?.type == 'custom_post' ? `/posts/${link?.route}` : link?.route}>
                                                        {/* <img src={link?.imgURL} alt={link?.label} className={`pl-6 pr-1`} /> */}
                                                        <div className="flex gap-[8px] items-center ">
                                                            <SvgComponent className=" leftsidebar_icons" svgName={link.imgURL || 'briefcase'} />
                                                            <span className="">{link.label}</span>
                                                        </div>

                                                    </NavLink>
                                                </div>
                                            </li>
                                        )}
                                    </React.Fragment>
                                );
                            })}

                            <button type="button" className=" left-sidebar-link flex items-center pl-6 w-full" aria-controls={`websites-dropdown`} data-collapse-toggle={`websites-dropdown`} onClick={() => toggleDropdown('websites')}>
                                <div className="flex items-center gap-[8px]">
                                    <SvgComponent className="" svgName="websites" />
                                    <span className="flex-1  text-left rtl:text-right whitespace-nowrap text-ellipsis overflow-hidden max-w-[150px]  ">{'Websites'}</span>
                                </div>
                                <img src="/assets/icons/down-arrow.svg" className={`websites-dropdown-arrow ${activeSubmenu != '' && 'rotated'} absolute right-5`} alt="" />
                            </button>
                            {/* Dropdown menu for "Websites" */}
                            <ul id={`websites-dropdown`} className={`${dropdownVisibility['websites'] || activeSubmenu != '' ? 'block' : 'hidden'}`}>

                                {Object.entries(domainSidebarLinks.websites || {}).map(([submenuKey, submenuItems]) => (
                                    <React.Fragment key={submenuKey}>
                                        {/* Button to toggle submenu dropdown */}

                                        <li className="left-sidebar-link border-b bg-secondary-gray hover:bg-gray-100 ">
                                            <button type="button" className="flex items-center justify-between w-full" aria-controls={`${submenuKey}-dropdown`} data-collapse-toggle={`${submenuKey}-dropdown`} onClick={() => toggleActiveSubmenu(submenuKey)}>
                                                {/* @ts-ignore */}
                                                <SvgComponent className=" leftsidebar_icons pl-6 pr-1" svgName={submenuKey || 'briefcase'} />
                                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap text-ellipsis overflow-hidden max-w-[150px] ">{formatString(submenuKey)}</span>
                                                <img src="/assets/icons/down-arrow.svg" className={`${createSlug(submenuKey)}-dropdown-arrow me-14`} alt="" />
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
                                                                <button type="button" className=" left-sidebar-web-link flex items-center w-full  links pl-0" aria-controls={`${link.label}-dropdown`} data-collapse-toggle={`${link.label}-dropdown`} onClick={() => toggleDropdown(link.label)}>
                                                                    <div className="flex gap-[6px]">
                                                                        <SvgComponent className=" leftsidebar_icons_website group-hover:invert-white pl-6 pr-1" svgName={link.imgURL || 'briefcase'} />
                                                                        <span className="flex-1 text-left rtl:text-right whitespace-nowrap text-ellipsis overflow-hidden max-w-[150px] ">{formatString(link.label)}</span>
                                                                    </div>

                                                                    <img src="/assets/icons/down-arrow.svg" className={`dropdown-arrow mr-5 `} alt="" />
                                                                </button>

                                                                <ul id={`${link?.label}-dropdown`} className={` ${dropdownVisibility[link?.label || ''] ? 'block pl-4' : 'hidden'}`}>
                                                                    <li className={`left-sidebar-web-link ${isWebActive ? 'bg-primary-500 text-white ' : ''}`}>
                                                                        <div className="links">
                                                                            <NavLink className="flex items-center" to={`${submenuKey}${link?.route}`}>
                                                                                <div className="flex gap-[6px]">
                                                                                    <SvgComponent className=" leftsidebar_icons_website" svgName={link.imgURL || 'briefcase'} />
                                                                                    {/* <img src={link?.imgURL} alt={link?.label} className={`group-hover:invert-white pl-6 pr-1 ${isWebActive ? 'invert-white' : ''}`} /> */}
                                                                                    <span className="whitespace-nowrap text-ellipsis overflow-hidden max-w-[150px]" title={link?.label}>{link.label}</span>
                                                                                </div>
                                                                            </NavLink>
                                                                        </div>
                                                                    </li>
                                                                    <li className={`left-sidebar-web-link ${isWebActive ? 'bg-primary-500 text-white ' : ''}`}>
                                                                        <div className="links">
                                                                            <NavLink className="flex items-center " to={`${submenuKey}/category${link?.route}`}>
                                                                                {/* <img src={link?.imgURL} alt={link?.label} className={`group-hover:invert-primary-500 pl-6 pr-1 ${isWebActive ? 'invert-white' : ''}`} /> */}
                                                                                <div className="flex gap-[6px]">
                                                                                    <SvgComponent className=" leftsidebar_icons_website" svgName={link.imgURL || 'briefcase'} />
                                                                                    <span>Manage category</span>
                                                                                </div>

                                                                            </NavLink>
                                                                        </div>
                                                                    </li>

                                                                </ul>
                                                            </li>
                                                        ) : (
                                                            <li key={link.label} className={`left-sidebar-web-link ${isWebActive ? 'bg-light-blue text-primary-500 border-b-primary-500' : ''}`}>
                                                                <div className="links">
                                                                    <NavLink className="flex gap-4 items-center" to={`${submenuKey}${link.route}`}>
                                                                        <div className="flex gap-[6px]">
                                                                            <SvgComponent className=" leftsidebar_icons_website group-hover:invert-primary-500 text-primary-500" svgName={link.imgURL || 'briefcase'} />
                                                                            <span>{link.label}</span>
                                                                        </div>
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
                    </div>
                    <div className=" min-h-[10%] h-[100%] max-h-[10%] w-full absolute bottom-0">
                        <NavLink to={`/profile/${user.id}`} className={(navData) => (navData.isActive ? 'flex m-0 gap-[15px] bg-gray-100 items-center h-full' : 'flex m-0 gap-[15px] items-center h-full')} >
                            <div className="img_container pl-6">
                                <img alt="profile" src={user?.profile_pic || '/assets/icons/profile.svg'} className="rounded-full w-full self-center " />
                            </div>
                            <div className="flex flex-col">
                                <p className="body-bold">
                                    {user?.firstName}
                                </p>
                                <p className="text-xs underline font-normal">
                                    My Profile
                                </p>
                            </div>
                            <Button variant="ghost" title="Logout" className="shad-button_ghost" onClick={() => signOut()}>
                                <img src="/assets/icons/logout.svg" className={`${renderSidebar}`} />
                            </Button>
                        </NavLink>

                        {/* <NavLink key='settings' className={`flex gap-4 items-center p-4 text-primary-500`} to={'/settings'}>
                                <Settings className="shad-button_ghost" />Settings
                            </NavLink>
                            <Button variant="ghost" className="shad-button_ghost" onClick={() => signOut()}>
                                <img src="/assets/icons/logout.svg" />
                                <p className="small-medium lg:base-medium" >Logout</p>
                            </Button> */}
                    </div>

                </aside>
            </div>

        </div>
    );
};

export default LeftSidebar;
