import DashboardLayout from '../../layout/DashboardLayout';
import UserRouteProtection from '../protection/UserRouteProtection';

import Home from '../../pages/dashboard/Home';

import ItemFileLayout from '../../layout/ItemFileLayout';
import { GeneralTab } from '../../pages/dashboard/file-details/GeneralTab';
import { UnitBarcodeTab } from '../../pages/dashboard/file-details/UnitBarcodeTab';
import { PriceListTab } from '../../pages/dashboard/file-details/PriceListTab';
import { PhotoTab } from '../../pages/dashboard/file-details/PhotoTab';
import SalesQuotation from '../../pages/sales/SalesQuotation';
import SalesOrder from '../../pages/sales/SalesOrder';

import ErrorPage from '../../pages/error-boundary/ErrorPage';

export const userRoutes = [
    {
        path: '/',
        element: (
            <UserRouteProtection>
                <DashboardLayout />
            </UserRouteProtection>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'inventory/definitions/item-file',
                element: <ItemFileLayout />,
                children: [
                    {
                        index: true,
                        element: <GeneralTab />,
                    },
                    {
                        path: 'general',
                        element: <GeneralTab />,
                    },
                    {
                        path: 'unit-barcode',
                        element: <UnitBarcodeTab />,
                    },
                    {
                        path: 'price-list',
                        element: <PriceListTab />,
                    },
                    {
                        path: 'photo',
                        element: <PhotoTab />,
                    },
                ],
            },
            {
                path: 'sales/transactions/sales-quotation',
                element: <SalesQuotation />,
            },
            {
                path: 'sales/transactions/sales-order',
                element: <SalesOrder />,
            },
        ],
    },
];
