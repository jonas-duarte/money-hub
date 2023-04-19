import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { OutgoingsRepository } from "@/repositories/OutgoingsRepository";

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

function getDateLabel(date: string) {
    const dateObj = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[dateObj.getMonth()]}/${dateObj.getFullYear()}`;
}

const Outgoings = () => {
    const [options, setOptions] = useState<any>(null);

    useEffect(() => {
        const loadOptions = async () => {
            const outgoings = await OutgoingsRepository.getInstance().getAll();

            outgoings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            const dates: string[] = [
                // @ts-ignore
                ...new Set([
                    ...outgoings.map(outgoing => getDateLabel(outgoing.date))
                ])
            ];

            const labels = [
                // @ts-ignore
                ...new Set([
                    ...outgoings.map(outgoing => outgoing.category)
                ])
            ];

            const series = labels
                .map(label => {
                    const outgoingsByCategory = outgoings.filter(outgoing => outgoing.category === label);
                    let total = 0;
                    const data = dates.map(date => {
                        const outgoingsByDate = outgoingsByCategory.filter(outgoing => getDateLabel(outgoing.date) === date);
                        total += outgoingsByDate.reduce((acc, outgoing) => acc + outgoing.amount, 0)
                        return total.toFixed(2);
                    });
                    return { name: label, data };
                })
                .sort((a, b) => Number(b.data[b.data.length - 1]) - Number(a.data[a.data.length - 1]));

            // let total = 0;
            // const totalSeries = {
            //     name: 'Total',
            //     data: dates.map(date => {
            //         const outgoingsByDate = outgoings.filter(outgoing => getDateLabel(outgoing.date) === date);
            //         total += outgoingsByDate.reduce((acc, outgoing) => acc + outgoing.amount, 0)
            //         return total.toFixed(2);
            //     }),
            // }

            setOptions({
                series,
                options: {
                    chart: {
                        height: 450,
                        type: 'line',
                        zoom: {
                            enabled: false
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'straight',
                        width: 2
                    },
                    xaxis: {
                        categories: dates,
                    },
                    yaxis: {
                        title: {
                            text: undefined
                        },
                    },
                    fill: {
                        opacity: 1
                    },
                    title: {
                        text: 'Total outgoings by category',
                        align: 'left'
                    },
                    grid: {
                        row: {
                            colors: ['#f3f3f322', 'transparent'], // takes an array which will be repeated on columns
                            opacity: 0.5
                        },
                    }
                },
            });
        }

        loadOptions();
    }, []);


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', color: 'black' }}>
            {options && <Chart options={options.options} series={options.series} type="line" width="1000" />}
        </div>

    );
}

export default Outgoings;