import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaFileInvoice, FaSliders, FaImage } from 'react-icons/fa6';
import { MdGridOn, MdFormatListBulleted } from "react-icons/md";

function ItemFileLayout() {
    const location = useLocation();

    const tabs = [
        {
            id: 'general',
            label: 'General',
            desc: 'Basic item information',
            icon: FaFileInvoice,
            path: '/inventory/definitions/item-file/general',
        },
        {
            id: 'unit',
            label: 'Unit & Barcode',
            desc: 'Units and barcode management',
            icon: MdFormatListBulleted,
            path: '/inventory/definitions/item-file/unit-barcode',
        },
        {
            id: 'price',
            label: 'Price List',
            desc: 'Pricing information',
            icon: FaSliders,
            path: '/inventory/definitions/item-file/price-list',
        },
        {
            id: 'photo',
            label: 'Photo',
            desc: 'Item image',
            icon: FaImage,
            path: '/inventory/definitions/item-file/photo',
        },
    ];

    // Find active tab to display its description dynamically in the header
    const activeTab = tabs.find((tab) => 
        location.pathname === tab.path || 
        (tab.id === 'general' && location.pathname === '/inventory/definitions/item-file')
    ) || tabs[0];

    return (
        // Changed h-full to max-h-full and added overflow-hidden to prevent layout shattering
        <div className="flex flex-col h-full w-full space-y-3 p-2 overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center gap-3 border-b rounded-lg border-slate-200 p-2 bg-white flex-shrink-0">
                <div className="p-2.5 bg-slate-200 text-slate-700 rounded-lg shadow-xs">
                    <MdGridOn className="h-5 w-5" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">
                        Item File
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                        {activeTab.desc}
                    </p>
                </div>
            </div>

            {/* Tabs Container - flex-shrink-0 keeps it locked at the top */}
            <div className="flex items-center gap-2 overflow-x-auto  w-full flex-shrink-0">
                {tabs.map((tab) => {
                    const TabIcon = tab.icon;
                    
                    // Matches exact path OR defaults 'general' styling on base URL layout
                    const isActive = 
                        location.pathname === tab.path || 
                        (tab.id === 'general' && location.pathname === '/inventory/definitions/item-file');

                    return (
                        <Link
                            key={tab.id}
                            to={tab.path}
                            className={`flex items-start gap-2.5 rounded-lg border px-4 py-2 min-w-[170px] flex-shrink-0 transition-all cursor-pointer ${
                                isActive
                                    ? 'bg-white text-indigo-600 border-slate-200 shadow-xs ring-1 ring-slate-100 font-semibold'
                                    : 'bg-transparent text-slate-700 border-transparent hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <TabIcon
                                className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}
                            />
                            <div className="flex flex-col text-left min-w-0 w-full">
                                <span className="text-xs leading-tight font-medium truncate">
                                    {tab.label}
                                </span>
                                <span className={`text-[10px] font-normal mt-0.5 tracking-tight truncate ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>
                                    {tab.desc}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Scrollable Tab Content Body View */}
            <div className="flex-1 w-full overflow-y-auto pr-1">
                <Outlet />
            </div>
        </div>
    );
}

export default ItemFileLayout;