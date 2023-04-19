import Table, { TableColumn, TableColumnType } from "@/components/Table";
import { Outgoing } from "@/models/Outgoing";
import { OutgoingsRepository } from "@/repositories/OutgoingsRepository";
import { useEffect, useState } from "react";

const columns: TableColumn[] = [
    { name: 'date', label: 'Data', type: TableColumnType.Date },
    { name: 'category', label: 'Categoria' },
    { name: 'title', label: 'Título' },
    { name: 'amount', label: 'Valor', type: TableColumnType.BrlCurrency },
];

const OutgoingsPage = () => {
    const [outgoings, setOutgoings] = useState<Outgoing[]>([]);

    useEffect(() => {
        const loadOutgoings = async () => {
            const outgoings = await OutgoingsRepository.getInstance().getAll();
            setOutgoings(outgoings);
        }

        loadOutgoings();
    }, []);

    return (<Table columns={columns} rows={outgoings} />);
}

export default OutgoingsPage;