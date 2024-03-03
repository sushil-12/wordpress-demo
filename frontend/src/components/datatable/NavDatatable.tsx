import {  Edit3Icon, PlusSquare } from 'lucide-react';
import { useState } from 'react';
import { TabPanel, TabView } from 'primereact/tabview';
import * as React from 'react';
import { INavLink } from '@/lib/types';
import { formatString } from '@/lib/utils';
import { Accordion, AccordionTab } from 'primereact/accordion';
import NavItemForm from '@/settings/NavItemForm';
import SvgComponent from '@/utils/SvgComponent';

interface NavDatatableprops {
    navItems: any;
    setSelectedItem: any;
    render: boolean;
}

const NavDatatable: React.FC<NavDatatableprops> = ({ navItems }) => {
    console.log(navItems)
    const [selectedItem, setSelectedItem] = useState(null);
    const [render, setRerender] = useState(true);

    return (
        <div className="card">
            <TabView>
                <TabPanel header="Common" >
                    <div className="h-full overflow-y-auto bg-light-1 dark:bg-gray-800 flex gap-4">
                        <ol className="overflow-y-auto w-3/4">
                            {navItems.comman?.map((link: INavLink) => {
                                const isActive = false;
                                return (
                                    <React.Fragment key={link.label}>
                                        {link?.subcategory ? (
                                            <li className="left-sidebar-link border-b bg-secondary-gray hover:bg-gray-100 border-y-2">
                                                <button type="button" className="flex items-center rounded-lg dark:text-main-bg  dark:hover:bg-gray-700 w-full pe-5">
                                                    <SvgComponent svgName={link?.imgURL} className='pl-6 pr-1' />
                                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap my-[22px]">{link?.label}</span>
                                                    <Edit3Icon className='cursor-pointer' onClick={() => setSelectedItem(link)} />
                                                </button>
                                                <ul id={`${link?.label}-dropdown`} className={`block bg-white pl-10`}>
                                                    {link.subcategory.map((subcategoryLink: INavLink) => ( // Changed variable name to avoid conflict
                                                        <li key={subcategoryLink.label} className={``}>
                                                            <div className="links">
                                                                <div className="flex gap-4 items-center p-4" >
                                                                    <SvgComponent svgName={link?.imgURL} className='group-hover:invert-white pl-6 pr-1' />
                                                                    {subcategoryLink.label}
                                                                </div>

                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ) : (
                                            <li className={`left-sidebar-link border-b bg-secondary-gray hover:bg-gray-100  border-y-2`}>
                                                <div className="link-container flex items-center justify-between me-5 " >
                                                    <div className="flex items-center rounded-lg dark:text-main-bg  dark:hover:bg-gray-700 group">
                                                        <SvgComponent svgName={link?.imgURL} className='pl-6 pr-1' />
                                                        <span className="ms-3  my-[22px]">{link.label}</span>
                                                    </div>
                                                    <Edit3Icon className='cursor-pointer' onClick={() => setSelectedItem(link)} />
                                                </div>
                                            </li>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </ol>
                        <div className="w-1/2">
                            <NavItemForm item={selectedItem} setRerender={setRerender} activeTab="comman" />
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Websites">
                    <div className="card flex gap-4  ">
                        <Accordion activeIndex={0} className='w-1/2'>
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
                                                                <button type="button" className="flex items-center w-full" >
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
                                                            <li key={link.label} className={`leftsidebar-link`}>
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
                        <div className="w-1/2">
                            <NavItemForm item={selectedItem} setRerender={setRerender} activeTab="website" />
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </div>
    )
};

export default NavDatatable;
