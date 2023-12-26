import { bottombarLinks } from "@/constants";
import { INavLink } from "@/lib/types";
import { Link, useLocation } from "react-router-dom"

const BottomBar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {bottombarLinks?.map((link: INavLink) => {
        const isActive = pathname === link.route;
        return (
            <Link key={link.label} className={`flex-center flex-col gap-2 p-2 px-6 rounded-2xl transition ${isActive ? 'bg-primary-500 rounded-10px text-white hover:bg-primary-500' : ''}`} to={link?.route}>
              <img src={link?.imgURL} alt={link?.label} width={16} height={16} className={`group-hover:invert-white  ${isActive ? 'invert-white' : ''}`} />
              <p className={`tiny-medium  ${isActive ? 'text-white' : 'text-dark-2'} `}>{link.label}</p>
            </Link>
        )
      })}
    </section>
  )
}

export default BottomBar
