import Table, { TableColumn, TableColumnType } from "@/components/Table";
import { Asset } from "@/models/Asset";
import { AssetsRepository } from "@/repositories/AssetsRepository";
import { useEffect, useState } from "react";

const columns: TableColumn[] = [
    { name: 'id', label: 'ID'},
    { name: 'title', label: 'Título' },
    { name: 'quantity', label: 'Quantidade' },
    { name: 'unitValue', label: 'Valor Unitário', type: TableColumnType.BrlCurrency },
    { name: 'totalValue', label: 'Valor Total', type: TableColumnType.BrlCurrency },
    { name: 'category', label: 'Categoria' },
];

const AssetsPage = () => {
    const [assets, setAssets] = useState<Asset[]>([]);

    useEffect(() => {
        const loadAssets = async () => {
            const assets = await AssetsRepository.getInstance().getAll();
            setAssets(assets);
        }

        loadAssets();
    }, []);

    return (<Table columns={columns} rows={assets} />);
}

export default AssetsPage;