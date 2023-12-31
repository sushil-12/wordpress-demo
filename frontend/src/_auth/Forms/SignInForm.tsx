
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { signInValidationSchema } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthProvider";
import { z } from "zod";


const SignInForm = () => {

    const { toast } = useToast()
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
    const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof signInValidationSchema>>({
        resolver: zodResolver(signInValidationSchema),
        defaultValues: {
            email: "admin@example.com",
            password: "adminPassword",
        },
    });
    console.log(isUserLoading, "iseUserLoading")
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof signInValidationSchema>) {

        const session = await signInAccount({
            email: values.email,
            password: values.password
        })
        if (!session) {
            console.log(session);
            return toast({ variant: "destructive", title: "SignIn Failed", description: "Something went wrong" })
        }
        const isLoggedIn = await checkAuthUser();
        if (isLoggedIn) {
            form.reset();
            toast({ title: "Logged In sucessfuly" })
            navigate('/');
        } else {
            const statuscode = session?.response?.data?.statusCode;
            const message = session?.response?.data?.message;
            const title = session?.response?.data?.status;
            return toast({ variant: "destructive", title: title, description: message+ "("+statuscode+")" })
        }
    }

    return (
        <Form {...form}>
            <div className="">
                <div className="sm:w-420 flex-col">
                    <img src="/assets/images/logo.png" className="h-20" />
                    <h2 className="h4-bold base-regular tracking-wide md:h3-bold pt-5 text-sm sm-pt-12">
                        Login to your Account
                    </h2>
                    <p className="text-light-3 small-medium md:base-regular mt-2">
                        Welcome Back! Please enter your details
                    </p>
                </div>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-1 flex flex-col gap-5 w-full mt-4"
                >
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
                        {isSigningIn ? (
                            <div className="flex-center gap-2">
                                <Loader />
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>
                {/* <p className="text-small-regular text-dark-2 text-center mt-2">
                    Don't have an account?{" "}
                    <Link
                        to="/sign-up"
                        className="text-primary-500 text-small-semibold ml-1"
                    >
                        Sign Up
                    </Link>
                </p> */}
            </div>
        </Form>
    );
};

export default SignInForm;
