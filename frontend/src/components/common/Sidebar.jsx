import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FaChevronDown,
    FaBoxArchive,
    FaCartShopping,
    FaXmark,
    FaSliders, 
    FaFileInvoice,
    FaReceipt,
    FaFileLines,
    FaBasketShopping,
} from 'react-icons/fa6';
import { HiOutlineCircleStack } from 'react-icons/hi2';
import { FaUser } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const SIDEBAR_MENU_CONFIG = [
    {
        id: 'inventory',
        label: 'Inventory',
        icon: FaBoxArchive,
        subGroups: [
            {
                id: 'inventory_defs',
                label: 'Definitions',
                icon: FaSliders,
                links: [
                    {
                        id: 'item_file',
                        label: 'Item File',
                        icon: FaFileInvoice,
                        href: '/inventory/definitions/item-file/general',
                        basePath: '/inventory/definitions/item-file'
                    }
                ]
            }
        ]
    },
    {
        id: 'sales',
        label: 'Sales',
        icon: FaCartShopping,
        subGroups: [
            {
                id: 'sales_trans',
                label: 'Transactions',
                icon: FaReceipt,
                links: [
                    { id: 'sales_quotation', label: 'Sales Quotation', icon: FaFileLines, href: '#' },
                    { id: 'sales_order', label: 'Sales Order', icon: FaBasketShopping, href: '#' }
                ]
            }
        ]
    }
];

function Sidebar() {
    const location = useLocation();
    const currentPath = location.pathname;

    const [openMenus, setOpenMenus] = useState({
        inventory: true,
        sales: false,
        inventory_defs: true,
        sales_trans: false,
    });

    const toggleMenu = (menuId) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menuId]: !prev[menuId],
        }));
    };

    return (
        <div className="flex h-full w-64 flex-col justify-between bg-indigo-1000 text-slate-400 border-r border-indigo-500/20 selection:bg-indigo-500/30">
            <div className="overflow-y-auto flex-1 custom-scrollbar">
                
                <div className="flex items-center justify-between p-4 border-b border-indigo-1150">
                    <div className="flex items-center gap-2">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-linear-to-tr from-indigo-500 to-indigo-950">
                            <HiOutlineCircleStack className="text-white text-lg" />
                        </div>
                        <span className="text-base font-semibold tracking-wide text-white">
                            Exalore
                        </span>
                    </div>
                    <button className="text-slate-500 hover:text-white transition-colors cursor-pointer">
                        <FaXmark className="h-4 w-4" />
                    </button>
                </div>

                <nav className="p-3 space-y-1 text-xs">
                    <Link
                        to="/"
                        className={`flex items-center gap-2.5 rounded px-3 py-2 transition-all ${
                            currentPath === '/'
                                ? 'bg-indigo-600/15 text-indigo-400 font-semibold border-l-2 border-indigo-500'
                                : 'text-slate-300 hover:bg-indigo-1100 hover:text-white'
                        }`}
                    >
                        <MdDashboard className={`h-4 w-4 ${currentPath === '/' ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <span className="font-medium">Dashboard</span>
                    </Link>

                    {SIDEBAR_MENU_CONFIG.map((group, groupIdx) => {
                        const GroupIcon = group.icon;
                        const isGroupOpen = !!openMenus[group.id];

                        // FIX 1: Check active state using link.basePath if it exists
                        const isGroupActive = group.subGroups.some(sub => 
                            sub.links.some(link => {
                                const pathToCheck = link.basePath || link.href;
                                return pathToCheck !== '#' && currentPath.startsWith(pathToCheck);
                            })
                        );

                        return (
                            <div 
                                key={group.id} 
                                className={`space-y-0.5 ${groupIdx > 0 ? 'pt-1' : ''}`}
                            >
                                <button
                                    onClick={() => toggleMenu(group.id)}
                                    className={`flex w-full items-center justify-between rounded px-3 py-2 transition-all cursor-pointer ${
                                        isGroupActive 
                                            ? 'text-slate-200 bg-indigo-1100/40 font-semibold text-white' 
                                            : 'text-slate-400 hover:bg-indigo-1100 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <GroupIcon className={`h-3.5 w-3.5 ${isGroupActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                                        <span>{group.label}</span>
                                    </div>
                                    <FaChevronDown
                                        className={`h-2.5 w-2.5 transition-transform duration-200 ${
                                            isGroupActive ? 'text-slate-400' : 'text-slate-600'
                                        } ${isGroupOpen ? 'rotate-0' : '-rotate-90'}`}
                                    />
                                </button>

                                <div
                                    className={`pl-4 border-l border-indigo-500/50 ml-4 space-y-0.5 overflow-hidden transition-all duration-200 ${
                                        isGroupOpen ? 'max-h-40 opacity-100 mt-0.5' : 'max-h-0 opacity-0 pointer-events-none'
                                    }`}
                                >
                                    {group.subGroups.map((subGroup) => {
                                        const SubGroupIcon = subGroup.icon;
                                        const isSubGroupOpen = !!openMenus[subGroup.id];

                                        // FIX 2: Check active subgroup state using link.basePath if it exists
                                        const isSubGroupActive = subGroup.links.some(link => {
                                            const pathToCheck = link.basePath || link.href;
                                            return pathToCheck !== '#' && currentPath.startsWith(pathToCheck);
                                        });

                                        return (
                                            <div key={subGroup.id} className="space-y-0.5">
                                                <button
                                                    onClick={() => toggleMenu(subGroup.id)}
                                                    className={`flex w-full items-center justify-between py-1.5 px-2 rounded transition-all font-medium cursor-pointer ${
                                                        isSubGroupActive
                                                            ? 'text-slate-200 bg-indigo-1100/20'
                                                            : 'text-slate-300 hover:bg-indigo-1100 hover:text-white'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <SubGroupIcon className={`h-3 w-3 ${isSubGroupActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                                                        <span>{subGroup.label}</span>
                                                    </div>
                                                    <FaChevronDown
                                                        className={`h-2 w-2 text-slate-500 transition-transform duration-200 ${isSubGroupOpen ? 'rotate-0' : '-rotate-90'}`}
                                                    />
                                                </button>

                                                <div
                                                    className={`pl-3 border-l border-indigo-500/50 ml-2 overflow-hidden transition-all duration-200 ${
                                                        isSubGroupOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                                                    } ${subGroup.links.length > 1 ? 'space-y-0.5' : ''}`}
                                                >
                                                    {subGroup.links.map((link) => {
                                                        const LinkIcon = link.icon;
                                                        
                                                        // FIX 3: Base focus check on the shared root layout path
                                                        const pathToCheck = link.basePath || link.href;
                                                        const isLinkActive = pathToCheck !== '#' && currentPath.startsWith(pathToCheck);
                                                        
                                                        return (
                                                            <Link
                                                                key={link.id}
                                                                to={link.href}
                                                                className={`flex items-center gap-2 rounded py-1.5 px-3 transition-all ${
                                                                    isLinkActive
                                                                        ? 'bg-indigo-600/15 text-indigo-400 font-semibold border-l-2 border-indigo-500'
                                                                        : 'hover:bg-indigo-1100 hover:text-white transition-colors'
                                                                }`}
                                                            >
                                                                <LinkIcon className={`h-3 w-3 ${isLinkActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                                                                <span>{link.label}</span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>
            </div>

            <div className="m-3 rounded-lg bg-indigo-1100 p-3 text-[11px] border border-indigo-1200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-200">
                    <FaUser className="text-indigo-400 text-xs" />
                    <span className="font-medium truncate">admin</span>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;