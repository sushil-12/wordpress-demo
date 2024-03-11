import React, { useState } from 'react'
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { PostFormSchema, quickEditFormSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Dropdown } from 'primereact/dropdown';


const QuickEditForm = () => {
    const [status, setStatus] = useState(null);
    const [date, setDate] = useState(null);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);
    const [day, setDay] = useState(null);
    const dropdownStatus = [
        { name: 'Published', code: 'published' },
        { name: 'Draft', code: 'draft' },
        { name: 'Trash', code: 'trash' },
        { name: 'Archived', code: 'archived' },
    ];
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Novr", "Dec"
    ];

    const dropdownOptions = months.map((month, index) => ({ label: month, value: index + 1 }));

    const form = useForm<z.infer<typeof quickEditFormSchema>>({
        resolver: zodResolver(quickEditFormSchema),
        defaultValues: {
            id: '',
            title: '',
            status: '',
            month: '',
            day: '',
            year: '',
            time: '',
        },
    });
    return (
        <div className='p-2.5   border bottom-1'>
            <h6 className='mb-2.5 text-sm leading-[20px] font-medium'>QUCK EDIT</h6>
            <Form {...form}>
                <div className="">

                    <form
                        className=""
                    >
                        <div className="form_data flex flex-col gap-2.5 ">
                            <div className="flex gap-[23px]">
                                <FormField
                                    control={form.control}
                                    name="status"
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
                                    name="title"

                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Dropdown value={status} onChange={(e) => setStatus(e.value)} options={dropdownStatus} optionLabel="name"
                                                    placeholder="Select" className="shad-input w-[151px]" />
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>

                                    )}
                                />

                            </div>
                            <FormField
                                control={form.control}
                                name="slug"
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
                            <div className="flex gap-2.5 items-center">
                                <FormField
                                    control={form.control}
                                    name="month"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Dropdown value={date} onChange={(e) => setMonth(e.value)} options={dropdownOptions} optionLabel="label"
                                                    placeholder="Jan" className="shad-input w-[91px] text-[12px]" />
                                            </FormControl>
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
                                                    className="shad-input w-[43px]"
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
                                                    className="shad-input w-[56px]"
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
                            <Button type="submit" className="shad-button_primary w-[64px] text-xs font-medium   self-end mt-2.5" >
                                Update
                            </Button>
                            <Button type="submit" className="bg-light-1 rounded flex text-main-bg-900 text-xs font-medium mt-2.5 items-center w-[64px]  border-main-bg-900 border" onClick={() => event?.preventDefault()} >
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
