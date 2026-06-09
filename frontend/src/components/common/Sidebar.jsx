import { useState } from 'react';
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

// NAVIGATION TREE SCHEMA
const SIDEBAR_MENU_CONFIG = [
    {
        id: 'inventory',
        label: 'Inventory',
        icon: FaBoxArchive,
        isDefaultActiveGroup: true, // Used to apply the text-slate-200 / bg-indigo-1100/40 styles
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
                        href: '#',
                        isActiveLink: true // Applies specific active styles and active border line
                    }
                ]
            }
        ]
    },
    {
        id: 'sales',
        label: 'Sales',
        icon: FaCartShopping,
        isDefaultActiveGroup: false,
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
    // 2. DYNAMIC STATE DICTIONARY (Tracks all open/closed configurations dynamically)
    const [openMenus, setOpenMenus] = useState({
        inventory: false,
        sales: false,
        inventory_defs: false,
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
            {/* TOP ZONE: Branding & Navigation Tree */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
                
                {/* Brand Block */}
                <div className="flex items-center justify-between p-4 border-b border-indigo-1150">
                    <div className="flex items-center gap-2">
                        {/* Logo Icon */}
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

                {/* Navigation Elements */}
                <nav className="p-3 space-y-1 text-xs">
                    {/* Dashboard Item */}
                    <a
                        href="#"
                        className="flex items-center gap-2.5 rounded px-3 py-2 text-slate-300 hover:bg-indigo-1100 hover:text-white transition-all"
                    >
                        <MdDashboard className="h-4 w-4 text-indigo-400" />
                        <span className="font-medium">Dashboard</span>
                    </a>

                    {/* DYNAMIC COMPONENT TREE MAPPING */}
                    {SIDEBAR_MENU_CONFIG.map((group, groupIdx) => {
                        const GroupIcon = group.icon;
                        const isGroupOpen = !!openMenus[group.id];

                        return (
                            <div 
                                key={group.id} 
                                className={`space-y-0.5 ${groupIdx > 0 ? 'pt-1' : ''}`}
                            >
                                {/* Toggle Header */}
                                <button
                                    onClick={() => toggleMenu(group.id)}
                                    className={`flex w-full items-center justify-between rounded px-3 py-2 transition-all cursor-pointer ${
                                        group.isDefaultActiveGroup 
                                            ? 'text-slate-200 bg-indigo-1100/40 hover:bg-indigo-1100 hover:text-white font-medium' 
                                            : 'text-slate-400 hover:bg-indigo-1100 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <GroupIcon className={`h-3.5 w-3.5 ${group.isDefaultActiveGroup ? 'text-indigo-400' : 'text-slate-500'}`} />
                                        <span>{group.label}</span>
                                    </div>
                                    <FaChevronDown
                                        className={`h-2.5 w-2.5 transition-transform duration-200 ${
                                            group.isDefaultActiveGroup ? 'text-slate-500' : 'text-slate-600'
                                        } ${isGroupOpen ? 'rotate-0' : '-rotate-90'}`}
                                    />
                                </button>

                                {/* Nested Items Containment with explicit hierarchy line */}
                                <div
                                    className={`pl-4 border-l border-indigo-500/50 ml-4 space-y-0.5 overflow-hidden transition-all duration-200 ${
                                        isGroupOpen ? 'max-h-40 opacity-100 mt-0.5' : 'max-h-0 opacity-0 pointer-events-none'
                                    }`}
                                >
                                    {group.subGroups.map((subGroup) => {
                                        const SubGroupIcon = subGroup.icon;
                                        const isSubGroupOpen = !!openMenus[subGroup.id];

                                        return (
                                            <div key={subGroup.id} className="space-y-0.5">
                                                {/* Sub-Group Toggle Header */}
                                                <button
                                                    onClick={() => toggleMenu(subGroup.id)}
                                                    className="flex w-full items-center justify-between py-1.5 px-2 rounded text-slate-300 hover:bg-indigo-1100 hover:text-white transition-all font-medium cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <SubGroupIcon className="h-3 w-3 text-slate-500" />
                                                        <span>{subGroup.label}</span>
                                                    </div>
                                                    <FaChevronDown
                                                        className={`h-2 w-2 text-slate-500 transition-transform duration-200 ${isSubGroupOpen ? 'rotate-0' : '-rotate-90'}`}
                                                    />
                                                </button>

                                                {/* Deep Links with nested tracking line */}
                                                <div
                                                    className={`pl-3 border-l border-indigo-500/50 ml-2 overflow-hidden transition-all duration-200 ${
                                                        isSubGroupOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                                                    } ${subGroup.links.length > 1 ? 'space-y-0.5' : ''}`}
                                                >
                                                    {subGroup.links.map((link) => {
                                                        const LinkIcon = link.icon;
                                                        
                                                        if (link.isActiveLink) {
                                                            return (
                                                                <a
                                                                    key={link.id}
                                                                    href={link.href}
                                                                    className="flex items-center gap-2 rounded bg-indigo-600/15 text-indigo-400 font-semibold py-1.5 px-3 border-l-2 border-indigo-500 transition-all"
                                                                >
                                                                    <LinkIcon className="h-3 w-3" />
                                                                    <span>{link.label}</span>
                                                                </a>
                                                            );
                                                        }

                                                        return (
                                                            <a
                                                                key={link.id}
                                                                href={link.href}
                                                                className="flex items-center gap-2 rounded py-1.5 px-3 hover:bg-indigo-1100 hover:text-white transition-colors"
                                                            >
                                                                <LinkIcon className="h-3 w-3 text-slate-500" />
                                                                <span>{link.label}</span>
                                                            </a>
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

            {/* BOTTOM ZONE: Database Node Identity Panel */}
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