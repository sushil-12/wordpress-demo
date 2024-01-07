import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {Form,FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { signUpValidationSchema } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthProvider";
import { z } from "zod";

const SignUpForm = () => {
  const { toast } = useToast()
  const {checkAuthUser }= useUserContext();
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount();
  const { mutateAsync: signInAccount } = useSignInAccount();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signUpValidationSchema>>({
    resolver: zodResolver(signUpValidationSchema),
    defaultValues: {
      username: "demo",
      firstName: "demo",
      lastName: "kumar",
      email: "demo@yopmail.com",
      password: "12345678",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpValidationSchema>) {
    const newUser = await createUserAccount(values);
    if (!newUser) {
      return toast({ variant: "destructive", title: "Signup Failed", description: "Something went wrong" })
    }
    if (newUser && newUser.code && newUser.code.includes('ERR')) {
      return toast({ variant: "destructive", title: "Signup Failed", description: newUser?.response?.data?.message });
    }
    const session = await signInAccount({
      email: values.email,
      password: values.password
    })
    if (!session) {
      return toast({ variant: "destructive", title: "SigIn Failed", description: "Something went wrong" })
    }
     const isLoggedIn = await checkAuthUser();
     if(isLoggedIn){
      form.reset();
      toast({title: "Logged In sucessfuly" })
      navigate('/');
     }else{
      return toast({ variant: "destructive", title: "SigIn Failed", description: "Something went wrong" })

     }

  }

  return (
    <Form {...form}>
      <div className="">
        <div className="sm:w-420 flex-col">
          <img src="/assets/images/logo.png" className="" />
          <h2 className="h3-bold md:h2-bold pt-5 sm-pt-12">
            Create a new Account
          </h2>
          <p className="text-light-3 small-medium md:base-regular mt-2">
            To use a He-Group please enter your details
          </p>
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-1 flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    placeholder="Enter Username"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message"/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    placeholder="Enter Username"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message"/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    placeholder="Enter Username"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message"/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    placeholder="Enter Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message"/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    type="password"
                    placeholder="Enter Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message"/>
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingUser ? (
              <div className="flex-center gap-2">
                <Loader />
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
        <p className="text-small-regular text-light-2 text-center mt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-500 text-small-semibold ml-1"
          >
            Log in
          </Link>
        </p>
      </div>
    </Form>
  );
};

export default SignUpForm;
