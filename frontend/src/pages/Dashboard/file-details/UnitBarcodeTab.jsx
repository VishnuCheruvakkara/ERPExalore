import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { unitBarcodeSchema } from '../../../utils/validationSchema';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

import FormInput from '../../../components/ui/FormInput';
import FormSelect from '../../../components/ui/FormSelect';
import FormButton from '../../../components/ui/FormButton';
import {
    getInventoryItems,
    addProductUnit,
    getItemUnits,
    updateProductUnit,
    deleteProductUnit,
    updateItemUnitSettings,
} from '../../../services/inventoryService';

export function UnitBarcodeTab() {
    const [items, setItems] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
    const [isProductLocked, setIsProductLocked] = useState(false);
    const [itemUnits, setItemUnits] = useState([]);
    const [editingUnitId, setEditingUnitId] = useState(null);

    const {
        register,
        control,
        reset,
        trigger,
        getValues,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(unitBarcodeSchema),
        defaultValues: {
            selectedProductId: '',
            unit: '',
            cofactor: 1,
            barcode: '',
            salesUnit: '',
            stockUnit: '',
        },
    });

    const selectedProductId = useWatch({ control, name: 'selectedProductId' });

    const fetchInventoryData = async () => {
        try {
            const data = await getInventoryItems();
            setItems(data.items);
            setUnitTypes(data.unit_types);
            return data;
        } catch (error) {
            console.error('Failed to fetch inventory data:', error);
            return { items: [], unit_types: [] };
        }
    };

    useEffect(() => {
        const loadInventory = async () => {
            await fetchInventoryData();
        };
        loadInventory();
    }, []);

    const fetchItemUnits = async (itemId) => {
        try {
            const data = await getItemUnits(itemId);
            setItemUnits(data.units || data);
        } catch (error) {
            console.error('Failed to fetch item units:', error);
        }
    };

    const handleClear = () => {
        reset({
            selectedProductId: '',
            unit: '',
            cofactor: 1,
            barcode: '',
            salesUnit: '',
            stockUnit: '',
        });
        setIsProductLocked(false);
        setItemUnits([]);
        setEditingUnitId(null);
    };

    const handleLockProduct = async () => {
        const isValid = await trigger('selectedProductId');
        const prodId = getValues('selectedProductId') || selectedProductId;
        if (!prodId) {
            toast.error('Please select a product before locking');
            return;
        }

        if (isValid) {
            let selected = items.find((item) => String(item.id) === String(prodId));
            if (!selected) {
                const refreshed = await fetchInventoryData();
                selected = refreshed.items.find((item) => String(item.id) === String(prodId));
                if (!selected) {
                    toast.error('Selected product not found');
                    return;
                }
            }

            try {
                await fetchItemUnits(prodId);

                setValue(
                    'salesUnit',
                    selected.sales_unit ? String(selected.sales_unit) : '',
                );
                setValue(
                    'stockUnit',
                    selected.stock_unit ? String(selected.stock_unit) : '',
                );

                setIsProductLocked(true);
                toast.success('Product locked units and settings loaded');
            } catch (err) {
                console.error('Error loading units on lock:', err);
                toast.error('Failed to load units for selected product');
                setIsProductLocked(false);
            }
        } else {
            toast.error('Please fix the errors');
        }
    };

    const handleEditUnit = (unit) => {
        setEditingUnitId(unit.id);
        reset({
            selectedProductId: String(selectedProductId),
            unit: String(unit.unit),
            cofactor: Number(unit.cofactor),
            barcode: unit.barcode || '',
            salesUnit: getValues('salesUnit'),
            stockUnit: getValues('stockUnit'),
        });
    };

    const handleCancelEdit = () => {
        setEditingUnitId(null);
        reset({
            selectedProductId: String(selectedProductId),
            unit: '',
            cofactor: 1,
            barcode: '',
            salesUnit: getValues('salesUnit'),
            stockUnit: getValues('stockUnit'),
        });
    };

    const handleDeleteUnit = async (unitId) => {
        try {
            await deleteProductUnit(unitId);
            toast.success('Unit deleted successfully.');
            const prodId = getValues('selectedProductId') || selectedProductId;
            if (prodId) {
                await fetchItemUnits(prodId);
            }
        } catch (error) {
            console.error('Failed to delete unit:', error);
            const msg =
                error?.response?.data?.detail ||
                'Unable to delete unit. Please try again.';
            toast.error(msg);
        }
    };

    const handleAddUnit = async () => {
        const isValid = await trigger(['unit', 'cofactor', 'barcode']);
        const prodId = getValues('selectedProductId') || selectedProductId;

        if (!prodId) {
            toast.error('Please lock a product first');
            return;
        }

        if (isValid) {
            const { unit, cofactor, barcode } = getValues();
            try {
                if (editingUnitId) {
                    await updateProductUnit(editingUnitId, {
                        item: prodId,
                        unit,
                        cofactor: Number(cofactor),
                        barcode,
                    });
                    toast.success('Unit updated successfully.');
                } else {
                    await addProductUnit({
                        item: prodId,
                        unit,
                        cofactor: Number(cofactor),
                        barcode,
                    });
                    toast.success('Unit saved successfully.');
                }

                await fetchItemUnits(prodId);
                setEditingUnitId(null);

                setValue('unit', '');
                setValue('cofactor', 1);
                setValue('barcode', '');
            } catch (error) {
                console.error('Failed to save product unit:', error);
                const rawMsg =
                    error?.response?.data?.non_field_errors?.[0] ||
                    error?.response?.data?.detail ||
                    '';
                if (rawMsg.toLowerCase().includes('unique')) {
                    toast.error('This unit is already added for the selected product. Please select another unit.');
                } else {
                    toast.error(rawMsg || 'Unable to save unit. Please try again.');
                }
            }
        } else {
            toast.error('Please fix the errors');
        }
    };

    const handleSaveSettings = async () => {
        const isValid = await trigger(['salesUnit', 'stockUnit']);
        const prodId = getValues('selectedProductId');

        if (!prodId) {
            toast.error('Please lock a product first');
            return;
        }

        if (isValid) {
            const { salesUnit, stockUnit } = getValues();
            try {
                await updateItemUnitSettings(prodId, {
                    sales_unit: salesUnit,
                    stock_unit: stockUnit,
                });
                await fetchInventoryData();

                toast.success('Unit settings updated successfully');
            } catch (error) {
                console.error('Failed to save settings:', error);
                const msg =
                    error?.response?.data?.detail ||
                    'Failed to update settings';
                toast.error(msg);
            }
        } else {
            toast.error('Please select both sales and stock units');
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
                            <p className="absolute bottom-0 left-0 text-red-500 text-xs leading-tight whitespace-nowrap">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Unit Management Section */}
                <div className="lg:col-span-2 bg-white rounded-md border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
                    <div>
                        <div className="bg-slate-50 border-b border-slate-200/60 px-4 py-2">
                            <h3 className="text-xs font-bold text-slate-800 tracking-wide">
                                Unit Management
                            </h3>
                        </div>

                        <div className="p-4 flex flex-wrap gap-4 items-end">
                            <div className="relative flex-1 min-w-50 pb-6">
                                <FormSelect
                                    label="Unit"
                                    className="w-full disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={!isProductLocked}
                                    required
                                    {...register('unit')}
                                >
                                    <option value="">Select unit</option>
                                    {unitTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name
                                                ? `${type.name} (${type.code})`
                                                : type.code}
                                        </option>
                                    ))}
                                </FormSelect>
                                {errors.unit && (
                                    <p className="absolute bottom-0 left-0 text-red-500 text-xs leading-tight whitespace-nowrap">
                                        {errors.unit.message}
                                    </p>
                                )}
                            </div>

                            <div className="relative w-40 pb-6">
                                <FormInput
                                    label="Cofactor"
                                    type="number"
                                    className="w-full disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={!isProductLocked}
                                    required
                                    {...register('cofactor')}
                                />
                                {errors.cofactor && (
                                    <p className="absolute bottom-0 left-0 text-red-500 text-xs leading-tight whitespace-nowrap">
                                        {errors.cofactor.message}
                                    </p>
                                )}
                            </div>

                            <div className="relative w-48 pb-6">
                                <FormInput
                                    label="Barcode"
                                    className="w-full disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={!isProductLocked}
                                    required
                                    {...register('barcode')}
                                />
                                {errors.barcode && (
                                    <p className="absolute bottom-0 left-0 text-red-500 text-xs leading-tight whitespace-nowrap">
                                        {errors.barcode.message}
                                    </p>
                                )}
                            </div>

                            <div className="relative flex flex-col pb-6">
                                <div className="flex items-center gap-2">
                                    <FormButton
                                        disabled={!isProductLocked}
                                        className="h-8.5 px-4 min-w-22.5 disabled:cursor-not-allowed disabled:opacity-60"
                                        onClick={handleAddUnit}
                                    >
                                        {editingUnitId
                                            ? 'Save Changes'
                                            : '+ Add Unit'}
                                    </FormButton>
                                    {editingUnitId && (
                                        <FormButton
                                            variant="secondary"
                                            className="h-8.5 px-4 disabled:cursor-not-allowed disabled:opacity-60"
                                            onClick={handleCancelEdit}
                                        >
                                            Cancel
                                        </FormButton>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="px-4 pb-4">
                            {itemUnits.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-slate-700">
                                                <th className="py-2 px-3 font-semibold">
                                                    Unit
                                                </th>
                                                <th className="py-2 px-3 font-semibold">
                                                    Cofactor
                                                </th>
                                                <th className="py-2 px-3 font-semibold">
                                                    Barcode
                                                </th>
                                                <th className="py-2 px-3 font-semibold text-center">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {itemUnits.map((unitRow) => (
                                                <tr
                                                    key={unitRow.id}
                                                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                                >
                                                    <td className="py-2 px-3">
                                                        {unitRow.unit_detail
                                                            ? `${unitRow.unit_detail.name || unitRow.unit_detail.code} (${unitRow.unit_detail.code})`
                                                            : unitRow.unit}
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        {unitRow.cofactor}
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        {unitRow.barcode || '-'}
                                                    </td>
                                                    <td className="py-2 px-3 flex justify-center gap-3">
                                                        <button
                                                            type="button"
                                                            className="text-blue-500 hover:text-blue-700 transition-colors"
                                                            onClick={() =>
                                                                handleEditUnit(
                                                                    unitRow,
                                                                )
                                                            }
                                                            title="Edit Unit"
                                                        >
                                                            <FiEdit2
                                                                size={16}
                                                            />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="text-red-500 hover:text-red-700 transition-colors"
                                                            onClick={() =>
                                                                handleDeleteUnit(
                                                                    unitRow.id,
                                                                )
                                                            }
                                                            title="Delete Unit"
                                                        >
                                                            <FiTrash2
                                                                size={16}
                                                            />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="border border-dashed border-slate-200 rounded p-12 text-center text-xs text-slate-400 font-medium bg-slate-50/20">
                                    No units added yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Unit Settings Section */}
                <div className="bg-white rounded-md border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
                    <div>
                        <div className="bg-slate-50 border-b border-slate-200/60 px-4 py-2">
                            <h3 className="text-xs font-bold text-slate-800 tracking-wide">
                                Unit Settings
                            </h3>
                        </div>

                        <div className="p-4 space-y-4">
                            <div className="relative w-full pb-6">
                                <FormSelect
                                    label="Sales Unit"
                                    className="w-full disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={!isProductLocked}
                                    required
                                    {...register('salesUnit')}
                                >
                                    <option value="">Select sales unit</option>
                                    {unitTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name
                                                ? `${type.name} (${type.code})`
                                                : type.code}
                                        </option>
                                    ))}
                                </FormSelect>
                                {errors.salesUnit && (
                                    <p className="absolute bottom-0 left-0 text-red-500 text-xs leading-tight whitespace-nowrap">
                                        {errors.salesUnit.message}
                                    </p>
                                )}
                            </div>

                            <div className="relative w-full pb-6">
                                <FormSelect
                                    label="Stock Unit"
                                    className="w-full disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={!isProductLocked}
                                    required
                                    {...register('stockUnit')}
                                >
                                    <option value="">Select stock unit</option>
                                    {unitTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name
                                                ? `${type.name} (${type.code})`
                                                : type.code}
                                        </option>
                                    ))}
                                </FormSelect>
                                {errors.stockUnit && (
                                    <p className="absolute bottom-0 left-0 text-red-500 text-xs leading-tight whitespace-nowrap">
                                        {errors.stockUnit.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <FormButton
                                    variant="primary"
                                    className="w-full h-8.5 disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={!isProductLocked}
                                    onClick={handleSaveSettings}
                                >
                                    Save Settings
                                </FormButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons Section */}
            <div className="flex justify-end items-center gap-2 pt-2 border-t border-slate-100">
                <FormButton variant="secondary" onClick={handleClear}>
                    Clear
                </FormButton>
            </div>
        </div>
    );
}
