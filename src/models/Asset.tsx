export type AssetCategory = 'stocks' | 'bonds' | 'other';

export interface Asset {
    id: string;
    title: string;
    quantity: number;
    unitValue: number;
    totalValue: number;
    category: AssetCategory;
}
