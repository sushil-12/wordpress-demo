import NavDatatable from "@/components/datatable/NavDatatable";
import { useUserContext } from "@/context/AuthProvider";
import { useGetAllNavItems } from "@/lib/react-query/queriesAndMutations";
import NavItemForm from "@/settings/NavItemForm";
import { Settings } from "lucide-react";
import { Card } from "primereact/card";
import { TabMenu } from 'primereact/tabmenu';
import { useEffect, useState } from "react";
import { domainSidebarLinks, logos, websites } from "@/constants";


const Setting = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [navItems, setNavItems] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [render, setRerender] = useState(true);
  const {setRerender : setAppRender, rerender} = useUserContext();
  const { mutateAsync: getAllNavItems, isPending: isLoading } = useGetAllNavItems();
  const items = [
    { label: 'Sidebar Items', icon: 'pi pi-home' },
    { label: 'Test One', icon: 'pi pi-chart-line' },
    { label: 'Test Two', icon: 'pi pi-list' },
    { label: 'Test Three', icon: 'pi pi-inbox' }
  ];

  async function getNavItems(){
    const navItems = await getAllNavItems();
    setNavItems(domainSidebarLinks);
  } 
  useEffect(() => {
    getNavItems();
    setAppRender((prev:boolean)=> !prev);
    console.log(rerender)
   }, [render])
  return (
    <div className="common-container">
      <div className="border-b border-gray-200 bg-white px-4 py-2 sm:px-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900 flex gap-3">
          <Settings />Settings
        </h3>
      </div>
      <div className="card gap-8">
        <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} className="border-4 border-primary-500" />
        <Card className="p-4">
          <div className="flex card  border-primary-500 gap-8" >
            <div className="items w-1/2">
              <NavDatatable navItems = {navItems} setSelectedItem={setSelectedItem} render={render}/>
            </div>
            <div className="form w-1/2">
              <NavItemForm item={selectedItem} setRerender={setRerender}/>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Setting;
