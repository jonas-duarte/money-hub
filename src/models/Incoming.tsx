export type IncomingCategory = 'stock-earning' | 'other';

export interface Incoming {
    id: string;
    title: string;
    date: string;
    category: IncomingCategory;
    amount: number;
    origin?: string;
    assetId?: string;
}