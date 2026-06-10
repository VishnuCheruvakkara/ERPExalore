import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaFileInvoice, FaSliders, FaReceipt, FaImage } from 'react-icons/fa6';
import { MdGridOn } from "react-icons/md";
import { MdFormatListBulleted } from 'react-icons/md';

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

    return (
        <div className="flex flex-col h-full w-full space-y-4">
            <div className="flex items-center gap-3 border-b rounded-lg border-slate-200 p-2 bg-white">
                <div className="p-2.5 bg-slate-200 text-slate-700 rounded-lg shadow-xs">
                    <MdGridOn className="h-5 w-5" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">
                        Item File
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                        Units and barcode management
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto  ">
                {tabs.map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = location.pathname === tab.path;

                    return (
                        <Link
                            key={tab.id}
                            to={tab.path}
                            className={`flex items-start gap-2.5 rounded-lg border px-4 py-2.5 min-w-40 transition-all cursor-pointer ${
                                isActive
                                    ? 'bg-white text-indigo-600 border-slate-200 shadow-xs ring-1 ring-slate-100 font-semibold'
                                    : 'bg-transparent text-slate-700 border-transparent hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <TabIcon
                                className={`h-4 w-4 mt-0.5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}
                            />
                            <div className="flex flex-col text-left">
                                <span className="text-xs leading-none">
                                    {tab.label}
                                </span>
                                <span className={`text-[10px] font-normal mt-0.5 tracking-tight truncate max-w-[130px] ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                                    {tab.desc}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="flex-1 w-full pt-1">
                <Outlet />
            </div>
        </div>
    );
}

export default ItemFileLayout;