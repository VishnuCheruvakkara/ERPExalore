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

export const unitBarcodeSchema = z.object({
    selectedProductId: z.string().min(1, "Product is required"),
    unit: z.string().min(1, "Unit is required"),
    cofactor: z.coerce
        .number({ invalid_type_error: "Required" })
        .min(0.0001, "Must be greater than zero"),
    barcode: z.string()
        .min(1, "Barcode is required")
        .regex(/^\d+$/, "Must contain only numbers"),
    salesUnit: z.string().min(1, "Sales Unit is required"),
    stockUnit: z.string().min(1, "Stock Unit is required"),
});

export const priceListSchema = z.object({
    selectedProductId: z.string().min(1, "Product is required"),
    price_list_type: z.string().min(1, "Price Type is required"),
    unit: z.string().min(1, "Unit is required"),
    sale_price: z.coerce
        .number({ invalid_type_error: "Sale Price is required" })
        .gt(1, "Must be greater than 1"),
    minimum_selling_price: z.coerce
        .number({ invalid_type_error: "Min Selling Price is required" })
        .gt(1, "Must be greater than 1"),
}).refine((data) => data.minimum_selling_price <= data.sale_price, {
    message: "Min Selling Price cannot exceed Sale Price",
    path: ["minimum_selling_price"],
});

export const salesQuotationSchema = z.object({
    quotationNo: z.string().min(1, "Quotation No is required"),
    quotationTypeId: z.string().min(1, "Quotation Type is required"),
    date: z.string().min(1, "Date is required"),
    customerId: z.string().min(1, "Customer is required"),
    salesExecutiveId: z.string().optional().or(z.literal('')),
    currencyId: z.string().min(1, "Currency is required"),
    exRate: z.coerce.number().min(0.0001, "Exchange Rate must be greater than zero"),
    custRefNum: z.string().max(40, "Customer Ref No must be under 40 characters").optional().or(z.literal('')),
    attention: z.string().max(255, "Attention must be under 255 characters").optional().or(z.literal('')),
    payTerm: z.string().max(255, "Pay Term must be under 255 characters").optional().or(z.literal('')),
    deliveryPlace: z.string().max(255, "Delivery Place must be under 255 characters").optional().or(z.literal('')),
    notes: z.string().max(500, "Notes must be under 500 characters").optional().or(z.literal('')),
});

export const salesOrderSchema = z.object({
    soNo: z.string().min(1, "SO No is required"),
    orderTypeId: z.string().min(1, "Sales Order Type is required"),
    date: z.string().min(1, "Issue Date is required"),
    // Validation for validUntil:
    validUntil: z.string().min(1, "Valid Until is required").refine((val) => {
        const selectedDate = new Date(val);
        const today = new Date();
        // Reset time to midnight for accurate date-only comparison
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    }, {
        message: "Valid Until date must be today or in the future",
    }),
    customerId: z.string().min(1, "Customer is required"),
    salesExecutiveId: z.string().optional().or(z.literal('')),
    currencyId: z.string().min(1, "Currency is required"),
    exRate: z.coerce.number().min(0.0001, "Exchange Rate must be greater than zero"),
    customerPo: z.string().max(100, "Customer PO must be under 100 characters").optional().or(z.literal('')),
    quotationId: z.string().optional().or(z.literal('')),
    deliveryPlace: z.string().max(255, "Delivery Place must be under 255 characters").optional().or(z.literal('')),
    notes: z.string().max(500, "Notes must be under 500 characters").optional().or(z.literal('')),
});