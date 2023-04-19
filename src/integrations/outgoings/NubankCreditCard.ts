import { Import } from "../Import";
import { Outgoing, OutgoingCategory } from "@/models/Outgoing";

// Example of a CSV file:
// date,category,title,amount
// 2018-02-21,viagem,Azul Linhas 1/6,61.35

function findCategory(category: string): OutgoingCategory {
    switch (category) {
        case 'viagem':
            return 'travel';
        case 'vestuário':
            return 'clothes';
        case 'transporte':
            return 'transport';
        case 'supermercado':
            return 'groceries';
        case 'serviços':
            return 'services';
        case 'saúde':
            return 'health';
        case 'restaurante':
            return 'restaurant';
        case 'lazer':
            return 'entertainment';
        case 'eletrônicos':
            return 'electronics';
        case 'educação':
            return 'education';
        case 'casa':
            return 'home';
        default:
            return 'other';
    }
}

class NubankCreditCard implements Import<Outgoing[]> {
    name = "nubank-credit-card-csv-outgoings";
    fromFile = async (file: File) => {
        const csv = await file.text();
        const lines = csv.split("\n");
        const outgoings: Outgoing[] = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const [date, category, title, amount] = line.split(",");
            const _date = new Date(`${date} 00:00:00`).toISOString();
            const _amount = parseFloat(amount);

            if(isNaN(_amount) || _amount <= 0) {
                continue;
            }

            outgoings.push({
                id: `${file.name}-${i}`, // TODO: use a better id
                date: _date,
                category: findCategory(category),
                title,
                amount: _amount,
                origin: this.name
            });
        }
        return outgoings;
    };
}

const nubankCreditCardIntegration = new NubankCreditCard();

export default nubankCreditCardIntegration;