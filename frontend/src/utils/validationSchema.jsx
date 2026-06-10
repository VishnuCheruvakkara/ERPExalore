import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Enter a valid email"),

  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const itemValidationSchema = z.object({
    // Text Inputs
    item_code: z
        .string()
        .min(1, 'Item Code is required')
        .max(50, 'Item Code must be under 50 characters'),
    name_1: z
        .string()
        .min(1, 'Name 1 is required')
        .max(100, 'Name 1 must be under 100 characters'),
    name_2: z
        .string()
        .max(100, 'Name 2 must be under 100 characters')
        .optional()
        .or(z.literal('')),
    generic_name: z
        .string()
        .max(100, 'Generic Name must be under 100 characters')
        .optional()
        .or(z.literal('')),
    description: z
        .string()
        .max(500, 'Description must be under 500 characters')
        .optional()
        .or(z.literal('')),

    // Configuration Dropdowns (Enums & Required strings)
    behaviour: z.enum(['purchase_item', 'sales_item', 'inventory_item'], {
        errorMap: () => ({ message: 'Please select a valid item behaviour' }),
    }),
    
    // Group Code requires a selection (cannot be an empty string "")
    group_code: z
        .string()
        .min(1, 'Please select an Item Group'),
        
    taxable_status: z.enum(['non_taxable', 'taxable'], {
        errorMap: () => ({ message: 'Please select a taxable status' }),
    }),

    // Optional Dropdowns (Can remain unselected/empty strings)
    shelf_code: z
        .string()
        .optional()
        .or(z.literal('')),
    manufacturer: z
        .string()
        .optional()
        .or(z.literal('')),
});