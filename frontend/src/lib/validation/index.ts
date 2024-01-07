import * as z from "zod";


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
    title: z.string(),
    content: z.string(),
    featuredImage: z.string(),
    categories: z.array(z.string()), 
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


