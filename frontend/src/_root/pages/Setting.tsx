import NavDatatable from "@/components/datatable/NavDatatable";
import { useUserContext } from "@/context/AuthProvider";
import { useEffect, useState } from "react";
import { domainSidebarLinks} from "@/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SvgGrid from "@/components/shared/SvgGrid";


const Setting = () => {
  const [navItems, setNavItems] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [render, setRerender] = useState(true);
  const { setRerender: setAppRender, rerender } = useUserContext();
  console.log(selectedItem, setRerender )
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
      <div className="w-full flex items-center justify-between h-[10vh] min-h-[10vh] max-h-[10vh] justify pl-5 pr-[44px]">
        <h3 className="page-titles">Settings</h3>
      </div>
      <div className="h-[90vh] min-h-[90vh] max-h-[90vh] overflow-y-auto px-5 ">

        <Tabs defaultValue="sidebar" className="w-full">
          <TabsList className="grid w-full grid-cols-6 text-black">
            <TabsTrigger value="sidebar" className="bg-primary-500 text-white text-sm font-medium">Manage Sidebar</TabsTrigger>
            {/* <TabsTrigger value="upload_svg">Upload SVG Icons</TabsTrigger> */}
          </TabsList>
          <TabsContent value="sidebar">
            <div className="page-innersubtitles">
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
