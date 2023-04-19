import Link from 'next/link';
import styles from './Navbar.module.css';

const links = [
    { href: '/', label: 'Home' },
    { href: '/incomings', label: 'Incomings' },
    { href: '/outgoings', label: 'Outgoings' },
    { href: '/assets', label: 'Assets' },
    { href: '/reports', label: 'Reports' },
];

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <Link className={styles.navbar__logo} href="/">
                MoneyHub
            </Link>
            <div className={styles.navbar__links}>
                {links.map(({ href, label }) => <Link key={href} href={href}>{label}</Link>)}
            </div>
        </nav>
    );
}

export default Navbar;