import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../components/ui/FormInput';
import FormSelect from '../../components/ui/FormSelect';
import SalesTable from '../../components/ui/SalesTable';
import toast from 'react-hot-toast';
import {
    getSalesQuotationLookups,
    getNextQuotationNo,
    createSalesQuotation,
} from '../../services/salesService';
import { salesQuotationSchema } from '../../utils/validationSchema';

// blank sales Quotation form
const emptyForm = {
    quotationNo: '',
    quotationTypeId: '',
    date: new Date().toISOString().split('T')[0],
    customerId: '',
    custRefNum: '',
    salesExecutiveId: '',
    attention: '',
    payTerm: '',
    deliveryPlace: '',
    currencyId: '',
    exRate: '1',
    notes: '',
};

// Create blank line items when click add row
const emptyRow = (unitTypes = []) => ({
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

export default function SalesQuotation() {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Dropdown data loaded from the API
    const [lookups, setLookups] = useState({
        customers: [],
        sales_executives: [],
        quotation_types: [],
        currencies: [],
        items: [],
        unit_types: [],
    });

    const [items, setItems] = useState([emptyRow()]);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(salesQuotationSchema),
        defaultValues: emptyForm,
    });

    // Reactive form values for character limit indicators
    const custRefNum = watch('custRefNum') || '';
    const attention = watch('attention') || '';
    const payTerm = watch('payTerm') || '';
    const deliveryPlace = watch('deliveryPlace') || '';
    const notes = watch('notes') || '';

    const charLimits = {
        custRefNum: 40,
        attention: 200,
        payTerm: 100,
        deliveryPlace: 150,
        notes: 500,
    };

    // Totals computed from line items
    const totals = items.reduce(
        (acc, row) => ({
            gross:
                acc.gross +
                (parseFloat(row.qty) || 0) * (parseFloat(row.rate) || 0),
            disc: acc.disc + (row.discAmt || 0),
            net: acc.net + (row.net || 0),
            vat: acc.vat + (row.vat || 0),
            netAfterVat: acc.netAfterVat + (row.netAfterVat || 0),
        }),
        { gross: 0, disc: 0, net: 0, vat: 0, netAfterVat: 0 },
    );

    // Load lookups + next quotation number, then enable form
    const handleNew = async () => {
        setLoading(true);
        try {
            const [lookupsData, nextNoData] = await Promise.all([
                getSalesQuotationLookups(),
                getNextQuotationNo(),
            ]);
            setLookups(lookupsData);

            // Set first options as defaults
            reset({
                ...emptyForm,
                quotationNo: nextNoData.quotation_no,
                quotationTypeId: String(
                    lookupsData.quotation_types[0]?.id ?? '',
                ),
                currencyId: String(lookupsData.currencies[0]?.id ?? ''),
            });
            setItems([emptyRow(lookupsData.unit_types)]);
            setIsEditing(true);
            toast.success('Form ready, fill in the details and save.');
        } catch (err) {
            toast.error('Failed to load form data. Check your connection.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const onSave = async (data) => {
        const validItems = items.filter(
            (r) => r.itemId && parseFloat(r.qty) > 0,
        );
        if (validItems.length === 0) {
            toast.error(
                'Add at least one line item with an item and quantity.',
            );
            return;
        }

        const payload = {
            quotation_no: data.quotationNo,
            quotation_type_id: parseInt(data.quotationTypeId),
            date: data.date,
            customer_id: parseInt(data.customerId),
            sales_executive_id: data.salesExecutiveId
                ? parseInt(data.salesExecutiveId)
                : null,
            currency_id: parseInt(data.currencyId),
            ex_rate: parseFloat(data.exRate) || 1,
            cust_ref_num: data.custRefNum,
            attention: data.attention,
            pay_terms: data.payTerm,
            delivery_place: data.deliveryPlace,
            notes: data.notes,
            gross_total: +totals.gross.toFixed(2),
            vat_total: +totals.vat.toFixed(2),
            net_after_vat: +totals.netAfterVat.toFixed(2),
            items: validItems.map((row) => ({
                item_id: parseInt(row.itemId),
                description: row.description,
                unit_id: parseInt(row.unitId),
                qty: parseFloat(row.qty),
                rate: parseFloat(row.rate),
                disc_pct: parseFloat(row.discPercent) || 0,
                disc_amt: row.discAmt,
                net_amount: row.net,
                vat_amount: row.vat,
                net_after_vat: row.netAfterVat,
            })),
        };

        setLoading(true);
        try {
            await createSalesQuotation(payload);
            toast.success(
                `Sales Quotation ${data.quotationNo} saved successfully!`,
            );
            setIsEditing(false);
            // Reset to blank view
            reset(emptyForm);
            setItems([emptyRow()]);
            setLookups({
                customers: [],
                sales_executives: [],
                quotation_types: [],
                currencies: [],
                items: [],
                unit_types: [],
            });
        } catch (err) {
            const data = err?.response?.data;

            let msg = 'Save failed. Please try again.';

            if (data?.items?.[0]?.disc_pct?.[0]) {
                msg = 'Discount % cannot exceed 999.99';
            }

            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        reset(emptyForm);
        setItems([emptyRow()]);
        setLookups({
            customers: [],
            sales_executives: [],
            quotation_types: [],
            currencies: [],
            items: [],
            unit_types: [],
        });
        toast.success('Changes discarded.');
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-4 p-2">
            {/* Page heading */}
            <div className="text-center py-1.5">
                <h1 className="text-lg font-bold tracking-tight text-slate-800">
                    Sales Quotation
                </h1>
            </div>

            {/* Header form fields */}
            <div className="bg-white border border-slate-200/80 shadow-sm rounded-lg p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4">
                    <div>
                        <FormInput
                            label="Quotation No"
                            disabled
                            {...register('quotationNo')}
                        />
                    </div>

                    <div>
                        <FormSelect
                            label="Quotation Type"
                            disabled={!isEditing}
                            {...register('quotationTypeId')}
                        >
                            <option value="">Select type</option>
                            {lookups.quotation_types.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </FormSelect>
                        {errors.quotationTypeId && (
                            <p className="text-red-500 text-[10px] mt-1 font-semibold">
                                {errors.quotationTypeId.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <FormInput
                            label="Date"
                            type="date"
                            disabled={!isEditing}
                            {...register('date')}
                        />
                        {errors.date && (
                            <p className="text-red-500 text-[10px] mt-1 font-semibold">
                                {errors.date.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <FormSelect
                            label="Customer"
                            disabled={!isEditing}
                            {...register('customerId')}
                        >
                            <option value="">Select customer</option>
                            {lookups.customers.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.code} — {c.name}
                                </option>
                            ))}
                        </FormSelect>
                        {errors.customerId && (
                            <p className="text-red-500 text-[10px] mt-1 font-semibold">
                                {errors.customerId.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <FormInput
                            label="Cust Ref No"
                            placeholder="Ref No..."
                            disabled={!isEditing}
                            {...register('custRefNum')}
                            charCount={custRefNum.length}
                            maxChars={charLimits.custRefNum}
                        />
                        {errors.custRefNum && (
                            <p className="text-red-500 text-[10px] mt-1 font-semibold">
                                {errors.custRefNum.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <FormSelect
                            label="Sales Executive"
                            disabled={!isEditing}
                            {...register('salesExecutiveId')}
                        >
                            <option value="">Select executive</option>
                            {lookups.sales_executives.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.name}
                                </option>
                            ))}
                        </FormSelect>
                        {errors.salesExecutiveId && (
                            <p className="text-red-500 text-[10px] mt-1 font-semibold">
                                {errors.salesExecutiveId.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <FormInput
                            label="Attention"
                            placeholder="Attention..."
                            disabled={!isEditing}
                            {...register('attention')}
                            charCount={attention.length}
                            maxChars={charLimits.attention}
                        />
                        {errors.attention && (
                            <p className="text-red-500 text-[10px] mt-1 font-semibold">
                                {errors.attention.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <FormInput
                            label="Pay Term"
                            placeholder="Pay Terms..."
                            disabled={!isEditing}
                            {...register('payTerm')}
                            charCount={payTerm.length}
                            maxChars={charLimits.payTerm}
                        />
                        {errors.payTerm && (
                            <p className="text-red-500 text-[10px] mt-1 font-semibold">
                                {errors.payTerm.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <FormInput
                            label="Delivery Place"
                            placeholder="Delivery Place..."
                            disabled={!isEditing}
                            {...register('deliveryPlace')}
                            charCount={deliveryPlace.length}
                            maxChars={charLimits.deliveryPlace}
                        />
                        {errors.deliveryPlace && (
                            <p className="text-red-500 text-[10px] mt-1 font-semibold">
                                {errors.deliveryPlace.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <FormSelect
                            label="Currency"
                            disabled={!isEditing}
                            {...register('currencyId')}
                        >
                            <option value="">Select currency</option>
                            {lookups.currencies.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.code}
                                </option>
                            ))}
                        </FormSelect>
                        {errors.currencyId && (
                            <p className="text-red-500 text-[10px] mt-1 font-semibold">
                                {errors.currencyId.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <FormInput
                            label="Ex Rate"
                            type="number"
                            step="any"
                            disabled={!isEditing}
                            {...register('exRate')}
                        />
                        {errors.exRate && (
                            <p className="text-red-500 text-[10px] mt-1 font-semibold">
                                {errors.exRate.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <FormInput
                            label="Notes"
                            placeholder="Notes..."
                            disabled={!isEditing}
                            {...register('notes')}
                            charCount={notes.length}
                            maxChars={charLimits.notes}
                        />
                        {errors.notes && (
                            <p className="text-red-500 text-[10px] mt-1 font-semibold">
                                {errors.notes.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Line items table */}
            <div className="bg-white border border-slate-200/80 shadow-sm rounded-lg p-4">
                <SalesTable
                    items={items}
                    onChange={setItems}
                    isEditing={isEditing}
                    unitTypes={lookups.unit_types}
                    itemList={lookups.items}
                />
            </div>

            {/* Totals + action bar */}
            <div className="bg-white border border-slate-200/80 shadow-sm rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <FormInput
                        label="Gross"
                        disabled
                        value={totals.gross.toFixed(2)}
                    />
                    <FormInput
                        label="Disc"
                        disabled
                        value={totals.disc.toFixed(2)}
                    />
                    <FormInput
                        label="Net Total"
                        disabled
                        value={totals.net.toFixed(2)}
                    />
                    <FormInput
                        label="VAT"
                        disabled
                        value={totals.vat.toFixed(2)}
                    />
                    <FormInput
                        label="Net After VAT"
                        disabled
                        value={totals.netAfterVat.toFixed(2)}
                    />
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={handleNew}
                            disabled={loading}
                            className="inline-flex items-center justify-center px-5 py-1.5 text-white rounded text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-sm min-w-[76px] bg-[#00b67a] hover:bg-[#00a36c] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Loading...' : 'New'}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit(onSave, () =>
                                toast.error('Please fix the errors'),
                            )}
                            disabled={loading}
                            className="inline-flex items-center justify-center px-5 py-1.5 text-white rounded text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-sm min-w-[76px] bg-[#00b67a] hover:bg-[#00a36c] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    )}

                    <button
                        type="button"
                        disabled
                        className="inline-flex items-center justify-center px-5 py-1.5 text-slate-400 bg-slate-50 border border-slate-200 rounded text-xs font-semibold tracking-wide cursor-not-allowed min-w-[76px] opacity-65"
                    >
                        Print
                    </button>
                    <button
                        type="button"
                        disabled
                        className="inline-flex items-center justify-center px-5 py-1.5 text-slate-400 bg-slate-50 border border-slate-200 rounded text-xs font-semibold tracking-wide cursor-not-allowed min-w-[76px] opacity-65"
                    >
                        Preview
                    </button>
                    <button
                        type="button"
                        disabled
                        className="inline-flex items-center justify-center px-5 py-1.5 text-white bg-[#7c5cfc] hover:bg-[#6b4ae6] rounded text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-sm min-w-[76px] opacity-65 cursor-not-allowed"
                    >
                        List
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="inline-flex items-center justify-center px-5 py-1.5 text-white bg-[#64748b] hover:bg-[#526175] rounded text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-sm min-w-[76px]"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
