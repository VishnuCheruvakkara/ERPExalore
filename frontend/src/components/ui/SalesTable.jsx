import React from 'react';
import { FaMagnifyingGlass, FaPlus, FaTrash } from 'react-icons/fa6';

// unitTypes: [{ id, code, name }] from API
// itemList:  [{ id, item_code, name_1 }] from API
export default function SalesTable({ items = [], onChange, isEditing = false, unitTypes = [], itemList = [] }) {

    // Row-level calculation: gross -> discount -> net -> vat -> final
    const calcRow = (qty = 0, rate = 0, discPercent = 0) => {
        const gross = qty * rate;
        const discAmt = gross * (discPercent / 100);
        const net = gross - discAmt;
        const vat = net * 0.15; // 15% VAT
        return {
            discAmt: +discAmt.toFixed(2),
            net: +net.toFixed(2),
            vat: +vat.toFixed(2),
            netAfterVat: +(net + vat).toFixed(2),
        };
    };

    const handleFieldChange = (index, field, value) => {
        const updated = items.map((item, idx) => {
            if (idx !== index) return item;
            const row = { ...item, [field]: value };

            if (['qty', 'rate', 'discPercent'].includes(field)) {
                const qty = field === 'qty' ? parseFloat(value) || 0 : parseFloat(row.qty) || 0;
                const rate = field === 'rate' ? parseFloat(value) || 0 : parseFloat(row.rate) || 0;
                const discPercent = field === 'discPercent' ? parseFloat(value) || 0 : parseFloat(row.discPercent) || 0;
                Object.assign(row, calcRow(qty, rate, discPercent));
            }
            return row;
        });
        onChange(updated);
    };

    // When user selects an item from the dropdown, auto-fill code and description
    const handleItemSelect = (index, itemId) => {
        const selected = itemList.find(i => String(i.id) === String(itemId));
        if (!selected) return;
        const updated = items.map((item, idx) => {
            if (idx !== index) return item;
            return {
                ...item,
                itemId: selected.id,
                code: selected.item_code,
                description: selected.name_1,
                // default unit to the item's sales_unit if available
                unitId: selected.sales_unit ?? item.unitId,
            };
        });
        onChange(updated);
    };

    const emptyRow = () => ({
        itemId: '',
        code: '',
        description: '',
        unitId: unitTypes[0]?.id ?? '',
        qty: 0,
        rate: 0,
        discPercent: 0,
        discAmt: 0,
        net: 0,
        vat: 0,
        netAfterVat: 0,
    });

    const addRow = () => onChange([...items, emptyRow()]);

    const removeRow = (idx) => {
        if (items.length <= 1) { onChange([emptyRow()]); return; }
        onChange(items.filter((_, i) => i !== idx));
    };

    return (
        <div className="w-full space-y-2.5">
            {/* Status banner */}
            <div className="bg-[#fffbeb] border border-[#fde047]/70 text-[#78350f] px-4 py-2 text-xs font-semibold rounded-sm">
                {isEditing
                    ? "Form is editable — modify inputs and manage line items below."
                    : "Click 'New' to enable the form and start entering data."}
            </div>

            {/* Scrollable table */}
            <div className="w-full overflow-x-auto border border-slate-200 rounded-md bg-white">
                <table className="w-full border-collapse text-left min-w-[1100px]">
                    <thead>
                        <tr className="text-white text-[10px] uppercase font-semibold">
                            <th className="bg-[#11132d] py-2.5 px-3 border-r border-[#1a1c3d] w-[52px] text-center"># Row</th>
                            <th className="bg-[#11132d] py-2.5 px-3 border-r border-[#1a1c3d] w-[160px]">
                                <div>Code</div>
                                <div className="text-[8px] text-slate-400 font-normal normal-case">SELECT / TEXT</div>
                            </th>
                            <th className="bg-[#11132d] py-2.5 px-3 border-r border-[#1a1c3d]">
                                <div>Description</div>
                                <div className="text-[8px] text-slate-400 font-normal normal-case">TEXT</div>
                            </th>
                            <th className="bg-[#11132d] py-2.5 px-3 border-r border-[#1a1c3d] w-[95px]">
                                <div>Unit</div>
                                <div className="text-[8px] text-slate-400 font-normal normal-case">DROPDOWN</div>
                            </th>
                            <th className="bg-[#11132d] py-2.5 px-3 border-r border-[#1a1c3d] w-[85px]">
                                <div>Qty</div>
                                <div className="text-[8px] text-slate-400 font-normal normal-case">NUMBER</div>
                            </th>
                            <th className="bg-[#11132d] py-2.5 px-3 border-r border-[#1a1c3d] w-[95px]">
                                <div>Rate</div>
                                <div className="text-[8px] text-slate-400 font-normal normal-case">NUMBER</div>
                            </th>
                            <th className="bg-[#11132d] py-2.5 px-3 border-r border-[#1a1c3d] w-[75px]">
                                <div>Disc %</div>
                                <div className="text-[8px] text-slate-400 font-normal normal-case">NUMBER</div>
                            </th>
                            <th className="bg-[#11132d] py-2.5 px-3 border-r border-[#1a1c3d] w-[95px]">
                                <div>Disc Amt</div>
                                <div className="text-[8px] text-slate-400 font-normal normal-case">AUTO</div>
                            </th>
                            <th className="bg-[#11132d] py-2.5 px-3 border-r border-[#1a1c3d] w-[95px]">
                                <div>NET</div>
                                <div className="text-[8px] text-slate-400 font-normal normal-case">AUTO</div>
                            </th>
                            <th className="bg-[#11132d] py-2.5 px-3 border-r border-[#1a1c3d] w-[85px]">
                                <div>VAT</div>
                                <div className="text-[8px] text-slate-400 font-normal normal-case">AUTO</div>
                            </th>
                            <th className="bg-[#11132d] py-2.5 px-3 border-r border-[#1a1c3d] w-[105px]">
                                <div>Net After VAT</div>
                                <div className="text-[8px] text-slate-400 font-normal normal-case">AUTO</div>
                            </th>
                            {isEditing && (
                                <th className="bg-[#11132d] py-2.5 px-3 w-[46px] text-center border-l border-[#1a1c3d]">Del</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map((item, index) => (
                            <tr key={index} className="text-xs hover:bg-slate-50/50 transition-colors">
                                {/* Row number */}
                                <td className="py-2 px-3 border-r border-slate-100 text-center">
                                    <span className="inline-block bg-slate-100 border border-slate-200 text-slate-600 rounded px-1.5 py-0.5 text-[10px] font-medium">
                                        {index + 1}
                                    </span>
                                </td>

                                {/* Code — select from item list or type */}
                                <td className="py-2 px-2 border-r border-slate-100">
                                    <div className="relative flex items-center gap-1">
                                        {isEditing && itemList.length > 0 ? (
                                            <select
                                                value={item.itemId || ''}
                                                onChange={(e) => handleItemSelect(index, e.target.value)}
                                                className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:border-indigo-500 text-slate-700 bg-white cursor-pointer"
                                            >
                                                <option value="">-- Select Item --</option>
                                                {itemList.map(i => (
                                                    <option key={i.id} value={i.id}>{i.item_code} — {i.name_1}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={item.code}
                                                disabled
                                                placeholder="Item code"
                                                className="w-full pl-2 pr-7 py-1 text-xs border border-slate-200 rounded text-slate-700 bg-slate-50 cursor-not-allowed opacity-75"
                                            />
                                        )}
                                        {!isEditing && (
                                            <FaMagnifyingGlass className="absolute right-2 h-3 w-3 text-slate-400" />
                                        )}
                                    </div>
                                </td>

                                {/* Description */}
                                <td className="py-2 px-2 border-r border-slate-100">
                                    <input
                                        type="text"
                                        value={item.description}
                                        disabled={!isEditing}
                                        placeholder="Enter description"
                                        onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                                        className={`w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:border-indigo-500 text-slate-700 bg-slate-50/40 transition-colors ${!isEditing ? 'cursor-not-allowed opacity-75 bg-slate-50' : ''}`}
                                    />
                                </td>

                                {/* Unit */}
                                <td className="py-2 px-2 border-r border-slate-100">
                                    <select
                                        value={item.unitId || ''}
                                        disabled={!isEditing}
                                        onChange={(e) => handleFieldChange(index, 'unitId', e.target.value)}
                                        className={`w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:border-indigo-500 text-slate-700 bg-slate-50/40 transition-colors cursor-pointer ${!isEditing ? 'cursor-not-allowed opacity-75 bg-slate-50' : ''}`}
                                    >
                                        <option value="">Unit</option>
                                        {unitTypes.map(u => (
                                            <option key={u.id} value={u.id}>{u.code}</option>
                                        ))}
                                    </select>
                                </td>

                                {/* Qty */}
                                <td className="py-2 px-2 border-r border-slate-100">
                                    <input
                                        type="number"
                                        value={item.qty || ''}
                                        disabled={!isEditing}
                                        placeholder="0"
                                        onChange={(e) => handleFieldChange(index, 'qty', e.target.value)}
                                        className={`w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:border-indigo-500 text-slate-700 text-right bg-slate-50/40 transition-colors ${!isEditing ? 'cursor-not-allowed opacity-75 bg-slate-50' : ''}`}
                                    />
                                </td>

                                {/* Rate */}
                                <td className="py-2 px-2 border-r border-slate-100">
                                    <input
                                        type="number"
                                        value={item.rate || ''}
                                        disabled={!isEditing}
                                        placeholder="0.00"
                                        onChange={(e) => handleFieldChange(index, 'rate', e.target.value)}
                                        className={`w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:border-indigo-500 text-slate-700 text-right bg-slate-50/40 transition-colors ${!isEditing ? 'cursor-not-allowed opacity-75 bg-slate-50' : ''}`}
                                    />
                                </td>

                                {/* Disc % */}
                                <td className="py-2 px-2 border-r border-slate-100">
                                    <input
                                        type="number"
                                        value={item.discPercent || ''}
                                        disabled={!isEditing}
                                        placeholder="0"
                                        onChange={(e) => handleFieldChange(index, 'discPercent', e.target.value)}
                                        className={`w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:border-indigo-500 text-slate-700 text-right bg-slate-50/40 transition-colors ${!isEditing ? 'cursor-not-allowed opacity-75 bg-slate-50' : ''}`}
                                    />
                                </td>

                                {/* Disc Amt — auto */}
                                <td className="py-2 px-3 border-r border-slate-100 text-right font-medium text-slate-600 bg-slate-50/30">
                                    {(item.discAmt || 0).toFixed(2)}
                                </td>

                                {/* NET — auto */}
                                <td className="py-2 px-3 border-r border-slate-100 text-right font-medium text-slate-600 bg-slate-50/30">
                                    {(item.net || 0).toFixed(2)}
                                </td>

                                {/* VAT — auto */}
                                <td className="py-2 px-3 border-r border-slate-100 text-right font-medium text-slate-600 bg-slate-50/30">
                                    {(item.vat || 0).toFixed(2)}
                                </td>

                                {/* Net After VAT — auto */}
                                <td className="py-2 px-3 border-r border-slate-100 text-right font-semibold text-slate-700 bg-slate-50/40">
                                    {(item.netAfterVat || 0).toFixed(2)}
                                </td>

                                {/* Delete row */}
                                {isEditing && (
                                    <td className="py-2 px-2 text-center">
                                        <button
                                            type="button"
                                            onClick={() => removeRow(index)}
                                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer transition-colors"
                                            title="Remove row"
                                        >
                                            <FaTrash className="h-3.5 w-3.5" />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add row button */}
            {isEditing && (
                <div className="flex justify-start">
                    <button
                        type="button"
                        onClick={addRow}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors cursor-pointer shadow-sm"
                    >
                        <FaPlus className="h-3 w-3" />
                        Add Row
                    </button>
                </div>
            )}
        </div>
    );
}
