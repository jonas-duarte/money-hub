import { Incoming } from "@/models/Incoming";
import { Import } from "../Import";
import * as xlsx from 'xlsx';

class B3Incomings implements Import<Incoming[]> {
    name = "b3-incomings-xlsx";

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

    fromFile = async (file: File) => {
        const data = await this.toBinaryString(file);
        const workbook = xlsx.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const range = xlsx.utils.decode_range(sheet['!ref'] as string);

        const incomings: Incoming[] = [];

        // For each row in the range
        for (let rowNum = 1; rowNum <= range.e.r; rowNum++) {
            const date = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 1 })]?.v;
            const type = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 2 })]?.v;
            const product = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 3 })]?.v;
            const quantity = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 5 })]?.v;
            const unitValue = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 6 })]?.v;
            const totalValue = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 7 })]?.v;

            if (date && product && quantity && unitValue && totalValue) {
                switch (type) {
                    case 'Juros Sobre Capital Próprio':
                    case 'Dividendo':
                        const [day, month, year] = date.split('/');
                        incomings.push({
                            id: `${file.name}-${rowNum}`,
                            title: `${quantity}x ${product.trim()}`,
                            amount: totalValue,
                            date: new Date(`${year}-${month}-${day} 00:00:00`).toISOString(),
                            assetId: product.trim().split(' ')[0],
                            category: 'stock-earning',
                            origin: this.name,
                        });
                        break;
                    // Doesn't matter for now
                    case 'Transferência - Liquidação':
                    case 'Transferência':
                        break;
                    default:
                        alert(`Tipo de operação não suportada: ${type}`);
                        break;
                }
            }
        }

        return incomings;
    };
}

const b3IncomingsIntegration = new B3Incomings();

export default b3IncomingsIntegration;