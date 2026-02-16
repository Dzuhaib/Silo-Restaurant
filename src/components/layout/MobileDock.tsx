'use client';

import { Home, Info, CalendarDays, Utensils } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Dock from '../ui/Dock';

export default function MobileDock() {
    const router = useRouter();

    const items = [
        {
            icon: <Home size={22} />,
            label: 'Home',
            onClick: () => router.push('/'),
        },
        {
            icon: <Info size={22} />,
            label: 'About',
            onClick: () => router.push('/about'),
        },
        {
            icon: <CalendarDays size={22} />,
            label: 'My Reservations',
            onClick: () => router.push('/dashboard'),
        },
        {
            icon: <Utensils size={22} />,
            label: 'Reserve Now',
            onClick: () => router.push('/reserve'),
        },
    ];

    return <Dock items={items} magnification={70} distance={150} panelHeight={64} baseItemSize={48} />;
}
