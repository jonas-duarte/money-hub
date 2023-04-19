import Table, { TableColumn, TableColumnType } from "@/components/Table";
import { Incoming } from "@/models/Incoming";
import { IncomingsRepository } from "@/repositories/IncomingsRepository";
import { useEffect, useState } from "react";

const columns: TableColumn[] = [
    { name: 'date', label: 'Data', type: TableColumnType.Date },
    { name: 'category', label: 'Categoria' },
    { name: 'title', label: 'Título' },
    { name: 'amount', label: 'Valor', type: TableColumnType.BrlCurrency },
    { name: 'origin', label: 'Origem' },
    { name: 'assetId', label: 'Ativo' },
];

const IncomingsPage = () => {
    const [incomings, setIncomings] = useState<Incoming[]>([]);

    useEffect(() => {
        const loadIncomings = async () => {
            const Incomings = await IncomingsRepository.getInstance().getAll();
            setIncomings(Incomings);
        }

        loadIncomings();
    }, []);

    return (<Table columns={columns} rows={incomings} />);
}

export default IncomingsPage;