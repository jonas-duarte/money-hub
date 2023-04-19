import Link from "next/link";

const links = [
    { href: '/reports/outgoings-by-category', label: 'Outgoings by category' },
    { href: '/reports/assets-vs-incomings', label: 'Assets vs Incomings' },
    { href: '/reports/anual-incomings', label: 'Anual Incomings' },
]

const ReportsPage = () => {
    // outgoings-by-category
    // assets-vs-incomings
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', color: 'black' }}>
            <h1>Reports</h1>
            {links.map(({ href, label }) => (
                <Link key={href} href={href} >
                    {label}
                </Link>
            ))}
        </div >
    );
}

export default ReportsPage;