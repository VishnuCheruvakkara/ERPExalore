import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../components/ui/FormInput';
import FormSelect from '../../components/ui/FormSelect';
import SalesTable from '../../components/ui/SalesTable';
import toast from 'react-hot-toast';
import {
    getSalesOrderLookups,
    getNextSalesOrderNo,
    createSalesOrder,
    getSalesQuotationDetails,
} from '../../services/salesService';
import { salesOrderSchema } from '../../utils/validationSchema';

const emptyForm = {
    soNo: '',
    orderTypeId: '',
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date().toISOString().split('T')[0],
    customerId: '',
    salesExecutiveId: '',
    currencyId: '',
    exRate: '1',
    customerPo: '',
    quotationId: '',
    deliveryPlace: '',
    notes: '',
};

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

export default function SalesOrder() {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Default shape — every key the JSX reads must exist
    const defaultLookups = {
        customers: [],
        sales_executives: [],
        order_types: [],
        currencies: [],
        items: [],
        unit_types: [],
        quotations: [],
    };

    // Dropdown data loaded from the API
    const [lookups, setLookups] = useState(defaultLookups);

    const [items, setItems] = useState([emptyRow()]);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(salesOrderSchema),
        defaultValues: emptyForm,
    });

    // Reactive form values for character limit indicators
    const customerPo = watch('customerPo') || '';
    const deliveryPlace = watch('deliveryPlace') || '';
    const notes = watch('notes') || '';
    const quotationId = watch('quotationId') || '';

    const charLimits = { customerPo: 100, deliveryPlace: 150, notes: 500 };

    // Automatically load quotation details when linked quotation is selected
    React.useEffect(() => {
        if (!isEditing || !quotationId) return;

        const loadQuotation = async () => {
            try {
                const quote = await getSalesQuotationDetails(quotationId);

                // Populate form fields
                setValue('customerId', String(quote.customer_id || ''));
                setValue('salesExecutiveId', String(quote.sales_executive_id || ''));
                setValue('currencyId', String(quote.currency_id || ''));
                setValue('exRate', String(quote.ex_rate || '1'));
                setValue('deliveryPlace', quote.delivery_place || '');
                setValue('notes', quote.notes || '');

                // Map and set line items
                if (quote.items && quote.items.length > 0) {
                    const mapped = quote.items.map(item => {
                        const matched = (lookups.items || []).find(i => String(i.id) === String(item.item_id));
                        return {
                            itemId: item.item_id,
                            code: matched?.item_code || '',
                            description: item.description || matched?.name_1 || '',
                            unitId: item.unit_id,
                            qty: parseFloat(item.qty) || 0,
                            rate: parseFloat(item.rate) || 0,
                            discPercent: parseFloat(item.disc_pct) || 0,
                            discAmt: parseFloat(item.disc_amt) || 0,
                            net: parseFloat(item.net_amount) || 0,
                            vat: parseFloat(item.vat_amount) || 0,
                            netAfterVat: parseFloat(item.net_after_vat) || 0,
                        };
                    });
                    setItems(mapped);
                } else {
                    setItems([emptyRow(lookups.unit_types)]);
                }

                toast.success(`Quotation ${quote.quotation_no} data loaded.`);
            } catch (err) {
                console.error(err);
                toast.error('Failed to fetch quotation details.');
            }
        };

        loadQuotation();
    }, [quotationId, isEditing, lookups.items, setValue]);

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

    // Load lookups + next sales order number, then enable form
    const handleNew = async () => {
        setLoading(true);
        try {
            const [lookupsData, nextNoData] = await Promise.all([
                getSalesOrderLookups(),
                getNextSalesOrderNo(),
            ]);

            // Merge with defaults so every key the JSX reads always exists
            const merged = { ...defaultLookups, ...lookupsData };
            setLookups(merged);

            // Set first options as defaults
            reset({
                ...emptyForm,
                soNo: nextNoData.so_no,
                orderTypeId: String(merged.order_types[0]?.id ?? ''),
                currencyId: String(merged.currencies[0]?.id ?? ''),
            });
            setItems([emptyRow(merged.unit_types)]);
            setIsEditing(true);
            toast.success('Form ready — fill in the details and save.');
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
            so_no: data.soNo,
            order_type_id: parseInt(data.orderTypeId),
            date: data.date,
            valid_until: data.validUntil,
            customer_id: parseInt(data.customerId),
            sales_executive_id: data.salesExecutiveId
                ? parseInt(data.salesExecutiveId)
                : null,
            currency_id: parseInt(data.currencyId),
            ex_rate: parseFloat(data.exRate) || 1,
            customer_po: data.customerPo,
            quotation_id: data.quotationId ? parseInt(data.quotationId) : null,
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
            await createSalesOrder(payload);
            toast.success(`Sales Order ${data.soNo} saved successfully!`);
            setIsEditing(false);
            // Reset to blank view
            reset(emptyForm);
            setItems([emptyRow()]);
            setLookups(defaultLookups);
        } catch (err) {
            const msg = err?.response?.data
                ? JSON.stringify(err.response.data)
                : 'Save failed. Please try again.';
            toast.error(msg);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        reset(emptyForm);
        setItems([emptyRow()]);
        setLookups(defaultLookups);
        toast.success('Changes discarded.');
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-4 p-2">
            {/* Page heading */}
            <div className="text-center py-1.5">
                <h1 className="text-lg font-bold tracking-tight text-slate-800">
                    Sales Order
                </h1>
            </div>

            {/* Header form fields */}
            <div className="bg-white border border-slate-200/80 shadow-sm rounded-lg p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4">
                    <div>
                        <FormInput
                            label="SO No"
                            disabled
                            {...register('soNo')}
                        />
                    </div>

                    <div>
                        <FormSelect
                            label="Sales Order Type"
                            disabled={!isEditing}
                            {...register('orderTypeId')}
                        >
                            <option value="">Select type</option>
                            {lookups.order_types.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </FormSelect>
                        {errors.orderTypeId && (
                            <p className="text-red-500 text-[10px] mt-1 font-semibold">
                                {errors.orderTypeId.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <FormInput
                            label="Issue Date"
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
                        <FormInput
                            label="Valid Until"
                            type="date"
                            disabled={!isEditing}
                            {...register('validUntil')}
                        />
                        {errors.validUntil && (
                            <p className="text-red-500 text-[10px] mt-1 font-semibold">
                                {errors.validUntil.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <FormSelect
                            label="Quotations Linked"
                            disabled={!isEditing}
                            {...register('quotationId')}
                        >
                            <option value="">Select quotation</option>
                            {(lookups.quotations || []).map((q) => (
                                <option key={q.id} value={q.id}>
                                    {q.quotation_no}
                                </option>
                            ))}
                        </FormSelect>
                        {errors.quotationId && (
                            <p className="text-red-500 text-[10px] mt-1 font-semibold">
                                {errors.quotationId.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <FormInput
                            label="Customer PO"
                            placeholder="PO No..."
                            disabled={!isEditing}
                            {...register('customerPo')}
                            charCount={customerPo.length}
                            maxChars={charLimits.customerPo}
                        />
                        {errors.customerPo && (
                            <p className="text-red-500 text-[10px] mt-1 font-semibold">
                                {errors.customerPo.message}
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
                            label="Exchange Rate"
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

                    <div >
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
