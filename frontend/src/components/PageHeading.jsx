import './ShopTheme.css';
import { useLanguage } from '../context/LanguageContext';

export default function PageHeading({ title, subtitle, children }) {
  const { language } = useLanguage();
  return <header className="shop-heading">
    <p className="shop-eyebrow">{language === 'ar' ? 'مطبخ سمسمة' : 'Simsima’s Kitchen'}</p>
    <h1>{title}</h1>
    {subtitle && <p className="shop-subtitle">{subtitle}</p>}
    {children}
  </header>;
}
