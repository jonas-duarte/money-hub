export type OutgoingCategory = 'travel' | 'clothes' | 'transport' | 'groceries' | 'services' | 'health' | 'restaurant' | 'entertainment' | 'electronics' | 'education' | 'home' | 'other';

export interface Outgoing {
    id: string;
    title: string;
    date: string;
    category: string;
    amount: number;
    origin: string;
}