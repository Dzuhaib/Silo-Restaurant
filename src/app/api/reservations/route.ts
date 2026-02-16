import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendReservationEmail } from '@/lib/resend';
import { Reservation, ReservationStatus } from '@/types/database';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate and trim required fields
        const guest_name = body.guest_name?.trim();
        const guest_email = body.guest_email?.trim().toLowerCase();
        const guest_phone = body.guest_phone?.trim();
        const party_size = body.party_size;
        const reservation_date = body.reservation_date;
        const reservation_time = body.reservation_time;
        const dietary_notes = body.dietary_notes?.trim();
        const special_requests = body.special_requests?.trim();

        if (!guest_name || !guest_email || !guest_phone || !party_size || !reservation_date || !reservation_time) {
            console.log('Missing fields:', { guest_name, guest_email, guest_phone, party_size, reservation_date, reservation_time });
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        console.log('Received reservation request for:', guest_email, 'on', reservation_date, 'at', reservation_time);

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(guest_email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate party size
        if (party_size < 1 || party_size > 20) {
            return NextResponse.json(
                { error: 'Party size must be between 1 and 20' },
                { status: 400 }
            );
        }

        // Validate date is in the future
        // Adding :00 ensures full ISO format for strict parsers like Safari
        const reservationDateTime = new Date(`${reservation_date}T${reservation_time}:00`);
        if (isNaN(reservationDateTime.getTime()) || reservationDateTime <= new Date()) {
            return NextResponse.json(
                { error: 'Reservation must be in the future and have a valid date/time' },
                { status: 400 }
            );
        }

        // Generate confirmation code
        const confirmationCode = `SILO${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        // Insert reservation into database
        const { data, error } = await (supabase
            .from('reservations') as any)
            .insert([
                {
                    guest_name,
                    guest_email,
                    guest_phone,
                    party_size,
                    reservation_date,
                    reservation_time,
                    dietary_notes: dietary_notes || null,
                    special_requests: special_requests || null,
                    status: 'pending' as ReservationStatus,
                    confirmation_code: confirmationCode,
                },
            ])
            .select()
            .single();

        const reservationData = data as Reservation | null;

        if (error) {
            console.error('Supabase error:', error);

            let userErrorMessage = 'Failed to create reservation. Please try again.';

            // Check specifically for missing table or API key issues
            if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
                userErrorMessage = 'CRITICAL: The "reservations" table has not been created in Supabase yet. Please run the SQL script in your Supabase SQL Editor.';
            } else if (error.message?.includes('JWT') || error.message?.includes('invalid key')) {
                userErrorMessage = 'CRITICAL: Invalid Supabase API Key. Your current key seems to be a Stripe key (starts with sb_publishable_). Please use your Supabase "anon" key found in Project Settings > API.';
            } else if (error.message) {
                userErrorMessage = `Database Error: ${error.message}`;
            }

            return NextResponse.json(
                { error: userErrorMessage, debug: error },
                { status: 500 }
            );
        }

        // Send confirmation emails
        try {
            await sendReservationEmail({
                to: guest_email,
                name: guest_name,
                confirmationCode,
                date: reservation_date,
                time: reservation_time,
                partySize: party_size,
            });
        } catch (emailError) {
            console.error('Email notification failed:', emailError);
            // We don't fail the request if email fails, but we log it
        }

        // Return success with confirmation code
        return NextResponse.json(
            {
                success: true,
                confirmationCode,
                reservation: data,
                message: 'Reservation created successfully!',
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET endpoint to fetch reservations
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const confirmationCode = searchParams.get('code');
        const isAdmin = request.headers.get('x-admin-secret') === process.env.ADMIN_SECRET;

        // If not admin, required email or code
        if (!isAdmin && !email && !confirmationCode) {
            return NextResponse.json(
                { error: 'Email or confirmation code required' },
                { status: 400 }
            );
        }

        let query = supabase.from('reservations').select('*');

        if (!isAdmin) {
            if (confirmationCode) {
                query = query.eq('confirmation_code', confirmationCode);
            } else if (email) {
                query = query.eq('guest_email', email);
            }
        }
        // If admin and no specific filter, it will fetch all

        const { data, error } = await query.order('reservation_date', { ascending: true });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch reservations' },
                { status: 500 }
            );
        }

        return NextResponse.json({ reservations: data || [] });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
