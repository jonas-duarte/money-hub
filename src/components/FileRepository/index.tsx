import { useState } from "react";
import Table, { TableColumn, TableColumnType } from "../Table";
import styles from './FileRepository.module.css';
import nubankCreditCardIntegration from "@/integrations/outgoings/NubankCreditCard";
import { OutgoingsRepository } from "@/repositories/OutgoingsRepository";
import { Outgoing } from "@/models/Outgoing";
import { Asset } from "@/models/Asset";
import { AssetsRepository } from "@/repositories/AssetsRepository";
import { Incoming } from "@/models/Incoming";
import { IncomingsRepository } from "@/repositories/IncomingsRepository";
import b3AssetsIntegration from "@/integrations/assets/B3Assets";
import b3IncomingsIntegration from "@/integrations/incomings/B3Incomes";
import nubankIncomingHistoryIntegration from "@/integrations/incomings/NubankIncomingHistory";
import nubankOutgoingHistoryIntegration from "@/integrations/outgoings/NubankIncomingHistory";

const columns: TableColumn[] = [
    { name: 'name', label: 'File' },
    { name: 'size', label: 'Size' },
    { name: 'type', label: 'Type' },
    { name: 'lastModified', label: 'Last Modified', type: TableColumnType.Date },
    { name: 'model', label: 'Model' },
];

function getIntegrationName(file: File) {
    if (file.name.includes('nubank')) {
        return nubankCreditCardIntegration.name;
    }
    if (file.name.includes('posicao')) {
        return b3AssetsIntegration.name;
    }
    if (file.name.includes('movimentacao')) {
        return b3IncomingsIntegration.name;
    }
    if (file.name.includes('NU_')) {
        return 'nubank-history';
    }
    return 'unknown';
}

const FileRepository = () => {
    const [files, setFiles] = useState<File[]>([]);

    const handleFileUpload = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files: FileList = e.dataTransfer.files;
        const filesArray = Array.from(files);
        setFiles(filesArray.sort((a, b) => a.name.localeCompare(b.name)));
    }

    const handleImportAll = async () => {
        let outgoings: Outgoing[] = [];
        let assets: Asset[] = [];
        let incomings: Incoming[] = [];
        for (const file of files) {
            if (file.name.includes('nubank')) {
                outgoings = [...outgoings, ...await nubankCreditCardIntegration.fromFile(file)];
            }
            if (file.name.includes('posicao')) {
                assets = [...assets, ...await b3AssetsIntegration.fromFile(file)];
            }
            if (file.name.includes('movimentacao')) {
                incomings = [...incomings, ...await b3IncomingsIntegration.fromFile(file)];
            }
            if (file.name.includes('NU_')) {
                incomings = [...incomings, ...await nubankIncomingHistoryIntegration.fromFile(file)];
                outgoings = [...outgoings, ...await nubankOutgoingHistoryIntegration.fromFile(file)];
            }
        };

        await Promise.all([
            OutgoingsRepository.getInstance().add(outgoings),
            AssetsRepository.getInstance().add(assets),
            IncomingsRepository.getInstance().add(incomings)
        ]);

        alert('Imported!');
    }


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>File Repository</h1>
                <button onClick={handleImportAll}>Import All</button>
            </div>
            <div
                className={styles.files}
                onDrop={handleFileUpload}
                onDragOver={(e) => e.preventDefault()}
            >
                <Table columns={columns} rows={files.map(file => ({
                    name: file.name,
                    size: `${(file.size / 1024).toFixed(2)} KB`,
                    type: file.type,
                    lastModified: file.lastModified,
                    model: getIntegrationName(file)
                }))} />
            </div>
        </div>
    );
}

export default FileRepository;