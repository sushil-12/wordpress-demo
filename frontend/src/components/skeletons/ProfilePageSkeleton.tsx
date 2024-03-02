import { NavLink } from "react-router-dom";
import { Settings } from "lucide-react";
import { Skeleton } from "primereact/skeleton";

const ProfilePageSkeleton = () => {
    return (
        <div className="main-container p-5 w-full">
            <div className="px-4 bg-white flex justify-between h-[10vh] min-h-[10vh] max-h-[10vh]">
                <h3 className="page-titles">My profile</h3>
                <nav className="flex">
                    <NavLink key='settings' className={`flex gap-2 text-primary-500`} to={'/settings'}>
                        <Settings className="shad-button_ghost" />Settings
                    </NavLink>

                </nav>
            </div>
            <div className="main-content px-2 w-[400px]">
                <h3 className="page-subtitles"> <Skeleton width="249px" height="34px" className="rounded"></Skeleton></h3>
                <div className="edit_image_container pt-[40px] mb-[70px]">
                    <div className="flex items-center gap-8">
                        <div className="">
                            <Skeleton width="110px" height="110px" className="rounded-full"></Skeleton>
                        </div>
                        <div className="img_description flex flex-col ">
                            <Skeleton width="179px" height="104px"></Skeleton>
                        </div>
                    </div>
                </div>
                <h3 className="page-subtitles"> <Skeleton width="249px" height="34px" className="rounded"></Skeleton></h3>
                <div>
                    <div className="">
                        <form
                            className="space-y-1 flex flex-col gap-3 w-full mt-4"
                        >
                            <Skeleton width="350px" height="66px"></Skeleton>
                            <div className="flex gap-2.5">
                                <Skeleton width="350px" height="111px"></Skeleton>
                            </div>
                            <div className="flex gap-8">
                            <Skeleton width="110px" height="34px"></Skeleton>
                            <Skeleton width="80px" height="34px"></Skeleton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProfilePageSkeleton;