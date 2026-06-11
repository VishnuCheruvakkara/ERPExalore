import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { priceListSchema } from '../../../utils/validationSchema';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

import FormInput from '../../../components/ui/FormInput';
import FormSelect from '../../../components/ui/FormSelect';
import FormButton from '../../../components/ui/FormButton';
import {
    getInventoryItems,
    getItemPrices,
    addProductPrice,
    updateProductPrice,
    deleteProductPrice,
    getItemUnits,
} from '../../../services/inventoryService';
import { PRICE_TYPE_OPTIONS } from '../../../constants/itemOptions';

export function PriceListTab() {
    const [items, setItems] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
    const [isProductLocked, setIsProductLocked] = useState(false);
    const [itemPrices, setItemPrices] = useState([]);
    const [itemUnits, setItemUnits] = useState([]);
    const [editingPriceId, setEditingPriceId] = useState(null);

    const {
        register,
        control,
        reset,
        trigger,
        getValues,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(priceListSchema),
        defaultValues: {
            selectedProductId: '',
            price_list_type: 'RETAIL',
            unit: '',
            sale_price: 0,
            minimum_selling_price: 0,
        },
    });

    const selectedProductId = useWatch({ control, name: 'selectedProductId' });

    const fetchInventoryData = async () => {
        try {
            const data = await getInventoryItems();
            setItems(data.items);
            setUnitTypes(data.unit_types || []);
            return data;
        } catch (error) {
            console.error('Failed to fetch inventory data:', error);
            return { items: [], unit_types: [] };
        }
    };

    useEffect(() => {
        fetchInventoryData();
    }, []);

    const fetchItemPricesAndUnits = async (itemId) => {
        try {
            const [pricesData, unitsData] = await Promise.all([
                getItemPrices(itemId),
                getItemUnits(itemId),
            ]);
            setItemPrices(pricesData);
            setItemUnits(unitsData.units || unitsData);
        } catch (error) {
            console.error('Failed to fetch item prices or units:', error);
            toast.error('Failed to load item data');
        }
    };

    const handleClear = () => {
        reset({
            selectedProductId: '',
            price_list_type: 'RETAIL',
            unit: '',
            sale_price: 0,
            minimum_selling_price: 0,
        });
        setIsProductLocked(false);
        setItemPrices([]);
        setItemUnits([]);
        setEditingPriceId(null);
    };

    const handleLockProduct = async () => {
        const isValid = await trigger('selectedProductId');
        const prodId = getValues('selectedProductId') || selectedProductId;
        if (!prodId) {
            toast.error('Please select a product before locking');
            return;
        }

        if (isValid) {
            try {
                await fetchItemPricesAndUnits(prodId);
                setIsProductLocked(true);
                toast.success('Product locked and prices loaded');
            } catch (err) {
                console.error('Error locking product:', err);
                setIsProductLocked(false);
            }
        } else {
            toast.error('Please fix the errors');
        }
    };

    const handleEditPrice = (price) => {
        setEditingPriceId(price.id);
        setValue('price_list_type', price.price_list_type);
        setValue('unit', String(price.unit));
        setValue('sale_price', price.sale_price);
        setValue('minimum_selling_price', price.minimum_selling_price);
    };

    const handleCancelEdit = () => {
        setEditingPriceId(null);
        setValue('price_list_type', 'RETAIL');
        setValue('unit', '');
        setValue('sale_price', 0);
        setValue('minimum_selling_price', 0);
    };

    const handleDeletePrice = async (priceId) => {
        try {
            await deleteProductPrice(priceId);
            toast.success('Price deleted successfully.');
            const prodId = getValues('selectedProductId') || selectedProductId;
            if (prodId) {
                await fetchItemPricesAndUnits(prodId);
            }
        } catch (error) {
            console.error('Failed to delete price:', error);
            toast.error('Unable to delete price.');
        }
    };

    const handleAddPrice = async () => {
        const isValid = await trigger(['price_list_type', 'unit', 'sale_price', 'minimum_selling_price']);
        const prodId = getValues('selectedProductId') || selectedProductId;

        if (!prodId) {
            toast.error('Please lock a product first');
            return;
        }

        if (isValid) {
            const values = getValues();
            const payload = {
                item: prodId,
                price_list_type: values.price_list_type,
                unit: values.unit,
                sale_price: Number(values.sale_price),
                minimum_selling_price: Number(values.minimum_selling_price),
            };

            try {
                if (editingPriceId) {
                    await updateProductPrice(editingPriceId, payload);
                    toast.success('Price updated successfully.');
                } else {
                    await addProductPrice(payload);
                    toast.success('Price saved successfully.');
                }

                await fetchItemPricesAndUnits(prodId);
                handleCancelEdit();
            } catch (error) {
                console.error('Failed to save product price:', error);
                const rawMsg = error?.response?.data?.non_field_errors?.[0] || '';
                if (rawMsg.toLowerCase().includes('unique')) {
                    toast.error('A price entry with this Price Type and Unit already exists for this product.');
                } else {
                    toast.error(rawMsg || 'Unable to save price. Please try again.');
                }
            }
        } else {
            toast.error('Please fix the errors');
        }
    };



    return (
        <div className="w-full space-y-4 rounded-md p-2 bg-white">
            {/* Product Selection Section */}
            <div className="bg-white rounded-md border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200/60 px-4 py-2">
                    <h3 className="text-xs font-bold text-slate-800 tracking-wide">
                        Product Selection
                    </h3>
                </div>

                <div className="p-4 flex flex-col md:flex-row gap-4 items-end">
                    <div className="relative flex-1 w-full pb-6">
                        <FormSelect
                            label="Product"
                            className="w-full disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isProductLocked}
                            required
                            {...register('selectedProductId')}
                        >
                            <option value="">Select product</option>
                            {items.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.item_code} - {item.name_1}
                                </option>
                            ))}
                        </FormSelect>
                        {errors.selectedProductId && (
                            <p className="absolute bottom-0 left-0 text-red-500 text-[10px] leading-tight whitespace-nowrap">
                                {errors.selectedProductId.message}
                            </p>
                        )}
                    </div>

                    <div className="relative flex flex-col pb-6">
                        <FormButton
                            variant="primary"
                            className="h-8.5 disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={handleLockProduct}
                            disabled={!selectedProductId || isProductLocked}
                        >
                            Lock Product
                        </FormButton>
                    </div>
                </div>
            </div>

            {/* Price Management Section */}
            <div className="bg-white rounded-md border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200/60 px-4 py-2">
                    <h3 className="text-xs font-bold text-slate-800 tracking-wide">
                        Price Management
                    </h3>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="relative pb-4">
                        <FormSelect
                            label="Price Type"
                            disabled={!isProductLocked}
                            required
                            {...register('price_list_type')}
                        >
                            {PRICE_TYPE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </FormSelect>
                        {errors.price_list_type && (
                            <p className="absolute bottom-0 left-0 text-red-500 text-[10px] leading-tight whitespace-nowrap">
                                {errors.price_list_type.message}
                            </p>
                        )}
                    </div>

                    <div className="relative pb-4">
                        <FormSelect
                            label="Unit"
                            disabled={!isProductLocked}
                            required
                            {...register('unit')}
                        >
                            <option value="">Select unit</option>
                            {unitTypes.map((u) => (
                                <option key={u.id} value={String(u.id)}>
                                    {u.name ? `${u.name} (${u.code})` : u.code}
                                </option>
                            ))}
                        </FormSelect>
                        {errors.unit && (
                            <p className="absolute bottom-0 left-0 text-red-500 text-[10px] leading-tight whitespace-nowrap">
                                {errors.unit.message}
                            </p>
                        )}
                    </div>

                    <div className="relative pb-4">
                        <FormInput
                            label="Sale Price"
                            type="number"
                            step="0.01"
                            disabled={!isProductLocked}
                            required
                            {...register('sale_price')}
                        />
                        {errors.sale_price && (
                            <p className="absolute bottom-0 left-0 text-red-500 text-[10px] leading-tight whitespace-nowrap">
                                {errors.sale_price.message}
                            </p>
                        )}
                    </div>

                    <div className="relative pb-4">
                        <FormInput
                            label="Min Selling Price"
                            type="number"
                            step="0.01"
                            disabled={!isProductLocked}
                            required
                            {...register('minimum_selling_price')}
                        />
                        {errors.minimum_selling_price && (
                            <p className="absolute bottom-0 left-0 text-red-500 text-[10px] leading-tight whitespace-nowrap">
                                {errors.minimum_selling_price.message}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2 pb-4">
                        <FormButton
                            variant="primary"
                            disabled={!isProductLocked}
                            onClick={handleAddPrice}
                            className="flex-1 h-8.5"
                        >
                            {editingPriceId ? 'Update' : 'Add Price'}
                        </FormButton>
                        {editingPriceId && (
                            <FormButton
                                variant="secondary"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </FormButton>
                        )}
                    </div>
                </div>

                {/* Saved Prices Table */}
                <div className="px-4 pb-4">
                    {itemPrices.length > 0 ? (
                        <div className="overflow-x-auto border rounded-sm border-slate-100">
                            <table className="min-w-full text-left text-xs">
                                <thead className="bg-slate-50/50">
                                    <tr className="border-b border-slate-200 text-slate-700">
                                        <th className="py-2.5 px-4 font-bold tracking-wide uppercase text-[10px]">Type</th>
                                        <th className="py-2.5 px-4 font-bold tracking-wide uppercase text-[10px]">Unit</th>
                                        <th className="py-2.5 px-4 font-bold tracking-wide uppercase text-[10px]">Sale Price</th>
                                        <th className="py-2.5 px-4 font-bold tracking-wide uppercase text-[10px]">Min Price</th>
                                        <th className="py-2.5 px-4 font-bold tracking-wide uppercase text-[10px] text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {itemPrices.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.price_list_type === 'RETAIL' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                    {p.price_list_type}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-medium text-slate-600">
                                                {p.unit_detail?.code || p.unit}
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-slate-700">
                                                {p.sale_price}
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-slate-700">
                                                {p.minimum_selling_price}
                                            </td>
                                            <td className="py-3 px-4 flex justify-center gap-3">
                                                <button
                                                    onClick={() => handleEditPrice(p)}
                                                    className="text-blue-500 hover:text-blue-700 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePrice(p.id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="border border-dashed border-slate-200 rounded-md p-8 text-center text-xs text-slate-400 font-medium bg-slate-50/30">
                            No prices configured for this product
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end items-center gap-2 pt-2 border-t border-slate-100">
                <FormButton variant="secondary" onClick={handleClear}>
                    Clear
                </FormButton>
            </div>
        </div>
    );
}