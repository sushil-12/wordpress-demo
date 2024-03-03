import NavDatatable from "@/components/datatable/NavDatatable";
import { useUserContext } from "@/context/AuthProvider";
import { useGetAllNavItems } from "@/lib/react-query/queriesAndMutations";
import NavItemForm from "@/settings/NavItemForm";
import { Settings } from "lucide-react";
import { Menubar } from 'primereact/menubar';
import { TabMenu } from 'primereact/tabmenu';
import { useEffect, useState } from "react";
import { domainSidebarLinks, logos, websites } from "@/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadSvgForm from "@/settings/UploadSvgForm";
import SvgGrid from "@/components/shared/SvgGrid";


const Setting = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [navItems, setNavItems] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [render, setRerender] = useState(true);
  const { setRerender: setAppRender, rerender } = useUserContext();

  async function getNavItems() {
    setNavItems(domainSidebarLinks);
  }
  useEffect(() => {
    getNavItems();
    setAppRender((prev: boolean) => !prev);
    console.log(rerender)
  }, [render])
  return (
    <div className="main-container w-full overflow-hidden ">
      <div className="px-4 py-5 flex justify-between h-[10vh] min-h-[10vh] max-h-[10vh">
        <h3 className="page-titles">Settings</h3>
      </div>
      <div className="h-[90vh] min-h-[90vh] max-h-[90vh] overflow-y-auto px-5 ">

        <Tabs defaultValue="sidebar" className="w-full">
          <TabsList className="grid w-full grid-cols-6 text-black">
            <TabsTrigger value="sidebar">Sidebar</TabsTrigger>
            <TabsTrigger value="upload_svg">Upload SVG Icons</TabsTrigger>
          </TabsList>
          <TabsContent value="sidebar">
            <div className="p-4 page-innersubtitles">
              <div className="flex  border-primary-500 gap-8" >
                <div className="items w-full">
                  <NavDatatable navItems={navItems} setSelectedItem={setSelectedItem} render={render} />
                </div>
                {/* <div className="form w-1/2">
                  <NavItemForm item={selectedItem} setRerender={setRerender}  />
                </div> */}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="upload_svg">
            <div className="p-4 page-innersubtitles">
              <div className="flex  border-primary-500 gap-8" >
                <div className="items w-full">
                  <SvgGrid />
                </div>
                {/* <div className="form w-1/2">
                  <UploadSvgForm />
                </div> */}
              </div>
            </div>
          </TabsContent>
        </Tabs>



      </div>
    </div>
  );
};

export default Setting;
