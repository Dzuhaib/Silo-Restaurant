'use client';

import { Home, Info, CalendarDays, Utensils } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Dock from '../ui/Dock';

export default function MobileDock() {
    const router = useRouter();

    const items = [
        {
            icon: <Home size={24} />,
            label: 'Home',
            onClick: () => router.push('/'),
        },
        {
            icon: <Info size={24} />,
            label: 'About',
            onClick: () => router.push('/about'),
        },
        {
            icon: <CalendarDays size={24} />,
            label: 'My Reservations',
            onClick: () => router.push('/dashboard'),
        },
        {
            icon: <Utensils size={24} />,
            label: 'Reserve Now',
            onClick: () => router.push('/reserve'),
        },
    ];

    return <Dock items={items} />;
}
