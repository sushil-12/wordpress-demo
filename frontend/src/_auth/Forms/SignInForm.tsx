
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { signInValidationSchema } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthProvider";
import { z } from "zod";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { KeyRound, Mail } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
            return toast({ variant: "destructive", title: "SignIn Failed", description: "Something went wrong" })
        }
        const isLoggedIn = await checkAuthUser();
        if (isLoggedIn) {
            form.reset();
            toast({ title: "Logged In sucessfuly" })
            navigate('/dashboard');
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
                <div className="sm:w-420 flex align-middle text-center justify-center mb-4">
                    <img src="/assets/images/login-logo.png" className="h-auto" />
                </div>
                <Card className="md:w-30rem card" title= "Login" pt={{  title: { className: 'text-main-bg-900 title font-bold text-xl' }, }} >

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-1 flex flex-col gap-5 w-full mt-4 form_container"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <div className="p-inputgroup flex-1">
                                        <span className="p-inputgroup-addon bg-white">
                                            <Mail />
                                        </span>
                                        <InputText className="b" placeholder="Your Email Address" {...field} />
                                    </div>
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
                                    <div className="p-inputgroup flex-1">
                                        <span className="p-inputgroup-addon bg-white">
                                            <KeyRound />
                                        </span>
                                        <InputText type="password" className="" placeholder="Your Password" {...field} />
                                    </div>
                                </FormControl>
                               
                                <FormMessage className="shad-form_message"/>
                            </FormItem>
                        )}
                    />
                     <div className="flex align-items-center align-middle">
                        <Checkbox />
                        <label htmlFor="ingredient1" className="ml-2">Stay signed in for a week</label>
                    </div>
                    <Button type="submit" className="bg-main-bg-900 text-white" disabled={isSigningIn || isUserLoading}>
                        {isSigningIn && isUserLoading ? (
                            <div className="flex-center gap-2">
                                <Loader />
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>
                <p className="text-small-regular text-dark-2 text-right mt-2">
                    <Link
                        to="/forgot-password"
                        className="text-main-bg-900 text-small-semibold ml-1"
                    >
                        Forgot password?
                    </Link>
                </p>
                </Card>
            </div>
        </Form>
    );
};

export default SignInForm;
