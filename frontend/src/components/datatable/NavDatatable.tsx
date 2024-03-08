import { Edit3Icon, PlusSquare } from 'lucide-react';
import { useState } from 'react';
import { TabPanel, TabView } from 'primereact/tabview';
import * as React from 'react';
import { INavLink } from '@/lib/types';
import { createSlug, formatString } from '@/lib/utils';
import { Accordion, AccordionTab } from 'primereact/accordion';
import NavItemForm from '@/settings/NavItemForm';
import SvgComponent from '@/utils/SvgComponent';
import { domainSidebarLinks } from '@/constants';
import { saveDatatoSidebar } from '@/lib/appwrite/api';
import { useToast } from '../ui/use-toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

interface NavDatatableprops {
    navItems: any;
    setSelectedItem: any;
    render: boolean;
}

const NavDatatable: React.FC<NavDatatableprops> = ({ navItems }) => {

    const [selectedItem, setSelectedItem] = useState(null);
    const [render, setRerender] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeDomain, setActiveDomain] = useState('the_logician');
    const websitekeys = navItems.websites && Object.keys(navItems.websites);
    const { toast } = useToast();

    const reject = () => {
        return toast({ variant: "destructive", description: "You have cancelled the operations" })
    }
    React.useEffect(()=>{console.log(render)},[render]);
    const confirmDelete= (itemId, type, submenuKey='') =>{
        confirmDialog({
            message: 'Are you sure you want to delete?',
            header: 'Delete Confirmation',
            acceptClassName: 'pl-4 outline-none p-2 text-sm',
            rejectClassName: 'pl-4 outline-none p-2 text-sm text-white',
            className: 'border bg-light-1 shadow-lg p-0',
            accept: () => handleDelete(itemId, type, submenuKey),
            reject: reject,
            draggable: false,
        });
    }


    async function handleDelete(itemId, type, submenuKey = '') {
        if (type === "comman") {
            let currentCommonSchema = domainSidebarLinks.comman;
            let updatedCommonSchema = currentCommonSchema.filter(item => item.id !== itemId)
            domainSidebarLinks.comman = updatedCommonSchema
            console.log(updatedCommonSchema)
        }
        else if (type === "websites") {
            let currentWebsiteSchema = domainSidebarLinks.websites;
            Object.keys(currentWebsiteSchema).forEach(key => {
                let website = currentWebsiteSchema[key];
                if (Array.isArray(website)) {
                    let updatedItems = website.filter(item => item.id !== itemId);
                    website = currentWebsiteSchema[key] = updatedItems;
                }
            });
            // let updatedWebsiteSchema = currentWebsiteSchema.filter(item => item.id !== itemId)
            domainSidebarLinks.websites = currentWebsiteSchema

        }
        const createOrEditNavItemResponse = await saveDatatoSidebar(domainSidebarLinks);

        if (createOrEditNavItemResponse?.code === 200 || createOrEditNavItemResponse?.code === 201) {
            const message = createOrEditNavItemResponse?.code === 200 ? 'Successfully deleted' : 'Successfully deleted';
            setSelectedItem(null);
            return toast({ variant: 'default', description: message });
        } else {
            return toast({ variant: 'default', description: 'Something went wrong' });
        }

    };

    return (
        <div className="card">
             <ConfirmDialog />
            <TabView>
                <TabPanel header="Common" >
                    <div className="h-full overflow-y-auto bg-light-1 dark:bg-gray-800 flex gap-4">
                        <ol className="overflow-y-auto w-3/4">
                            {navItems.comman?.map((link: INavLink) => {
                                const isActive = false;
                                return (
                                    <React.Fragment key={link.label}>
                                        {link?.subcategory ? (
                                            <li key={link.label} className="left-sidebar-links flex-col  border-2 border-dashed mb-4 me-4 pe-4">
                                                <button type="button" className="flex items-center rounded-lg dark:text-main-bg  dark:hover:bg-gray-700 w-full ">
                                                    <SvgComponent svgName={link?.imgURL} className='pl-6 pr-1' />
                                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap my-[22px]">{link?.label}</span>
                                                    <div className="flex gap-4 items-center">
                                                        <Edit3Icon className='cursor-pointer h-4' onClick={() => {setSelectedItem(link); console.log("CLicked", selectedItem, setSelectedItem); }} />
                                                        <button onClick={() => { confirmDelete(link?.id, "comman") }}><SvgComponent className='' svgName='delete' /></button>
                                                    </div>

                                                </button>
                                                <ul id={`${link?.label}-dropdown`} className={` flex items-center rounded-lg dark:text-main-bg  dark:hover:bg-gray-900 w-full pe-5 py-2  hover:bg-gray-100`}>

                                                    {link.subcategory.map((subcategoryLink: INavLink, index: Number) => ( // Changed variable name to avoid conflict
                                                        <li key={subcategoryLink.label} className="list-disc w-full">
                                                            <div className="links flex justify-between w-full">
                                                                <div className="flex gap-4 items-center  pl-14 pr-1 " >

                                                                    <SvgComponent svgName={link?.imgURL} className='group-hover:invert-white ' />
                                                                    {subcategoryLink.label}
                                                                </div>
                                                                <button onClick={() => { confirmDelete(link?.id, "comman") }}><SvgComponent className='' svgName='delete' /></button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ) : (
                                            <li  key={link.label} className={`left-sidebar-links  border-2 border-dashed  hover:bg-gray-100 mb-4 me-4 pe-4 `}>
                                                <div className="link-container w-full flex items-center justify-between me-5 " >
                                                    <div className="flex items-center rounded-lg dark:text-main-bg  dark:hover:bg-gray-700 group">
                                                        <SvgComponent svgName={link?.imgURL} className='pl-6 pr-1' />
                                                        <span className="ms-3  my-[22px]">{link.label}</span>
                                                    </div>
                                                    <div className="flex gap-4 items-center">
                                                        <Edit3Icon className='cursor-pointer h-4' onClick={() => {setSelectedItem(link); console.log("CLicked"); }} />
                                                        <button onClick={() => { confirmDelete(link?.id, "comman") }}><SvgComponent className='' svgName='delete' /></button>
                                                    </div>

                                                </div>
                                            </li>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </ol>
                        <div className="w-1/2">
                            <NavItemForm item={selectedItem} setRerender={setRerender} setSelectedItem={setSelectedItem} activeTab="comman" />
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Websites">
                    <div className="card flex gap-4  ">
                        <Accordion activeIndex={activeIndex} className='w-1/2' onTabChange={(e) => { setActiveIndex(e.index); setActiveDomain(websitekeys[e.index]) }}>
                            {
                                Object.entries(navItems.websites || {}).map(([submenuKey, submenuItems]) => (
                                    <AccordionTab header={formatString(submenuKey)} key={submenuKey}  >
                                        <ul id={`-dropdown`} className='block'>
                                            {/* @ts-ignore */}
                                            {submenuItems.map((link: INavLink) => {
                                                const isWebActive = false; // Assuming pathname is defined somewhere
                                                return (
                                                    <React.Fragment key={link.label}>
                                                        {link.subcategory ? (
                                                            <li className="left-sidebar-web-link hover:bg-gray-100 ">
                                                                <button type="button" className="flex items-center w-full" >
                                                                    <SvgComponent svgName={link?.imgURL} className='group-hover:invert-white pl-6 pr-1' />
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
                                                                    <div className="flex gap-4 items-center p-4 justify-between " >
                                                                        <div className='flex items-center gap-4'>

                                                                            <SvgComponent svgName={link?.imgURL} className='group-hover:invert-white pl-6 pr-1' />
                                                                            {link.label}
                                                                        </div>
                                                                        <div className="flex gap-4 items-center">
                                                                            <Edit3Icon className='cursor-pointer h-4 ' onClick={() => {setSelectedItem(link); console.log("CLicked"); }} />
                                                                            <button onClick={() => { confirmDelete(link?.id, "comman") }}><SvgComponent className='' svgName='delete' /></button>

                                                                        </div>
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
                            <NavItemForm item={selectedItem} setRerender={setRerender} activeTab="website" activeDomain={activeDomain} setSelectedItem={setSelectedItem} />
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </div>
    )
};

export default NavDatatable;
