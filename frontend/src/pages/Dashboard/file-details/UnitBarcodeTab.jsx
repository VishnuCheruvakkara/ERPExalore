export function UnitBarcodeTab() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
                <h3 className="text-xs font-semibold text-slate-700">Unit Management</h3>
                <div className="flex gap-3 items-end">
                    <div className="flex-1 space-y-1"><label className="text-[11px] font-medium text-slate-500">Unit</label><select className="w-full text-xs px-3 py-2 border border-slate-200 rounded bg-white text-slate-400"><option>Select unit</option></select></div>
                    <div className="w-32 space-y-1"><label className="text-[11px] font-medium text-slate-500">Cofactor</label><input type="number" defaultValue={1} className="w-full text-xs px-3 py-2 border border-slate-200 rounded" /></div>
                    <button className="px-4 py-2 bg-slate-300 text-white rounded text-xs font-medium cursor-not-allowed">+ Add Unit</button>
                </div>
                <div className="border border-dashed border-slate-200 rounded-lg p-12 text-center text-xs text-slate-400">No units added yet</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 flex flex-col justify-between">
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-700">Unit Settings</h3>
                    <div className="space-y-1"><label className="text-[11px] font-medium text-slate-500">Sales Unit</label><select className="w-full text-xs px-3 py-2 border border-slate-200 rounded bg-white"><option>Select sales unit</option></select></div>
                </div>
                <button className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-xs shadow-xs">Save Settings</button>
            </div>
        </div>
    );
}