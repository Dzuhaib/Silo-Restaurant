// Database Types for Silo Restaurant Reservation System

export interface Profile {
    id: string;
    full_name: string | null;
    email: string;
    phone: string | null;
    avatar_url: string | null;
    dietary_restrictions: string[] | null;
    created_at: string;
    updated_at: string;
}

export interface Table {
    id: string;
    table_number: string;
    capacity: number;
    min_capacity: number | null;
    location: string | null; // 'window' | 'patio' | 'main-room' | 'private' | 'bar'
    is_active: boolean;
    created_at: string;
}

export interface OperatingHours {
    id: string;
    day_of_week: number; // 0-6, 0 = Sunday
    open_time: string; // HH:MM format
    close_time: string;
    is_closed: boolean;
    created_at: string;
}

export interface BlockedDate {
    id: string;
    blocked_date: string; // YYYY-MM-DD
    reason: string | null;
    all_day: boolean;
    start_time: string | null;
    end_time: string | null;
    created_at: string;
}

export type ReservationStatus =
    | 'pending'
    | 'confirmed'
    | 'seated'
    | 'completed'
    | 'cancelled'
    | 'no_show';

export interface Reservation {
    id: string;
    user_id?: string | null;
    table_id?: string | null;
    confirmation_code: string;

    // Guest Information
    guest_name: string;
    guest_email: string;
    guest_phone: string;

    // Reservation Details
    party_size: number;
    reservation_date: string; // YYYY-MM-DD
    reservation_time: string; // HH:MM
    duration_minutes?: number;

    // Special Requests
    special_requests?: string | null;
    dietary_notes?: string | null;
    occasion?: string | null; // 'birthday' | 'anniversary' | 'business' | etc.

    // Status
    status: ReservationStatus;

    // Timestamps
    created_at: string;
    updated_at: string;
    cancelled_at?: string | null;
    cancellation_reason?: string | null;
}

export interface ReservationWithTable extends Reservation {
    table: Table | null;
}

export interface Review {
    id: string;
    reservation_id: string;
    user_id: string | null;
    rating: number; // 1-5
    food_rating: number | null;
    service_rating: number | null;
    ambiance_rating: number | null;
    comment: string | null;
    image_urls: string[] | null;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
}

export interface ReviewWithProfile extends Review {
    profile: Pick<Profile, 'full_name' | 'avatar_url'> | null;
}

export interface NotificationPreferences {
    user_id: string;
    email_confirmations: boolean;
    email_reminders: boolean;
    sms_reminders: boolean;
    updated_at: string;
}

// ==============================
// SUPABASE DATABASE TYPE
// ==============================

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Profile, 'id'>>;
            };
            tables: {
                Row: Table;
                Insert: Omit<Table, 'id' | 'created_at'>;
                Update: Partial<Omit<Table, 'id'>>;
            };
            operating_hours: {
                Row: OperatingHours;
                Insert: Omit<OperatingHours, 'id' | 'created_at'>;
                Update: Partial<Omit<OperatingHours, 'id'>>;
            };
            blocked_dates: {
                Row: BlockedDate;
                Insert: Omit<BlockedDate, 'id' | 'created_at'>;
                Update: Partial<Omit<BlockedDate, 'id'>>;
            };
            reservations: {
                Row: Reservation;
                Insert: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Reservation, 'id'>>;
            };
            reviews: {
                Row: Review;
                Insert: Omit<Review, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Review, 'id'>>;
            };
            notification_preferences: {
                Row: NotificationPreferences;
                Insert: NotificationPreferences;
                Update: Partial<NotificationPreferences>;
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
    };
}

// ==============================
// FORM TYPES
// ==============================

export interface ReservationFormData {
    date: Date;
    time: string;
    partySize: number;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    specialRequests?: string;
    dietaryNotes?: string;
    occasion?: string;
}

export interface ReviewFormData {
    rating: number;
    foodRating?: number;
    serviceRating?: number;
    ambianceRating?: number;
    comment?: string;
    images?: File[];
}

// ==============================
// AVAILABILITY TYPES
// ==============================

export interface TimeSlot {
    time: string; // HH:MM format
    available: boolean;
    tableIds: string[];
}

export interface DayAvailability {
    date: string; // YYYY-MM-DD
    isOpen: boolean;
    isBlocked: boolean;
    timeSlots: TimeSlot[];
}

// ==============================
// API RESPONSE TYPES
// ==============================

export interface AvailabilityResponse {
    date: string;
    available: boolean;
    slots: TimeSlot[];
}

export interface ReservationResponse {
    success: boolean;
    reservation?: Reservation;
    error?: string;
}
