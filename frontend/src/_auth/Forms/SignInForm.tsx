import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { forgotPassword, loginInValidationSchema, signInValidationSchema, verifyAccount } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthProvider";
import { z } from "zod";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { useEffect, useState } from "react";
import { messages } from "@/constants/message";

const SignInForm = () => {
  const location = useLocation();
  const { pathname } = location;
  const form_state = (pathname === '/verify-account') ? 'verify_account_form' : (pathname === '/forgot-password') ? 'forgot_password_form' : 'login_form';

  const { toast } = useToast();
  const [state, setState] = useState<FormState>("login_form");
  const [timeLeft, setTimeLeft] = useState(120);
  const [running, setRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);


  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (state !== 'verify_account_form') {
      setState(form_state)
    }
    let interval: any;
    if (running && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
      }, 1000);
    }
    if (timeLeft === 0) {
      clearInterval(interval);
      setTimerFinished(true);
      form.setValue('form_type', 'login_form');
      form.setValue('verification_code','xxxxxx'); 
      console.log(form)
      form.setError('verification_code', {
        message: `Verification code expired. Please generate new.`
      },);
    }
    return () => clearInterval(interval);
  }, [state, pathname, running, timeLeft])
  // Define type for the state
  type FormState =
    | "login_form"
    | "verify_account_form"
    | "forgot_password_form";

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  console.log(minutes, seconds)
  // Define titles for each state
  const titles: Record<FormState, string> = {
    login_form: "Login",
    verify_account_form: "Verify Account",
    forgot_password_form: "Forgot Password",
  };
  const validationSchema = {
    login_form: loginInValidationSchema,
    verify_account_form: verifyAccount,
    forgot_password_form: forgotPassword,
  };
 
  const form = useForm<z.infer<typeof signInValidationSchema>>({
    resolver: zodResolver(validationSchema[state]),
    defaultValues: {
      form_type: state,
      email: "hegroup-admin@yopmail.com",
      password: "adminPassword",
      staySignedIn: 'yes',
      verification_code: '',
    },
  });
  console.log(isUserLoading, "iseUserLoading", form.formState);
  
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInValidationSchema>) {
    
    const session = await signInAccount({
      email: values.email,
      password: values.password,
      staySignedIn: values.staySignedIn,
      form_type: values.form_type,
      verification_code: values.verification_code,
    });

    if (!session) {
      return toast({
        variant: "destructive",
        title: "SignIn Failed",
        description: messages.default_error,
      });
    }
    if (session?.response?.data?.status == 'error') {
      form.setError(session?.response?.data?.message?.field_error, { message: session?.response?.data?.message?.message }, { shouldFocus: true })
      return;
    }

    if (state == 'login_form' || form.getValues('form_type') == 'login_form') {
      const response_data = session?.data?.data; 
      if (response_data.email_sent) {
        navigate('/verify-account')
        setRunning(true)
        form.clearErrors('verification_code');
        form.setValue('verification_code','')
        setState('verify_account_form');
        form.setValue('form_type', 'verify_account_form')
        setTimeLeft(120)
        setTimerFinished(false)
        return toast({ title: "Verification code succesfuly" });
      }
    }
    if (state == 'forgot_password_form') {
      const response_data = session?.data?.data;
      if (response_data.reset_link_sent) {
        return toast({ title: "Reset link sent succesfuly" });
      } else {
        return toast({ variant: "destructive", title: "Something went wrong!" });
      }
    }
    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      toast({ title: "Logged In sucessfuly" });
      navigate("/dashboard");
    } else {
      const statuscode = session?.response?.data?.statusCode;
      const message = session?.response?.data?.message;
      const title = session?.response?.data?.status;

      return toast({
        variant: "destructive",
        title: title,
        description: message + "(" + statuscode + ")",
      });
    }
  }

  return (
    <Form {...form}>
      <div className="">
        <div className="flex align-middle text-center justify-center mb-10">
          <img src="/assets/icons/he-group.svg" className="h-auto" />
        </div>
        <Card
          className=""
          pt={{
            root: { className: "login_cards rounded-xl" },
            title: {
              className: "text-main-bg-900 card_headings inter-regular-32",
            },
          }}
        >
          {state === "login_form" && (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-1 flex flex-col  w-full mt-4 form_container"
            >
              <div className="flex flex-col gap-5">
                <h1 className="text-main-bg-900 card_headings  inter-regular-32 mb-5">{`${titles[state]}`}</h1>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <label className="form_labels inter-regular-14">
                        Email
                      </label>
                      <FormControl>
                        <div className="p-inputgroup flex-1 inter-regular-14 form_labels">
                          <span className="p-inputgroup-addon bg-white">
                            <img src="/assets/icons/mail.svg" />
                          </span>
                          <InputText
                            className="b"
                            placeholder="Your Email Address"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <label className="form_labels inter-regular-14">
                        Password
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
                            placeholder="Your Password "
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-small-regular text-dark-2 text-right mt-3">
                <Link
                  to='/forgot-password'
                  onClick={() => { setState('forgot_password_form'); form.setValue('form_type', 'forgot_password_form') }}
                  className="text-main-bg-900 inter-regular-14 p-0"
                >
                  Forgot password?
                </Link>
              </p>
              <FormField
                control={form.control}
                name="staySignedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center align-middle mt-5">
                        <Checkbox
                          inputId="staySignedIn"
                          className="form_check"
                          checked={form.getValues("staySignedIn") === 'yes'}
                          onChange={(e) => {
                            const newValue = form.getValues("staySignedIn") === 'yes' ? 'no' : 'yes';
                            form.setValue("staySignedIn", newValue);
                            field.onChange(newValue);
                            console.log(form, form.getValues("staySignedIn") === 'yes')
                          }}
                        />

                        <label
                          htmlFor="staySignedIn"
                          className="ml-2 inter-regular-14 text-main-bg-900 "
                        >
                         Stay singed in for a week
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-main-bg-900 inter-regular-14 text-white mt-3 action_button h-10"
                disabled={isSigningIn || isUserLoading}
              >
                {isSigningIn ? (
                  <div className="flex-center gap-4">
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
              className="space-y-1 flex flex-col  w-full mt-4 form_container"
            >
              <div className="flex flex-col gap-5">
                <h1 className="text-main-bg-900 card_headings inter-regular-32 mb-5">{`${titles[state]}`}</h1>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <label className="form_labels inter-regular-14">
                        Email
                      </label>
                      <FormControl>
                        <div className="p-inputgroup flex-1 inter-regular-14 form_labels">
                          <span className="p-inputgroup-addon bg-white">
                            <img src="/assets/icons/mail.svg" />
                          </span>
                          <InputText
                            className="b"
                            placeholder="Your Email Address"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="bg-main-bg-900 inter-regular-14 text-white h-10 "
                  disabled={isSigningIn || isUserLoading}
                >
                  {isSigningIn ? (
                    <div className="flex-center gap-4">
                      <Loader />
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </div>
            </form>
          )}
          {state === "verify_account_form" && (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-1 flex flex-col  w-full mt-4 form_container"
            >
              <div className="flex flex-col gap-5">
                <h1 className="text-main-bg-900 card_headings inter-regular-32 mb-3">{`${titles[state]}`}</h1>
                <p className="form_labels inter-regular-14 font-medium">
                  Please, enter the verification code we sent to your mobile
                  phone number.
                </p>
                <FormField
                  control={form.control}
                  name="verification_code"
                  render={({ field }) => (
                    <FormItem>
                      <label className="form_labels inter-regular-14">
                        <div className="flex justify-between">
                          <span className="self-center">Verification Code</span>
                          <span className="flex gap-1">{!timerFinished ? (<><span className="self-center"><img src="/assets/icons/timer.png" /></span><span className="inter-regular-14"> {`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</span></>) : (<><span className="self-center"><img src="/assets/icons/clock-expired.svg" /></span><span className="inter-regular-14"> {`00:00`}</span></>)}</span>
                        </div>
                      </label>
                      <FormControl>
                        <div className="p-inputgroup flex-1 inter-regular-14 form_labels">
                          <span className="p-inputgroup-addon bg-white">
                            <img src="/assets/icons/mail.svg" />
                          </span>
                          <InputText
                            maxLength={6}
                            className="b"
                            placeholder="Enter verfication code "
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />
                {!timerFinished ? (<Button
                  type="submit"
                  className="bg-main-bg-900 inter-regular-14 text-white h-10 "
                  disabled={isSigningIn}
                >
                  {isSigningIn ? (
                    <div className="flex-center gap-4 h-10">
                      <Loader />
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>) : (
                  <Button
                    type="submit"
                    // onClick={(e) => {e.preventDefault();e.target.click}}
                    className="bg-main-bg-900 inter-regular-14 text-white h-10 "
                    disabled={isSigningIn}
                  >
                    {isSigningIn ? (
                      <div className="flex-center gap-4 h-10">
                        <Loader />
                      </div>
                    ) : (
                      "Generate Code"
                    )}
                  </Button>
                )}


              </div>
            </form>
          )}
        </Card>
      </div>
    </Form>
  );
};

export default SignInForm;
