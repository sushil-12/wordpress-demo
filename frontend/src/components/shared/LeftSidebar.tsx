import { useUserContext } from "@/context/AuthProvider";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { Button } from "../ui/button";
import { useGetAllDomains, useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { domainSidebarLinks, logos } from "@/constants";
import { INavLink } from "@/lib/types";

interface domain {
    name: string,
    link: string,
    title: string,
}
const LeftSidebar = () => {
    const { mutate: signOut, isSuccess } = useSignOutAccount();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, currentDomain, setCurrentDomain } = useUserContext();
    const { mutateAsync: getAllDomains, isPending: isDomainLoading } = useGetAllDomains();
    const [domain, setDomains] = useState<domain[]>([]);
    const logoPath: string | undefined = logos[currentDomain as keyof typeof logos];
    const sidebarLinks = domainSidebarLinks[currentDomain];
    const fetchDomains = async () => {
        try {
            const fetchedDomains = await getAllDomains();
            setDomains(fetchedDomains.data);
        } catch (error) {
            console.error('Error fetching domains:', error);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            navigate(0);
        }
        // Fetch domains when component mounts
        fetchDomains();
    }, [isSuccess]);
    return (
        <div className="leftsidebar">
            <div className="flex flex-col gap-11">
            <select
                id="location"
                name="location"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={currentDomain} // Use the state value here
                onChange={(e) => setCurrentDomain(e.target.value)}
                >
                {domain.map((item) => (
                    <option key={item?.name} value={item?.name}>
                    {item.title}
                    </option>
                ))}
                </select>
                <Link to="/" className="flex gap-3 items-center">
                    <img src={logoPath} alt="Logo" width={200} height={60} />
                </Link>
                <Link to={`/profile/${user.id}`} className="flex gap-3">
                    <img alt="profile" src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMuVZPUguhjwOPqFgeplotL_MmSDTV2Y-dJh72EC8yTQ&s'} width={50} height={50} className="h-14 w-14 rounded-full" />
                    <div className="flex flex-col">
                        <p className="body-bold">
                            {user?.firstName + ' ' + user?.lastName}
                        </p>
                        <p className="small-regular text-light-3">
                            @{user.username}
                        </p>
                    </div>
                </Link>
                <ul className="flex flex-col gap-6">
                    {sidebarLinks?.map((link: INavLink) => {
                        const isActive = pathname === link.route;
                        return (
                            <li className={`leftsidebar-link group ${isActive ? 'bg-primary-500 text-white ' : ''}`} key={link?.label}>
                                <NavLink className="flex gap-4 items-center p-4" to={link?.route}>
                                    <img src={link?.imgURL} alt={link?.label} className={`group-hover:invert-white  ${isActive ? 'invert-white' : ''}`} />{link.label}
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>

            </div>
            <Button variant="ghost" className="shad-button_ghost" onClick={() => signOut()}>
                <img src="/assets/icons/logout.svg" />
                <p className="small-medium lg:base-medium" >Logout</p>
            </Button>
        </div>
    )
}

export default LeftSidebar
