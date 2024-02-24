import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { resetPasswordValidationSchema } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import {  useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useResetPasswordAccount } from "@/lib/react-query/queriesAndMutations";
import { z } from "zod";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

const ResetPasswordForm = () => {
    const { toast } = useToast();
    let { token } = useParams();
    const [success, setSuccess] = useState(false)
    const { mutateAsync: resetPassword, isPending: isResetting } = useResetPasswordAccount();
    const navigate = useNavigate();


    const form = useForm<z.infer<typeof resetPasswordValidationSchema>>({
        resolver: zodResolver(resetPasswordValidationSchema),
        defaultValues: {
            form_type: 'reset_password_form',
            password: "",
            confirm_password: '',
            reset_token: token,
        },
    }); console.log(form)
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof resetPasswordValidationSchema>) {
        console.log(values)
        const session = await resetPassword({
            password: values.password,
            reset_token: token || '',
            form_type: 'reset_password_form',
        });

        if (!session) {
            return toast({
                variant: "destructive",
                title: "Reset Failed",
                description: "Something went wrong",
            });
        }
        const response_data = session?.data?.data;
        if (response_data.password_reset) {
            setSuccess(true);
        }else{
            return toast({
                variant: "destructive",
                title: "Something went wrong",
            });
        }

    }

    return (
        <Form {...form}>
            <div className="">
                <div className="flex align-middle text-center justify-center mb-10">
                    <img src="/assets/icons/he-group.svg" className="h-auto" />
                </div>
                {success && (
                    <Card
                        className=""
                        pt={{
                            root: { className: "reset_card login_cards rounded-xl" },
                            title: {
                                className: "text-main-bg-900 card_headings inter-regular-32",
                            },
                        }}
                    >

                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-1 flex flex-col  w-full mt-4 form_container"
                        >
                            <div className="flex flex-col gap-8">
                                <h1 className="text-main-bg-900 leading-10 inter-regular-32 text-center">{`Password successfully updated!`}</h1>
                                <img src="/assets/icons/check.svg" alt="Check Icons" className="h-16 w-16 self-center" />
                                <Button
                                    type="submit"
                                    className="bg-main-bg-900 inter-regular-14 text-white mt-3 action_button h-10"
                                    onClick={() => navigate('/login')}
                                >
                                    {isResetting && isResetting ? (
                                        <div className="flex-center gap-2">
                                            <Loader />
                                        </div>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}
                {!success && (
                    <Card
                        className=""
                        pt={{
                            root: { className: "login_cards rounded-xl" },
                            title: {
                                className: "text-main-bg-900 card_headings inter-regular-32",
                            },
                        }}
                    >

                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-1 flex flex-col  w-full mt-4 form_container"
                        >
                            <div className="flex flex-col gap-5">
                                <h1 className="text-main-bg-900 card_headings  inter-regular-32 mb-5">{`Reset Password`}</h1>

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <label className="form_labels inter-regular-14">
                                                New Password
                                            </label>
                                            <FormControl>
                                                <div className="p-inputgroup flex-1 inter-regular-14 form_labels">
                                                    <span className="p-inputgroup-addon bg-white">
                                                        <img src="/assets/icons/key-password.svg" />
                                                    </span>
                                                    <InputText
                                                        size="sm"
                                                        type="password"
                                                        className=""
                                                        placeholder="password"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>

                                            <FormMessage className="shad-form_message" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirm_password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <label className="form_labels inter-regular-14">
                                                Confirm Password
                                            </label>
                                            <FormControl>
                                                <div className="p-inputgroup flex-1 inter-regular-14 form_labels">
                                                    <span className="p-inputgroup-addon bg-white">
                                                        <img src="/assets/icons/key-password.svg" />
                                                    </span>
                                                    <InputText
                                                        size="sm"
                                                        type="password"
                                                        className=""
                                                        placeholder="Confirm Password"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>

                                            <FormMessage className="shad-form_message" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="bg-main-bg-900 inter-regular-14 text-white mt-3 action_button h-10"
                                disabled={isResetting || isResetting}
                            >
                                {isResetting && isResetting ? (
                                    <div className="flex-center gap-2">
                                        <Loader />
                                    </div>
                                ) : (
                                    "Reset password"
                                )}
                            </Button>
                        </form>
                    </Card>
                )}

            </div>
        </Form>
    );
};

export default ResetPasswordForm;
