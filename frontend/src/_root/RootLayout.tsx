import BottomBar from "@/components/shared/BottomBar"
import LeftSidebar from "@/components/shared/LeftSidebar"
import Loader from "@/components/shared/Loader"
import TopBar from "@/components/shared/TopBar"
import { useUserContext } from "@/context/AuthProvider"
import { Outlet } from "react-router"

const RootLayout = () => {
  const {isAuthenticated} = useUserContext();
  if(!isAuthenticated){
    return <Loader />
  }
  return (
    <div className="w-full md:flex">
      <TopBar />
      <LeftSidebar />

      <section className="flex flex-1 h-full">
        <Outlet />  
      </section>
      <BottomBar />      
    </div>
  )
}

export default RootLayout
