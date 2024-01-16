import * as z from "zod";

const CustomFieldSchema = z.object({
    name: z.string(),
    type: z.string(),
    value: z.string(),
});
const CustomRepeaterFieldSchema = z.object({
    name: z.string(),
    type: z.string(),
    value: z.array(z.string()),
});
export const signUpValidationSchema = z.object({
    firstName: z.string().min(2, { message: "Too Short" }).max(50, 'Too big less than 50 character please'),
    lastName: z.string(),
    username: z.string().min(2, { message: "Too Short" }),
    email: z.string().email(),
    password: z.string().min(8, { message: "password must be of minimum 8 characters" }),
})
export const signInValidationSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "password must be of minimum 8 characters" }),
})
export const ProfileValidation = z.object({
    file: z.custom<File[]>(),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    username: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email(),
    bio: z.string(),
});

export const categoryFormSchema = z.object({
    id: z.string(),
    description: z.string(),
    postType: z.string(),
    slug: z.string(),
    parentCategory: z.string().optional(),
    name: z.string(),

})
export const postValidationSchema = z.object({
    caption: z.string().min(3, { message: "Too Short" }).max(2000, 'Too big less than 50 character please'),
    location: z.string().min(3, { message: "Too Short" }).max(2000, 'Too big less than 50 character please'),
    file: z.custom<File[]>(),
    tags: z.string(),
})

export const PostFormSchema = z.object({
    id: z.string(),
    domain: z.string(),
    post_type: z.string(),
    title: z.string().min(1),
    content: z.string().min(1),
    featuredImage: z.string(),
    categories: z.array(z.string()),
    customFields: z.array(CustomFieldSchema).optional(),
    customRepeaterFields: z.array(CustomRepeaterFieldSchema).optional(),
});

export const FieldSchema = z.object({
    name: z.string(),
    label: z.string(),
    variant: z.string(),
    field_type: z.string(),
    placeholder: z.string(),
});

export const CustomFormFieldSchema = z.object({
    id: z.string(),
    title: z.string(),
    post_type: z.string(),
    item_type:z.string(),
    customFields: z.array(FieldSchema).optional(),
});

export const mediaEditFormSchema = z.object({
    id: z.string(),
    caption: z.string().min(0, { message: "Too Short" }).max(2000, 'Too big less than 50 character please'),
    alt_text: z.string().min(0, { message: "Too Short" }).max(2000, 'Too big less than 50 character please'),
    description: z.string().min(0, { message: "Too Short" }).max(2000, 'Too big less than 50 character please'),
    filename: z.string(),
    category: z.string(),
    tags: z.string(),
    title: z.string(),
})

export const navItemFormSchema = z.object({
    id: z.string(),
    route: z.string(),
    imgUrl: z.string(),
    type: z.string(),
    label: z.string().min(0, { message: "Too Short" }).max(2000, 'Too big less than 50 character please'),
    enabled: z.boolean(),
    category: z.boolean(),
    subcategory: z.string().optional(),
})

