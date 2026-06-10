import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormInput from '../../../components/ui/FormInput';
import FormSelect from '../../../components/ui/FormSelect';
import FormButton from '../../../components/ui/FormButton';
import {
    getInventoryItems,
    getInventoryLookups,
    createItemUnit,
} from '../../../services/inventoryService';

export function UnitBarcodeTab() {
    return (
        <div className="w-full space-y-4 rounded-md p-2 bg-white">
            
            {/* MAIN CONTENT SPLIT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* LEFT SIDE: UNIT MANAGEMENT BLOCK */}
                <div className="lg:col-span-2 bg-white rounded-md border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
                    <div>
                        {/* Section Header */}
                        <div className="bg-slate-50 border-b border-slate-200/60 px-4 py-2">
                            <h3 className="text-xs font-bold text-slate-800 tracking-wide">
                                Unit Management
                            </h3>
                        </div>
                        
                        {/* Input Row fields */}
                        <div className="p-4 flex gap-4 items-end">
                            <FormSelect label="Unit" className="flex-1">
                                <option value="">Select unit</option>
                            </FormSelect>

                            <FormInput 
                                label="Cofactor" 
                                type="number" 
                                defaultValue={1} 
                                className="w-32"
                            />

                            <FormButton variant="disabled" disabled className="h-[34px] px-4 min-w-[90px]">
                                + Add Unit
                            </FormButton>
                        </div>

                        {/* Existing Units Display Area */}
                        <div className="px-4 pb-4">
                            <div className="border border-dashed border-slate-200 rounded p-12 text-center text-xs text-slate-400 font-medium bg-slate-50/20">
                                No units added yet
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: UNIT SETTINGS CONFIG BLOCK */}
                <div className="bg-white rounded-md border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
                    <div>
                        {/* Section Header */}
                        <div className="bg-slate-50 border-b border-slate-200/60 px-4 py-2">
                            <h3 className="text-xs font-bold text-slate-800 tracking-wide">
                                Unit Settings
                            </h3>
                        </div>

                        {/* Dropdown Options */}
                        <div className="p-4 space-y-4">
                            <FormSelect label="Sales Unit">
                                <option value="">Select sales unit</option>
                            </FormSelect>

                            <FormSelect label="Stock Unit">
                                <option value="">Select stock unit</option>
                            </FormSelect>
                        </div>
                    </div>

                    {/* Action Block */}
                    <div className="p-4 pt-0 flex justify-end">
                        <FormButton variant="blue" className="w-full sm:w-auto py-2">
                            Save Settings
                        </FormButton>
                    </div>
                </div>

            </div>

            {/* COMMON FORM FOOTER UTILITY BUTTONS */}
            <div className="flex justify-end items-center gap-2 pt-2 border-t border-slate-100">
                <FormButton variant="success" onClick={() => console.log('New clicked')}>
                    New
                </FormButton>
                
                <FormButton variant="primary" onClick={() => console.log('List clicked')}>
                    List
                </FormButton>
                
                <FormButton variant="secondary" onClick={() => console.log('Clear clicked')}>
                    Clear
                </FormButton>
            </div>

        </div>
    );
}