import { Edit2, PlusSquare } from 'lucide-react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Skeleton } from 'primereact/skeleton';
import { Tag } from 'primereact/tag';
import { Button } from '../ui/button';
import { useQuickEditNavItemsbyIDApi } from '@/lib/react-query/queriesAndMutations';
import { useState } from 'react';
import { TabPanel, TabView } from 'primereact/tabview';
import { Link, NavLink } from 'react-router-dom';
import * as React from 'react';
import { INavLink } from '@/lib/types';
import { formatString } from '@/lib/utils';
import { websites } from '@/constants';
import { Accordion, AccordionTab } from 'primereact/accordion';

interface NavDatatableprops {
    navItems: any;
    setSelectedItem: any;
    render: boolean;
}

const NavDatatable: React.FC<NavDatatableprops> = ({ navItems, setSelectedItem, render }) => {
    console.log(navItems)

    return (
        <div className="card">
            <TabView>
                <TabPanel header="Common">
                    <div className="h-full overflow-y-auto bg-light-1 dark:bg-gray-800">
                        <ol className="overflow-y-auto">
                            {navItems.comman?.map((link: INavLink) => {
                                const isActive = false;
                                return (
                                    <React.Fragment key={link.label}>
                                        {link?.subcategory ? (
                                            <li className="left-sidebar-link border-b bg-secondary-gray hover:bg-gray-100 border-y-2">
                                                <button type="button" className="flex items-center rounded-lg dark:text-main-bg  dark:hover:bg-gray-700 w-full" aria-controls={`${link?.label}-dropdown`} data-collapse-toggle={`${link?.label}-dropdown`} >
                                                    <img src={link?.imgURL} alt={link?.label} className='pl-6 pr-1' />
                                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap my-[22px]">{link?.label}</span>
                                                    <img src="/assets/icons/down-arrow.svg" className={`${link?.label}-dropdown-arrow mr-5`} alt="" />
                                                </button>
                                                <ul id={`${link?.label}-dropdown`} className={`block bg-white`}>
                                                    {link.subcategory.map((subcategoryLink: INavLink) => ( // Changed variable name to avoid conflict
                                                        <li key={subcategoryLink.label} className={`leftsidebar-link`}>
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
                                            <li className={`left-sidebar-link border-b bg-secondary-gray hover:bg-gray-100  border-y-2`}>
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
                        </ol>
                    </div>
                </TabPanel>
                <TabPanel header="Websites">
                    <div className="card">
                        <Accordion activeIndex={0}>
                            {
                                Object.entries(navItems.websites || {}).map(([submenuKey, submenuItems]) => (
                                    <AccordionTab header={formatString(submenuKey)} key={submenuKey}>
                                        <ul id={`-dropdown`} className='block'>
                                            {/* @ts-ignore */}
                                            {submenuItems.map((link: INavLink) => {
                                                const isWebActive = false; // Assuming pathname is defined somewhere
                                                return (
                                                    <React.Fragment key={link.label}>
                                                        {link.subcategory ? (
                                                            <li className="left-sidebar-web-link hover:bg-gray-100 ">
                                                                <button type="button" className="flex items-center w-full" aria-controls={`${link.label}-dropdown`} data-collapse-toggle={`${link.label}-dropdown`} >
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
                                                                    <div className="flex gap-4 items-center p-4" >
                                                                        <img src={link.imgURL} alt={link.label} className="group-hover:invert-primary-500" />
                                                                        {link.label}
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </ul>
                                    </AccordionTab>
                                ))
                            }
                        </Accordion>
                    </div>
                </TabPanel>
            </TabView>
        </div>
    )
};

export default NavDatatable;
