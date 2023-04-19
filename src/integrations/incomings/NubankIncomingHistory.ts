import { Import } from "../Import";
import { Incoming, IncomingCategory } from "@/models/Incoming";

// export interface Incoming {
//     id: string;
//     title: string;
//     date: string;
//     category: IncomingCategory;
//     amount: number;
//     origin?: string;
//     assetId?: string;
// }

function findCategory(title: string): IncomingCategory {
    
    return 'other';
}

class NubankIncomingHistory implements Import<Incoming[]> {
    name = "nubank-history-csv-incomings";
    fromFile = async (file: File) => {
        const csv = await file.text();
        const lines = csv.split("\n");
        const incomings: Incoming[] = [];
        // Data,Valor,Identificador,Descrição
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const [date, amount, id, title] = line.split(",");

            if (!date || !amount || !id || !title) {
                continue;
            }

            const [day, month, year] = date.split("/");
            const _date = new Date(`${year}-${month}-${day} 00:00:00`).toISOString();
            const _amount = parseFloat(amount);

            if (isNaN(_amount) || _amount <= 0) {
                continue;
            }

            incomings.push({
                id: `${file.name}-${i}`, // TODO: use a better id
                date: _date,
                category: findCategory(title),
                title,
                amount: _amount,
                origin: this.name
            });
        }
        return incomings;
    };
}

const nubankIncomingHistoryIntegration = new NubankIncomingHistory();

export default nubankIncomingHistoryIntegration;