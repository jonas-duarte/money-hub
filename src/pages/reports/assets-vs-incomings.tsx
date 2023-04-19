import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { IncomingsRepository } from "@/repositories/IncomingsRepository";
import { AssetsRepository } from "@/repositories/AssetsRepository";

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AssetsVsIncomingsReport = () => {
    const [options, setOptions] = useState<any>(null);

    useEffect(() => {
        const loadOptions = async () => {
            const assets = await AssetsRepository.getInstance().getAll();
            const incomings = await IncomingsRepository.getInstance().getAll();

            const labels: string[] = [
                // @ts-ignore
                ...new Set([
                    ...assets.map(asset => asset.id),
                    ...incomings.map(incoming => incoming.assetId)
                ])
            ];

            const assetsData = labels.map(label => {
                const asset = assets.find(asset => asset.id === label);
                return asset ? asset.totalValue.toFixed(2) : 0;
            });

            const incomingsData = labels.map(label => {
                const incomingsByAsset = incomings.filter(incoming => incoming.assetId === label)
                return incomingsByAsset.reduce((acc, incoming) => acc + incoming.amount, 0).toFixed(2);
            });

            for (let i = 0; i < labels.length; i++) {
                if (Number(assetsData[i]) === 0) {
                    labels.splice(i, 1);
                    assetsData.splice(i, 1);
                    incomingsData.splice(i, 1);
                    i--;
                }
            }

            setOptions({
                series: [{
                    name: 'Incomings',
                    data: incomingsData
                }, {
                    name: 'Assets',
                    data: assetsData
                }],
                options: {
                    chart: {
                        type: 'bar',
                        height: 430
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        show: true,
                        width: 1,
                        colors: ['#fff']
                    },
                    xaxis: {
                        categories: labels,
                    },
                    yaxis: {
                        title: {
                            text: undefined
                        },
                    },
                    fill: {
                        opacity: 1
                    },
                },
            });
        }

        loadOptions();
    }, []);


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', color: 'black' }}>
            {options && <Chart options={options.options} series={options.series} type="bar" width="1000" />}

        </div>

    );
}

export default AssetsVsIncomingsReport;