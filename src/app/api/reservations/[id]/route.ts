import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendReservationEmail } from '@/lib/resend';
import { Reservation, ReservationStatus } from '@/types/database';

// PATCH endpoint to update reservation status (Admin only)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status } = body;
        const isAdmin = request.headers.get('x-admin-secret') === process.env.ADMIN_SECRET;

        if (!isAdmin) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (!id) throw new Error("Reservation ID is required");
        if (!status) throw new Error("Status is required");

        // Fetch current data
        const { data: existingData, error: fetchError } = await (supabase
            .from('reservations') as any)
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !existingData) {
            return NextResponse.json(
                { error: 'Reservation not found' },
                { status: 404 }
            );
        }

        // Update status
        const { data, error } = await (supabase
            .from('reservations') as any)
            .update({
                status: status as ReservationStatus,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to update status' },
                { status: 500 }
            );
        }

        // Send status update email if needed
        if (status === 'confirmed' || status === 'cancelled') {
            try {
                await sendReservationEmail({
                    to: data.guest_email,
                    name: data.guest_name,
                    confirmationCode: data.confirmation_code,
                    date: data.reservation_date,
                    time: data.reservation_time,
                    partySize: data.party_size,
                    isCancellation: status === 'cancelled'
                });
            } catch (emailError) {
                console.error('Status update email failed:', emailError);
            }
        }

        return NextResponse.json({
            success: true,
            reservation: data,
        });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) throw new Error("Reservation ID is required");

        // Fetch detailed info first to ensure we have data for the email
        const { data: existingData, error: fetchError } = await (supabase
            .from('reservations') as any)
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !existingData) {
            return NextResponse.json(
                { error: 'Reservation not found' },
                { status: 404 }
            );
        }

        const res = existingData as Reservation;

        // Update reservation status to cancelled
        const { data, error } = await (supabase
            .from('reservations') as any)
            .update({
                status: 'cancelled',
                cancelled_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        const reservationData = data as Reservation | null;

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to cancel reservation' },
                { status: 500 }
            );
        }

        if (!reservationData) {
            return NextResponse.json(
                { error: 'Reservation not found' },
                { status: 404 }
            );
        }

        // Send cancellation emails
        try {
            await sendReservationEmail({
                to: reservationData.guest_email,
                name: reservationData.guest_name,
                confirmationCode: reservationData.confirmation_code,
                date: reservationData.reservation_date,
                time: reservationData.reservation_time,
                partySize: reservationData.party_size,
                isCancellation: true
            });
        } catch (emailError) {
            console.error('Cancellation email failed:', emailError);
        }

        return NextResponse.json({
            success: true,
            message: 'Reservation cancelled successfully',
            reservation: data,
        });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
