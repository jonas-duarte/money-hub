import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { IncomingsRepository } from "@/repositories/IncomingsRepository";

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AssetsVsIncomingsReport = () => {
    const [options, setOptions] = useState<any>(null);

    useEffect(() => {
        const loadOptions = async () => {
            const incomings = await IncomingsRepository.getInstance().getAll();

            const incomingCategories = [
                // @ts-ignore
                ...new Set(incomings.map(incoming => incoming.category))
            ]

            const years = [
                // @ts-ignore
                ...new Set(incomings.map(incoming => new Date(incoming.date).getFullYear()))
            ].sort((a, b) => b - a);


            const series = incomingCategories.map(category => {
                return {
                    name: category,
                    data: years.map(year => {
                        const incomingsByYearAndCategory = incomings.filter(incoming => {
                            return incoming.category === category && new Date(incoming.date).getFullYear() === year;
                        })

                        return parseInt(incomingsByYearAndCategory.reduce((acc, incoming) => acc + incoming.amount, 0) + "");
                    })
                }
            })

            console.log(series);

            setOptions({
                series,
                options: {
                    chart: {
                        type: 'bar',
                        height: 350,
                        stacked: true,
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            dataLabels: {
                                total: {
                                    enabled: true,
                                    offsetX: 0,
                                    style: {
                                        fontSize: '13px',
                                        fontWeight: 900
                                    }
                                }
                            }
                        },
                    },
                    stroke: {
                        width: 1,
                        colors: ['#fff']
                    },
                    title: {
                        text: 'Anual Incomings'
                    },
                    xaxis: {
                        categories: years,
                    },
                    yaxis: {
                        title: {
                            text: undefined
                        },
                    },
                    fill: {
                        opacity: 1
                    },
                    legend: {
                        position: 'top',
                        horizontalAlign: 'left',
                        offsetX: 40
                    }
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