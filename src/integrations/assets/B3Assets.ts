import { Asset } from "@/models/Asset";
import { Import } from "../Import";
import * as xlsx from 'xlsx';

class B3Assets implements Import<Asset[]> {
    name = "b3-assets-xlsx";

    private toBinaryString = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target) {
                    resolve(e.target.result as string);
                } else {
                    reject(new Error("FileReader error"));
                }
            };
            reader.readAsBinaryString(file);
        });
    };

    private getStockShares = (sheet: xlsx.WorkSheet): Asset[] => {
        const stockShares: Asset[] = [];
        const range = xlsx.utils.decode_range(sheet['!ref'] as string);

        // For each row in the range
        for (let rowNum = 1; rowNum <= range.e.r; rowNum++) {
            const product = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 0 })]?.v;
            const symbol = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 3 })]?.v;
            const quantity = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 8 })]?.v;
            const unitValue = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 12 })]?.v;
            const totalValue = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 13 })]?.v;

            if (product && symbol && quantity && unitValue && totalValue) {
                const stockShare = stockShares.find((stockShare) => stockShare.id === symbol);
                if (!stockShare) {
                    stockShares.push({
                        id: symbol,
                        title: product.trim(),
                        quantity: quantity,
                        unitValue: unitValue,
                        totalValue: totalValue,
                        category: 'stocks',
                    });
                } else {
                    stockShare.quantity += quantity;
                    stockShare.totalValue += totalValue;
                }
            }
        }
        return stockShares;
    };

    private getBDRs = (sheet: xlsx.WorkSheet): Asset[] => {
        const bdrs: Asset[] = [];
        const range = xlsx.utils.decode_range(sheet['!ref'] as string);

        // For each row in the range
        for (let rowNum = 1; rowNum <= range.e.r; rowNum++) {
            const product = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 0 })]?.v;
            const code = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 3 })]?.v;
            const quantity = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 8 })]?.v;
            const unitValue = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 11 })]?.v;
            const totalValue = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 12 })]?.v;

            if (product && code && quantity && unitValue && totalValue) {
                const bdr = bdrs.find((bdr) => bdr.id === code);
                if (!bdr) {
                    bdrs.push({
                        id: code,
                        title: product.trim(),
                        quantity: quantity,
                        unitValue: unitValue,
                        totalValue: totalValue,
                        category: 'stocks',
                    });
                } else {
                    bdr.quantity += quantity;
                    bdr.totalValue += totalValue;
                }
            }
        }

        return bdrs;
    };

    private getBounds = (sheet: xlsx.WorkSheet): Asset[] => {
        const bounds: Asset[] = [];
        const range = xlsx.utils.decode_range(sheet['!ref'] as string);

        // For each row in the range
        for (let rowNum = 1; rowNum <= range.e.r; rowNum++) {
            const product = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 0 })]?.v;
            const code = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 3 })]?.v;
            const quantity = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 8 })]?.v;
            const unitValue = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 12 })]?.v;
            const totalValue = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 13 })]?.v;

            if (product && code && quantity) {
                const bound = bounds.find((bound) => bound.id === code);
                if (!bound) {
                    bounds.push({
                        id: code,
                        title: product.trim(),
                        quantity: quantity,
                        unitValue: parseInt(unitValue as string) || 0,
                        totalValue: parseInt(totalValue as string) || 0,
                        category: 'bonds',
                    });
                } else {
                    bound.quantity += parseInt(quantity as string) || 0;
                    bound.totalValue += parseInt(totalValue as string) || 0;
                }
            }
        }

        return bounds;
    };

    fromFile = async (file: File) => {
        const data = await this.toBinaryString(file);
        const workbook = xlsx.read(data, { type: 'binary' });
        const stockShares = this.getStockShares(workbook.Sheets['Acoes']);
        const bdrs = this.getBDRs(workbook.Sheets['BDR']);
        const bounds = this.getBounds(workbook.Sheets['Renda Fixa']);
        return [...stockShares, ...bdrs, ...bounds];
    };
}

const b3AssetsIntegration = new B3Assets();

export default b3AssetsIntegration;