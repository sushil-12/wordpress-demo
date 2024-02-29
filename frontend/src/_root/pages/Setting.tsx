import NavDatatable from "@/components/datatable/NavDatatable";
import { useUserContext } from "@/context/AuthProvider";
import { useGetAllNavItems } from "@/lib/react-query/queriesAndMutations";
import NavItemForm from "@/settings/NavItemForm";
import { Settings } from "lucide-react";
import { Menubar } from 'primereact/menubar';
import { TabMenu } from 'primereact/tabmenu';
import { useEffect, useState } from "react";
import { domainSidebarLinks, logos, websites } from "@/constants";


const Setting = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [navItems, setNavItems] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [render, setRerender] = useState(true);
  const {setRerender : setAppRender, rerender} = useUserContext();
  const items = [
    { label: 'Sidebar', icon: 'pi pi-book' },
    // { label: 'Test One', icon: 'pi pi-chart-line' },
    // { label: 'Test Two', icon: 'pi pi-list' },
    // { label: 'Test Three', icon: 'pi pi-inbox' }
  ];

  async function getNavItems(){
    setNavItems(domainSidebarLinks);
  } 
  useEffect(() => {
    getNavItems();
    setAppRender((prev:boolean)=> !prev);
    console.log(rerender)
   }, [render])
  return (
    <div className="main-container w-full overflow-hidden ">
       <div className="px-4 py-5 flex justify-between h-[10vh] min-h-[10vh] max-h-[10vh">
        <h3 className="page-titles">Settings</h3>
      </div>
      <div className="h-[90vh] min-h-[90vh] max-h-[90vh] overflow-y-auto px-5 ">
        <Menubar model={items} className="p-0 border-none page-innersubtitles text-bold"/>
        <div className="p-4 page-innersubtitles">
          <div className="flex  border-primary-500 gap-8" >
            <div className="items w-3/4">
              <NavDatatable navItems = {navItems} setSelectedItem={setSelectedItem} render={render}/>
            </div>
            <div className="form w-1/2">
              <NavItemForm item={selectedItem} setRerender={setRerender}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
