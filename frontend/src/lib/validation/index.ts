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
    email: z.string(),
    password: z.string(),
    staySignedIn: z.string(),
    verification_code: z.string(),
    form_type: z.string(),
})
export const loginInValidationSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "password must be of minimum 8 characters" }),
    staySignedIn: z.string(),
    verification_code: z.string(),
    form_type: z.string(),
})

export const verifyAccount = z.object({
    email: z.string(),
    password: z.string(),
    staySignedIn: z.string(),
    verification_code: z.string().min(6, { message: "Verification Code must be of minimum 6 characters" }),
    form_type: z.string(),
})

export const forgotPassword = z.object({
    email: z.string().email(),
    password: z.string(),
    staySignedIn: z.string(),
    verification_code: z.string(),
    form_type: z.string(),
})

export const resetPasswordValidationSchema = z.object({
    password: z.string().min(8, { message: "New Password must be of minimum 8 characters" }),
    confirm_password: z.string().min(8, { message: "Confirm Password must be of minimum 8 characters" }),
    reset_token: z.string(),
    form_type: z.string(),
}).superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        path: ["confirm_password"],
        message: "The passwords did not match"
      });
    };
});

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
    item_type: z.string(),
    customFields: z.array(FieldSchema).optional(),
});

export const editProfileFieldSchema = z.object({
    id: z.string(),
    name: z.string(),
    bio: z.string(),
    profile_pic:z.optional(z.custom<File>()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string())
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

const subNavItemSchema = z.object({
    name:  z.string().min(1, { message: "Too Short" }).max(50).refine(value => value.length <= 50, {
        message: 'Too big, less than 50 characters please',
        path: ['label'],
    }),
    route: z.string(),
    imgUrl: z.string(),
});

export const navItemFormSchema = z.object({
    id: z.string(),
    route: z.string(),
    domain: z.string(),
    type: z.string(),
    place_after: z.string(),
    label: z.string().min(1, { message: "Too Short" }).max(50).refine(value => value.length <= 50, {
        message: 'Too big, less than 50 characters please',
        path: ['label'],
    }),
    enabled: z.boolean(),
    category: z.optional(z.string()),
    // subcategory: z.array(subNavItemSchema),
});

export const commonNavSchema = z.object({
    id: z.optional(z.string()),
    route: z.string(),
    label: z.string().min(1, { message: "Too Short" }).max(50).refine(value => value.length <= 50, {
        message: 'Too big, less than 50 characters please',
        path: ['label'],
    }),
});

export const svgUploader = z.object({
    name:  z.string().min(1, { message: "Too Short" }).max(12).refine(value => value.length <= 12, {
        message: 'Too big, less than 12 characters please',
        path: ['name'],
    }),
    code: z.string().min(50, { message: "Please enter valid Svg code" }),
});

