// GeneralTab.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../../components/ui/FormInput';
import FormSelect from '../../../components/ui/FormSelect';
import FormButton from '../../../components/ui/FormButton';
import { itemValidationSchema } from '../../../utils/validationSchema';
import {
    getInventoryLookups,
    createInventoryItem,
} from '../../../services/inventoryService';
import {
    BEHAVIOUR_OPTIONS,
    STATUS_OPTIONS,
    TAXABLE_OPTIONS,
} from '../../../constants/itemOptions';
import toast from 'react-hot-toast';

export function GeneralTab() {
    const [isEditing, setIsEditing] = useState(false);
    const [loadingLookups, setLoadingLookups] = useState(false);
    const [dropdowns, setDropdowns] = useState({
        item_groups: [],
        shelves: [],
        manufacturers: [],
        unit_types: [],
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(itemValidationSchema),
        defaultValues: {
            item_code: '',
            name_1: '',
            name_2: '',
            generic_name: '',
            description: '',
            behaviour: 'purchase_item',
            group_code: '',
            status: 'active',
            taxable_status: 'non_taxable',
            shelf_code: '',
            manufacturer: '',
        },
    });

    const loadDropdownData = async () => {
        setLoadingLookups(true);
        try {
            const data = await getInventoryLookups();
            setDropdowns(data);
        } catch (error) {
            console.error('Unable to load inventory dropdown data', error);
        } finally {
            setLoadingLookups(false);
        }
    };

    useEffect(() => {
        if (isEditing && !dropdowns.item_groups.length) {
            loadDropdownData();
        }
    }, [isEditing]);

    const onFormSubmit = async (data) => {
        try {
            await createInventoryItem(data);
            toast.success("Form submitted successful")

            setIsEditing(false);
            reset();
        } catch (error) {
            console.error('API preservation failure', error);
            toast.error("Error while form submission, try again")
            setIsEditing(true);
        }
    };

    const handleNewOrSaveClick = (e) => {
        if (!isEditing) {
            setIsEditing(true);
            return;
        }
        handleSubmit(onFormSubmit, () => toast.error('Please fix the errors'))(e);
    };

    const handleClear = () => {
        setIsEditing(false);
        reset();
    };

    const renderOptions = (items, keyLabel) => {
        if (loadingLookups) return <option value="">Loading...</option>;
        if (!items.length)
            return <option value="">No options available</option>;

        return items.map((item) => (
            <option key={item.id} value={item.id}>
                {keyLabel === 'group'
                    ? `${item.code} - ${item.name}`
                    : item.code || item.name}
            </option>
        ));
    };

    return (
        <div className="w-full space-y-4 rounded-md p-2 bg-white">
            {/* Basic Information Section */}
            <div className="bg-white rounded-md border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200/60 px-4 py-2">
                    <h3 className="text-xs font-bold text-slate-800 tracking-wide">
                        Basic Information
                    </h3>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 items-start">
                    <div className="space-y-1 min-h-[75px]">
                        <FormInput
                            label="Item Code"
                            placeholder="Enter item code *"
                            required
                            disabled={!isEditing}
                            error={errors.item_code?.message}
                            {...register('item_code')}
                        />
                        {errors.item_code && (
                            <p className="text-red-500 text-xs mt-0.5">
                                {errors.item_code.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1 min-h-[75px]">
                        <FormInput
                            label="Name 2"
                            placeholder="Enter name 2"
                            disabled={!isEditing}
                            error={errors.name_2?.message}
                            {...register('name_2')}
                        />
                        {errors.name_2 && (
                            <p className="text-red-500 text-xs mt-0.5">
                                {errors.name_2.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1 min-h-[75px] w-full">
                        <FormInput
                            label="Name 1"
                            placeholder="Enter name 1 *"
                            required
                            className="w-full"
                            disabled={!isEditing}
                            error={errors.name_1?.message}
                            {...register('name_1')}
                        />
                        {errors.name_1 && (
                            <p className="text-red-500 text-xs mt-0.5">
                                {errors.name_1.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-white rounded-md border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200/60 px-4 py-2">
                    <h3 className="text-xs font-bold text-slate-800 tracking-wide">
                        Additional Information
                    </h3>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 items-start">
                    <div className="space-y-1 min-h-[75px]">
                        <FormInput
                            label="Generic Name"
                            placeholder="Enter generic name"
                            disabled={!isEditing}
                            error={errors.generic_name?.message}
                            {...register('generic_name')}
                        />
                        {errors.generic_name && (
                            <p className="text-red-500 text-xs mt-0.5">
                                {errors.generic_name.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1 min-h-[75px] md:col-span-2">
                        <FormInput
                            label="Description"
                            placeholder="Enter description"
                            disabled={!isEditing}
                            error={errors.description?.message}
                            {...register('description')}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-0.5">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Configuration Section */}
            <div className="bg-white rounded-md border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200/60 px-4 py-2">
                    <h3 className="text-xs font-bold text-slate-800 tracking-wide">
                        Configuration
                    </h3>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 items-start">
                    <div className="space-y-1 min-h-[75px]">
                        <FormSelect
                            label="Behaviour"
                            required
                            disabled={!isEditing}
                            {...register('behaviour')}
                        >
                            {BEHAVIOUR_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </FormSelect>
                        {errors.behaviour && (
                            <p className="text-red-500 text-xs mt-0.5">
                                {errors.behaviour.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1 min-h-[75px]">
                        <FormSelect
                            label="Group Code"
                            required
                            disabled={!isEditing}
                            {...register('group_code')}
                        >
                            <option value="">Select Group Code *...</option>
                            {renderOptions(dropdowns.item_groups, 'group')}
                        </FormSelect>
                        {errors.group_code && (
                            <p className="text-red-500 text-xs mt-0.5">
                                {errors.group_code.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1 min-h-[75px]">
                        <FormSelect
                            label="Status"
                            required
                            disabled={!isEditing}
                            {...register('status')}
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </FormSelect>
                        {errors.status && (
                            <p className="text-red-500 text-xs mt-0.5">
                                {errors.status.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1 min-h-[75px]">
                        <FormSelect
                            label="Taxable Status"
                            required
                            disabled={!isEditing}
                            {...register('taxable_status')}
                        >
                            {TAXABLE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </FormSelect>
                        {errors.taxable_status && (
                            <p className="text-red-500 text-xs mt-0.5">
                                {errors.taxable_status.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1 min-h-[75px]">
                        <FormSelect
                            label="Shelf Code"
                            disabled={!isEditing}
                            {...register('shelf_code')}
                        >
                            <option value="">Select Shelf Code...</option>
                            {renderOptions(dropdowns.shelves, 'shelf')}
                        </FormSelect>
                        {errors.shelf_code && (
                            <p className="text-red-500 text-xs mt-0.5">
                                {errors.shelf_code.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1 min-h-[75px]">
                        <FormSelect
                            label="Manufacturer"
                            disabled={!isEditing}
                            {...register('manufacturer')}
                        >
                            <option value="">Select Manufacturer...</option>
                            {renderOptions(
                                dropdowns.manufacturers,
                                'manufacturer',
                            )}
                        </FormSelect>
                        {errors.manufacturer && (
                            <p className="text-red-500 text-xs mt-0.5">
                                {errors.manufacturer.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons Section */}
            <div className="flex justify-end items-center gap-2 pt-2">
                <FormButton variant="success" onClick={handleNewOrSaveClick}>
                    {isEditing ? 'Save' : 'New'}
                </FormButton>

                <FormButton variant="primary" onClick={() => {}}>
                    List
                </FormButton>

                <FormButton variant="secondary" onClick={handleClear}>
                    Clear
                </FormButton>
            </div>
        </div>
    );
}