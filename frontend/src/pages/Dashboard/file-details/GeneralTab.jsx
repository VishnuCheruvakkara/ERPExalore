export function GeneralTab() {
    return (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 space-y-6">
            <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="space-y-1.5"><label className="text-xs font-medium text-slate-600">Item Code</label><input type="text" placeholder="Enter item code" className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md bg-slate-50/50 focus:bg-white" /></div>
                    <div className="space-y-1.5"><label className="text-xs font-medium text-slate-600">Name 2</label><input type="text" placeholder="Enter name 2" className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md bg-slate-50/50 focus:bg-white" /></div>
                    <div className="space-y-1.5"><label className="text-xs font-medium text-slate-600">Name 1 *</label><input type="text" placeholder="Enter name 1" className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md bg-slate-50/50 focus:bg-white" /></div>
                </div>
            </div>
            
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-medium">New</button>
                <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium">List</button>
                <button className="px-4 py-1.5 bg-slate-500 hover:bg-slate-600 text-white rounded text-xs font-medium">Clear</button>
            </div>
        </div>
    );
}