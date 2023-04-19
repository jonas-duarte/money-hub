import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

import { ColDef } from 'ag-grid-community';

export enum TableColumnType {
    Text = 'text',
    Number = 'number',
    Date = 'date',
    BrlCurrency = 'brl-currency',
}

const columnDef: Record<TableColumnType, ColDef> = {
    [TableColumnType.Text]: {
        sortable: true,
        filter: true,
        resizable: true,
    },
    [TableColumnType.Number]: {
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'right' },
        cellRenderer: (params: any) => params.value?.toLocaleString('pt-BR'),
    },
    [TableColumnType.Date]: {
        sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: (params: any) => new Date(params.value).toLocaleString('pt-BR'),
    },
    [TableColumnType.BrlCurrency]: {
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'right' },
        cellRenderer: (params: any) => params.value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    },
};

export type TableColumn = {
    name: string;
    label: string;
    type?: TableColumnType;
};

type Row = {
    [key: string]: any;
};

export type TableProps = {
    columns: TableColumn[];
    rows: Row[];
};

const Table: React.FC<TableProps> = ({ columns, rows }) => {
    const gridRef = useRef<AgGridReact>(null);

    const defaultColDef = useMemo<ColDef>(() => ({
        sortable: true,
        filter: true,
        resizable: true,
    }), []);

    useEffect(() => {
        const interval = setInterval(() => {
            gridRef.current?.api?.sizeColumnsToFit();
        }, 1000);
        return () => clearInterval(interval);
    }, [gridRef]);

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <div className="ag-theme-alpine" style={{ width: "100%", height: "100%" }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rows}
                    columnDefs={columns.map((column: TableColumn) => ({
                        headerName: column.label,
                        field: column.name,
                        ...columnDef[column.type || TableColumnType.Text],
                    }))}
                    defaultColDef={defaultColDef}
                    rowSelection='multiple'
                />
            </div>
        </div>
    );
};

export default Table;