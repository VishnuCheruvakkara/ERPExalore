import api from '../api/axios';

// Load all dropdown data for the Sales Quotation form
export const getSalesQuotationLookups = async () => {
    const response = await api.get('/sales/lookups/');
    return response.data;
};

// Get the next auto-generated quotation number
export const getNextQuotationNo = async () => {
    const response = await api.get('/sales/quotations/next-number/');
    return response.data;
};

// Save a new Sales Quotation with its line items
export const createSalesQuotation = async (quotationData) => {
    const response = await api.post('/sales/quotations/', quotationData);
    return response.data;
};

// Load all dropdown data for the Sales Order form
export const getSalesOrderLookups = async () => {
    const response = await api.get('/sales/orders/lookups/');
    return response.data;
};

// Get the next auto-generated sales order number
export const getNextSalesOrderNo = async () => {
    const response = await api.get('/sales/orders/next-number/');
    return response.data;
};

// Save a new Sales Order with its line items
export const createSalesOrder = async (orderData) => {
    const response = await api.post('/sales/orders/', orderData);
    return response.data;
};

// Get details of a single Sales Quotation by ID
export const getSalesQuotationDetails = async (id) => {
    const response = await api.get(`/sales/quotations/${id}/`);
    return response.data;
};

// Get details of a single Sales Order by ID
export const getSalesOrderDetails = async (id) => {
    const response = await api.get(`/sales/orders/${id}/`);
    return response.data;
};
