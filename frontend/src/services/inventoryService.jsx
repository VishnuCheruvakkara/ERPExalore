import api from '../api/axios';

// Get datas for general tab drop down
export const getInventoryLookups = async () => {
    const response = await api.get('/inventory/lookups/');
    return response.data;
};

// Save Items
export const createInventoryItem = async (itemData) => {
    const response = await api.post('/inventory/items/', itemData);
    return response.data;
};

// Get inventory data for Units and Barcode section drop down
export const getInventoryItems = async () => {
    const response = await api.get('/inventory/items/simple/');
    return response.data;
};

// Save product unit
export const addProductUnit = async (unitData) => {
    const response = await api.post('/inventory/units/', unitData);
    return response.data;
};

// Get saved units for selected item
export const getItemUnits = async (itemId) => {
    const response = await api.get(`/inventory/items/${itemId}/units/`);
    return response.data;
};

// Update/Edit the item unit data
export const updateProductUnit = async (unitId, unitData) => {
    const response = await api.patch(`/inventory/units/${unitId}/`, unitData);
    return response.data;
};

// Delete the item unit data
export const deleteProductUnit = async (unitId) => {
    const response = await api.delete(`/inventory/units/${unitId}/`);
    return response.data;
};

// Update Item unit settings 
export const updateItemUnitSettings = async (itemId, unitData) => {
    const response = await api.patch(`/inventory/items/${itemId}/unit-settings/`, unitData);
    return response.data;
};

// Save product price
export const addProductPrice = async (priceData) => {
    const response = await api.post('/inventory/prices/', priceData);
    return response.data;
};

// Get saved prices for selected item
export const getItemPrices = async (itemId) => {
    const response = await api.get(`/inventory/items/${itemId}/prices/`);
    return response.data;
};

// Update/Edit the item price data
export const updateProductPrice = async (priceId, priceData) => {
    const response = await api.patch(`/inventory/prices/${priceId}/`, priceData);
    return response.data;
};

// Delete the item price data
export const deleteProductPrice = async (priceId) => {
    const response = await api.delete(`/inventory/prices/${priceId}/`);
    return response.data;
};

// Upload product photo
export const uploadProductPhoto = async (formData) => {
    const response = await api.post('/inventory/items/upload-photo/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Delete product photo
export const deleteProductPhoto = async (itemId) => {
    const response = await api.delete('/inventory/items/upload-photo/', {
        data: { item_id: itemId }
    });
    return response.data;
};
