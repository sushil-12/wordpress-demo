import { useUserContext } from "@/context/AuthProvider";
import { editProfileFieldSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod";
import {
  NavLink,
  Outlet,
} from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { IUser } from "@/lib/types";
import { useEditProfile } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import { Settings } from "lucide-react";
import ProfilePageSkeleton from "@/components/skeletons/ProfilePageSkeleton";
import { Skeleton } from "primereact/skeleton";
import { editProfile } from "@/lib/appwrite/api";
import SvgComponent from "@/utils/SvgComponent";
import Header from "@/components/ui/header";

const Profile = () => {
  const { user, setUser, isLoading, setRerender } = useUserContext();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<IUser>(user);
  const [loader, setloader] = useState(true);
  const [isUpdating, setisUpdating] = useState(false);
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState('');
  const [emailDisabled,setEmailDisabled] = useState(true)
  const [passwordDisabled,setPasswordDisabled] = useState(true)
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size
      if (file.size > 128 * 1024) {
        alert('File size exceeds 128 KB limit.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        // @ts-ignore
        setImageSrc(reader.result); const base64Data = reader.result?.split(',')[1]; // Get the base64 data part
        form.setValue('profile_pic', base64Data);
        // @ts-ignore
      };

      reader.readAsDataURL(file);
    }
  };
 
  useEffect(() => { console.log(currentUser); if (user) { setCurrentUser(user) }; if (currentUser) { form.setValue('name', currentUser.firstName); form.setValue('bio', currentUser?.bio); form.setValue('id', currentUser?.id) }; setImageSrc(currentUser?.profile_pic);form.setValue('email',currentUser?.email);  setloader(false);  }, [currentUser, user])

  const form = useForm<z.infer<typeof editProfileFieldSchema>>({
    resolver: zodResolver(editProfileFieldSchema),
    defaultValues: {
      id: currentUser?.id,
      name: currentUser?.firstName,
      bio: currentUser?.bio,
      email:currentUser?.email,
      password:''
    },
  });

  async function onSubmit(values: z.infer<typeof editProfileFieldSchema>) {
    try {
      setisUpdating(true)
      const updateData = { name: values.name, id: values.id, bio: values.bio };
      if (values.profile_pic) {
        // @ts-ignore
        updateData.profile_pic = values.profile_pic;
      }
      const updateResponse = await editProfile(updateData);
      console.log(updateResponse);
      setRerender((prev: boolean) => !prev);
      setisUpdating(false);
      return toast({ description: 'Profile Edited Succesfuly!' })
    } catch (error) {
      return toast({ description: 'Profile Edited Failed!', variant: 'destructive' })
    }


  }

  return (
    <div className="main-container w-full">
      <div className="w-full flex items-center justify-between h-[10vh] min-h-[10vh] max-h-[10vh] justify pl-5 pr-[44px]">
        <h3 className="page-titles">My profile</h3>
        <nav className="flex">
          <NavLink key='settings' className={`flex gap-2 text-primary-500`} to={'/settings'}>
            <Settings className="shad-button_ghost" />Settings
          </NavLink>
        </nav>
      </div>
      {loader ? (<ProfilePageSkeleton />) : (
        <div className="main-content  h-[90vh] min-h-[90vh] max-h-[90vh] overflow-x-hidden overflow-y-auto p-6">
          <h3 className="page-subtitles">Edit profile picture</h3>
          <div className="edit_image_container pt-[40px] mb-[70px]">
            <div className="flex items-center gap-8">
              <div className="">
                {imageSrc =='' ? ( <Skeleton width="110px" height="110px" className="rounded-full"></Skeleton>) :<img src={`${imageSrc}`} alt="" className="w-[110px] h-[110px]" /> }
                
              </div>
              <div className="img_description flex flex-col ">
                <span className="page-innertitles mb-2.5">Upload new image</span>
                <span className="mb-4 font-normal text-[16px] leading-[150%]">Max file size - 128kb</span>
                <div className="flex action_buttons gap-[10px]">
                  <input type="file" accept="image/*" multiple={false} className="hidden" onChange={handleFileChange} ref={fileInputRef} />
                  {/* @ts-ignore */}
                  <button className="bg-primary-500 rounded flex text-white items-center w-[86px] h-[30px] small-regular py-2.5" onClick={() => fileInputRef.current.click()}>
                    <SvgComponent className="pl-3 pr-2 " svgName="upload" />Upload
                    {/* <img src="/assets/icons/upload.svg" alt="" className="pl-3 pr-2 " />Upload */}
                  </button>
                  <button onClick={() => { form.unregister('profile_pic'); setImageSrc(currentUser?.profile_pic); console.log(imageSrc) }} className="bg-light-1 rounded flex text-main-bg-900 items-center w-[64px] h-[30px] small-regular py-2.5 pl-2.5 border-main-bg-900 border" >Cancel</button>
                </div>
              </div>
            </div>
          </div>
          <h3 className="page-subtitles">Edit personal information</h3>
          <Form {...form}>
            <div className="">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-3 w-full mt-4"
              >
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem className="outline-none focus-within:border-none focus:border-none">
                    <FormLabel className="text-secondary-label">Name</FormLabel>
                    <FormControl><Input className="outline-none focus-within:border-none focus:border-none w-[350px]" placeholder="Add name" {...field}  /></FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
                />
                <FormField control={form.control} name="bio" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary-label">Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add Bio" className="outline-none focus-within:border-none focus:border-none w-[350px]" {...field}></Textarea>
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>

                )}
                />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary-label">Email</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                      <Input className="outline-none shadow-none focus-within:border-none focus:border-none w-[350px] " {...field}  />
                      <button  className="bg-light-1 rounded flex ml-1 text-main-bg-900 items-center  h-[30px] small-regular py-2.5 pl-2.5 pr-2.5 border-main-bg-900 border" >Edit Email</button>
                      </div>
                    </FormControl>

                    <FormMessage className="shad-form_message" />
                  </FormItem>

                )}
                />
                 <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary-label">Password</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                      <Input className="outline-none focus-within:border-none focus:border-none w-[350px] " {...field}  />
                      <button  className="bg-light-1 rounded flex ml-1 text-main-bg-900 items-center  h-[30px] small-regular py-2.5 pl-2.5 pr-2.5 border-main-bg-900 border" >Edit Password</button>
                      </div>
                    </FormControl>

                    <FormMessage className="shad-form_message" />
                  </FormItem>

                )}
                />

                <div className="flex gap-2.5 mt-[34px]">
                  <Button type="submit" className="text-white w-[131px] bg-primary-500 rounded text-[16px] ">
                    {
                      isUpdating ? <Loader /> : 'Save changes'
                    }
                  </Button>
                  <Button className=" bg-light-1 w-[86px] border border-primary-500 text-[16px] cursor-pointer" onClick={(event) => { event.preventDefault(); form.reset() }}>
                    Clear all
                  </Button>
                </div>

              </form>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Profile;