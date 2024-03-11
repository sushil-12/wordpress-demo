import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { PostFormSchema, quickEditFormSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from '@/components/ui/button';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { quickEditPostById } from '@/lib/appwrite/api';
import { useQuickEditPostById } from '@/lib/react-query/queriesAndMutations';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from '@/components/ui/checkbox';

const QuickEditForm = ({ setIsQuickEditForm, rowData }) => {
    const currentMonthIndex = new Date().getMonth();
    const [time, setTime] = useState(null);
    const { mutateAsync: quickEditPostById, isPending: isLoading } = useQuickEditPostById();
    const { toast } = useToast();

    const dropdownStatus = [
        { name: 'Published', code: 'published' },
        { name: 'Draft', code: 'draft' },
        { name: 'Trash', code: 'trash' },
        { name: 'Archived', code: 'archived' },
    ];
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const dropdownOptions = months.map((month, index) => ({ code: month, name: month }));

    const form = useForm<z.infer<typeof quickEditFormSchema>>({
        resolver: zodResolver(quickEditFormSchema),
        defaultValues: {
            id: rowData?.id,
            title: rowData?.title || '',
            status: rowData?.status || '',
            slug: rowData?.slug || '',
            month: '',
            day: '',
            year: '',
            time: '',
            sticky: false
        },
    });
    
    useEffect(() => {
       
    }, []);

    async function onSubmit(values: z.infer<typeof quickEditFormSchema>) {
        console.log(rowData?.id, values);
        const createOrEditPostResponse = await quickEditPostById({ post_id: rowData.id, postData: values });
        console.log(createOrEditPostResponse);
        if (!createOrEditPostResponse) {
            return toast({ variant: "destructive", description: "Edit Failed" })
        }
        if (createOrEditPostResponse?.code === 200 || createOrEditPostResponse?.code === 201) {
            const message = createOrEditPostResponse?.code === 200 ? 'Successfully Updated Post' : 'Successfully Created Post';
            return toast({ variant: 'default', description: message });
        } else {
            return toast({ variant: 'default', description: 'Something went wrong' });
        }

    }

    return (
        <div className='pt-8'>
            <h6 className='mb-2.5 text-sm leading-[20px] font-medium'>QUICK EDIT</h6>
            <Form {...form}>
                <div className="">

                    <form
                        className=""
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="form_data flex flex-col gap-2.5 ">
                            <div className="flex gap-[23px]">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    className="shad-input w-[320px]"
                                                    placeholder="Enter title"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>

                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-[151px]">
                                                        <SelectValue placeholder={dropdownOptions[currentMonthIndex].name} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {dropdownStatus.map((option) => (
                                                            <SelectItem key={option.code} value={option.code}>{option.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>
                                    )}
                                />

                            </div>
                            <div className="flex gap-[23px] items-center">
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    className="shad-input w-[320px]"
                                                    placeholder="Enter slug"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>

                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sticky"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="flex align-items-center gap-[8px] w-[200px]">
                                                    <input
                                                        type="checkbox"
                                                        id="sticky"
                                                        name="sticky"
                                                        onChange={(e) => {
                                                            form.setValue('sticky', e.target.checked);
                                                        }}
                                                        width={"16px"}
                                                        height={"16px"}
                                                        checked={form.getValues('sticky')}
                                                    />
                                                    <label htmlFor="sticky" className="text-sm font-medium leading-[20px]">
                                                        Make this interview sticky
                                                    </label>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex gap-2.5 items-center">
                                <FormField
                                    control={form.control}
                                    name="month"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormField
                                                control={form.control}
                                                name="month"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                                <SelectTrigger className="w-[91px]">
                                                                    <SelectValue placeholder="" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {dropdownOptions.map((option) => (
                                                                        <SelectItem onChange={() => { }} key={option.code} value={option.code.toString()}>
                                                                            {option.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage className="shad-form_message" />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>

                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="day"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    className="w-[45px]"
                                                    placeholder="00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>

                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="year"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    className="shad-input text-sm w-[60px]"
                                                    placeholder="2024"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>

                                    )}
                                />
                                at
                                <FormField
                                    control={form.control}
                                    name="time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    className="shad-input w-[78px]"
                                                    placeholder="00:00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>

                                    )}
                                />
                            </div>

                        </div>

                        <div className="flex gap-2.5">
                            <Button type="submit" className="shad-button_primary w-[64px] h-[33px] text-xs font-medium   self-end mt-2.5" >
                                Update
                            </Button>
                            <Button type="submit" className="bg-light-1 rounded flex  h-[33px] text-main-bg-900 text-xs font-medium mt-2.5 items-center w-[64px]  border-main-bg-900 border" onClick={() => { event?.preventDefault(); setIsQuickEditForm(false); console.log(setIsQuickEditForm) }} >
                                Cancel
                            </Button>
                        </div>


                    </form>
                </div>
            </Form>
        </div>
    );

}

export default QuickEditForm
