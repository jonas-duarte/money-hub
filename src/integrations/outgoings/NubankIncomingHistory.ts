import { Import } from "../Import";
import { Outgoing, OutgoingCategory } from "@/models/Outgoing";

// export interface Outgoing {
//     id: string;
//     title: string;
//     date: string;
//     category: OutgoingCategory;
//     amount: number;
//     origin?: string;
//     assetId?: string;
// }

function findCategory(title: string): OutgoingCategory {
    
    return 'other';
}

class NubankOutgoingHistory implements Import<Outgoing[]> {
    name = "nubank-history-csv-outgoings";
    fromFile = async (file: File) => {
        const csv = await file.text();
        const lines = csv.split("\n");
        const Outgoings: Outgoing[] = [];
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

            if (isNaN(_amount) || _amount >= 0) {
                continue;
            }

            Outgoings.push({
                id: `${file.name}-${i}`, // TODO: use a better id
                date: _date,
                category: findCategory(title),
                title,
                amount: Math.abs(_amount),
                origin: this.name
            });
        }
        return Outgoings;
    };
}

const nubankOutgoingHistoryIntegration = new NubankOutgoingHistory();

export default nubankOutgoingHistoryIntegration;