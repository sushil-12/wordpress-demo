import BottomBar from "@/components/shared/BottomBar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import TopBar from "@/components/shared/TopBar";
import { useUserContext } from "@/context/AuthProvider";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";

const RootLayout = () => {
  const { currentDomain } = useUserContext();
  const [outletKey, setOutletKey] = useState(0);
 
  useEffect(() => {
    setOutletKey((prevKey) => prevKey + 1);
  }, [currentDomain]);
  
  return (
    <div className="w-full md:flex">
      <TopBar />
      <LeftSidebar />

      <section className="flex flex-1 h-full">
        <Outlet key={outletKey} />
      </section>
      <BottomBar />
    </div>
  );
};

export default RootLayout;
