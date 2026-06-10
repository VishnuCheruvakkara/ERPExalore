import React from 'react';
import FormInput from '../../../components/ui/FormInput';
import FormButton from '../../../components/ui/FormButton';

export function PriceListTab() {
    return (
        <div className="w-full space-y-4 rounded-md p-2 bg-white">
            
            {/* MAIN PRICE LIST CONTAINER */}
            <div className="bg-white rounded-md border border-slate-200/80 shadow-xs overflow-hidden">
                
                {/* 1. SECTION HEADER CONTAINER */}
                <div className="bg-slate-50 border-b border-slate-200/60 px-4 py-3 flex items-center justify-between">
                    {/* Left Info: Title & Meta tag */}
                    <div className="flex items-center gap-3">
                        <div className="text-blue-600 font-bold text-sm">
                            $
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-slate-800 tracking-wide">
                                Price List Management
                            </h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm tracking-wider">
                                    100005994
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                    baleno
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Info Tags */}
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500">
                        <div className="bg-slate-100 border border-slate-200/60 rounded px-2 py-0.5 flex items-center gap-1">
                            <span className="text-slate-400">🕒</span> 2 Units
                        </div>
                        <div className="bg-slate-100 border border-slate-200/60 rounded px-2 py-0.5 flex items-center gap-1">
                            <span className="text-slate-400">⚙️</span> 1 Price Types
                        </div>
                    </div>
                </div>

                {/* 2. PRICING MATRIX MATRIX TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200/60 text-[11px] font-bold text-slate-700 tracking-wide">
                                <th className="p-3 pl-4 w-1/4">Price List Type</th>
                                <th className="p-3 w-1/6">Unit</th>
                                <th className="p-3 w-1/4">Sale Price</th>
                                <th className="p-3 pr-4 w-1/4">Minimum Selling Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            
                            {/* ROW 1: CTNS Row */}
                            <tr className="hover:bg-slate-50/30 transition-colors">
                                <td className="p-4 align-middle pl-4">
                                    {/* RETAIL BADGE spans across multiple units in design */}
                                    <span className="bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wider shadow-2xs">
                                        RETAIL
                                    </span>
                                </td>
                                <td className="p-4 align-middle">
                                    <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200 rounded px-1.5 py-0.5">
                                        CTNS
                                    </span>
                                </td>
                                <td className="p-4 align-middle">
                                    <FormInput 
                                        type="number"
                                        defaultValue={250} 
                                        placeholder="0"
                                        className="max-w-[180px]"
                                    />
                                </td>
                                <td className="p-4 align-middle pr-4">
                                    <FormInput 
                                        type="number"
                                        defaultValue={200} 
                                        placeholder="0"
                                        className="max-w-[180px]"
                                    />
                                </td>
                            </tr>

                            {/* ROW 2: Lth Row */}
                            <tr className="hover:bg-slate-50/30 transition-colors">
                                <td className="p-4 align-middle pl-4">
                                    {/* Left empty intentionally to map the empty visual flow under RETAIL */}
                                </td>
                                <td className="p-4 align-middle">
                                    <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200 rounded px-1.5 py-0.5">
                                        Lth
                                    </span>
                                </td>
                                <td className="p-4 align-middle">
                                    <FormInput 
                                        type="number"
                                        defaultValue={350} 
                                        placeholder="0"
                                        className="max-w-[180px]"
                                    />
                                </td>
                                <td className="p-4 align-middle pr-4">
                                    <FormInput 
                                        type="number"
                                        defaultValue={300} 
                                        placeholder="0"
                                        className="max-w-[180px]"
                                    />
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>

            {/* COMMON FORM FOOTER UTILITY BUTTONS */}
            <div className="flex justify-end items-center gap-2 pt-2 border-t border-slate-100">
                {/* Reuses your success variant styling but renders Edit dynamically */}
                <FormButton variant="success" onClick={() => console.log('Edit clicked')}>
                    Edit
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