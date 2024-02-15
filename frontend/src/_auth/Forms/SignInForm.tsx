
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
import { Checkbox } from "primereact/checkbox";
import { useState } from "react";


const SignInForm = () => {

    const { toast } = useToast();
    const [state, setState] = useState<FormState>('4');
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
    const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();
    const navigate = useNavigate();
    // Define type for the state
    type FormState = "login_form" | "verify_account_form" | "forgot_password_form";

    // Define titles for each state
    const titles: Record<FormState, string> = {
        login_form: "Login",
        verify_account_form: "Verify Account",
        forgot_password_form: "Forgot Password",
    };

    const form = useForm<z.infer<typeof signInValidationSchema>>({
        resolver: zodResolver(signInValidationSchema),
        defaultValues: {
            email: "admin@example.com",
            password: "adminPassword",
            staySignedIn: false
        },
    });
    console.log(isUserLoading, "iseUserLoading")
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof signInValidationSchema>) {

        const session = await signInAccount({
            email: values.email,
            password: values.password,
            staySignedIn: values.staySignedIn,
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
            return toast({ variant: "destructive", title: title, description: message + "(" + statuscode + ")" })
        }
    }

    return (
        <Form {...form}>
            <div className="">
                <div className="flex align-middle text-center justify-center mb-8">
                    <img src="/assets/images/login-logo.png" className="h-auto" />
                </div>
                <Card className="" title={`${titles[state]}`} pt={{ root: { className: 'login_cards' }, title: { className: 'text-main-bg-900 card_headings inter-regular-32' }, }} >

                    {state === "login_form" && (
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-1 flex flex-col  w-full mt-4 form_container" >
                            <div className="flex flex-col gap-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <label className="form_labels inter-regular-14">Email</label>
                                            <FormControl>
                                                <div className="p-inputgroup flex-1 inter-regular-14 form_labels">
                                                    <span className="p-inputgroup-addon bg-white">
                                                        <img src="/assets/icons/mail-icon.png" />
                                                    </span>
                                                    <InputText className="b" placeholder="john.doe@gmail.com" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>

                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <label className="form_labels inter-regular-14">Password</label>
                                            <FormControl>
                                                <div className="p-inputgroup flex-1 inter-regular-14 form_labels">
                                                    <span className="p-inputgroup-addon bg-white">
                                                        <img src="/assets/icons/key-password.png" />
                                                    </span>
                                                    <InputText size="sm" type="password" className="" placeholder="password" {...field} />
                                                </div>
                                            </FormControl>

                                            <FormMessage className="shad-form_message" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <p className="text-small-regular text-dark-2 text-right mt-3">
                                <Link to="/forgot-password" className="text-main-bg-900 inter-regular-14"> Forgot password? </Link>
                            </p>
                            <FormField
                                control={form.control}
                                name="staySignedIn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex align-items-center align-middle mt-5">
                                                <Checkbox
                                                    inputId="staySignedIn"
                                                    className="form_check"
                                                    checked={form.getValues('staySignedIn')}
                                                    onChange={(e) => field.onChange(!form.getValues('staySignedIn'))}
                                                />
                                                <label htmlFor="staySignedIn" className="ml-2 inter-regular-14 text-main-bg-900 ">Stay signed in for a week</label>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="bg-main-bg-900 inter-regular-14 text-white mt-3 action_button" disabled={isSigningIn || isUserLoading}>
                                {isSigningIn && isUserLoading ? (
                                    <div className="flex-center gap-2">
                                        <Loader />
                                    </div>
                                ) : (
                                    "Login"
                                )}
                            </Button>
                        </form>
                    )}
                    {state === "forgot_password_form" && (
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-1 flex flex-col  w-full mt-4 form_container" >
                            <div className="flex flex-col gap-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <label className="form_labels inter-regular-14">Email</label>
                                            <FormControl>
                                                <div className="p-inputgroup flex-1 inter-regular-14 form_labels">
                                                    <span className="p-inputgroup-addon bg-white">
                                                        <img src="/assets/icons/mail-icon.png" />
                                                    </span>
                                                    <InputText className="b" placeholder="john.doe@gmail.com" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>

                                    )}
                                />
                            </div>
                            <Button type="submit" className="bg-main-bg-900 inter-regular-14 text-white mt-3 action_button" disabled={isSigningIn || isUserLoading}>
                                {isSigningIn && isUserLoading ? (
                                    <div className="flex-center gap-2">
                                        <Loader />
                                    </div>
                                ) : (
                                    "Login"
                                )}
                            </Button>
                        </form>
                    )}
                    {state === "verify_account_form" && (
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-1 flex flex-col  w-full mt-4 form_container" >
                            <div className="flex flex-col gap-5">
                                <p className="form_labels inter-regular-14 font-medium">Please, enter the verification code we sent to your mobile phone number.</p>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <label className="form_labels inter-regular-14">Verification Code</label>
                                            <FormControl>
                                                <div className="p-inputgroup flex-1 inter-regular-14 form_labels">
                                                    <span className="p-inputgroup-addon bg-white">
                                                        <img src="/assets/icons/mail-icon.png" />
                                                    </span>
                                                    <InputText className="b" placeholder="john.doe@gmail.com" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>

                                    )}
                                />
                            </div>
                            <Button type="submit" className="bg-main-bg-900 inter-regular-14 text-white mt-3 action_button" disabled={isSigningIn || isUserLoading}>
                                {isSigningIn && isUserLoading ? (
                                    <div className="flex-center gap-2">
                                        <Loader />
                                    </div>
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </form>
                    )}
                </Card>
            </div>
        </Form>
    );
};

export default SignInForm;
