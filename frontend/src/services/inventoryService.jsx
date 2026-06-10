import api from '../api/axios';

export const getInventoryLookups = async () => {
    const response = await api.get('/inventory/lookups/');
    return response.data;
};

export const getInventoryItems = async () => {
    const response = await api.get('/inventory/items/');
    return response.data;
};

export const getInventoryItemDetail = async (itemId) => {
    const response = await api.get(`/inventory/items/${itemId}/`);
    return response.data;
};

export const createInventoryItem = async (itemData) => {
    const response = await api.post('/inventory/items/', itemData);
    return response.data;
};

export const createItemUnit = async (itemId, unitData) => {
    const response = await api.post(`/inventory/items/${itemId}/units/`, unitData);
    return response.data;
};

export const updateItemSettings = async (itemId, settingsData) => {
    const response = await api.patch(`/inventory/items/${itemId}/settings/`, settingsData);
    return response.data;
};
