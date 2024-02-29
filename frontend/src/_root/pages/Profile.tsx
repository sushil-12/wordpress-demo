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
import { useEffect, useState } from "react";
import { IUser } from "@/lib/types";
import { useEditProfile } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import { Settings } from "lucide-react";

const Profile = () => {
  const { user, setUser } = useUserContext();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<IUser>(user);
  const { mutate: editProfile, isPending: isUpdating } = useEditProfile();
  useEffect(() => { console.log(currentUser); if (user) { setCurrentUser(user) }; if (currentUser) { form.setValue('name', currentUser.firstName); form.setValue('bio', currentUser?.bio); form.setValue('id', currentUser?.id) } }, [currentUser, user])

  const form = useForm<z.infer<typeof editProfileFieldSchema>>({
    resolver: zodResolver(editProfileFieldSchema),
    defaultValues: {
      id: currentUser?.id,
      name: currentUser?.firstName,
      bio: currentUser?.bio,
    },
  });

  async function onSubmit(values: z.infer<typeof editProfileFieldSchema>) {
    try {
      const updateResponse = editProfile({ name: values.name, id: values.id, bio: values.bio });
      return toast({ description: 'Profile Edited Succesfuly!' })
    } catch (error) {
      return toast({ description: 'Profile Edited Failed!', variant: 'destructive' })
    }


  }

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
        <h3 className="page-subtitles">Edit profile picture</h3>
        <div className="edit_image_container pt-[40px] mb-[70px]">
          <div className="flex items-center gap-8">
            <div className="">
              <img src="/assets/icons/profile.svg" alt="" className="w-[110px] h-[110px]" />
            </div>
            <div className="img_description flex flex-col ">
              <span className="page-innertitles mb-2.5">Upload new image</span>
              <span className="mb-4 font-normal text-[16px] leading-[150%]">Max file size - 128kb</span>
              <div className="flex action_buttons gap-[10px]">
                <button className="bg-primary-500 rounded flex text-white items-center w-[86px] h-[30px] small-regular py-2.5"><img src="/assets/icons/upload.svg" alt="" className="pl-3 pr-2 " />Upload</button>
                <button className="bg-light-1 rounded flex text-main-bg-900 items-center w-[64px] h-[30px] small-regular py-2.5 pl-2.5 border-main-bg-900 border">Cancel</button>
              </div>
            </div>
          </div>
        </div>
        <h3 className="page-subtitles">Edit personal information</h3>
        <Form {...form}>
          <div className="">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-1 flex flex-col gap-3 w-full mt-4"
            >
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem className="outline-none focus-within:border-none focus:border-none">
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input className="outline-none focus-within:border-none focus:border-none" placeholder="Add name" {...field} /></FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
              />
              <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add Bio" className="outline-none focus-within:border-none focus:border-none" {...field}></Textarea>
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>

              )}
              />
              <div className="flex gap-2.5">
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

    </div>
  );
};

export default Profile;