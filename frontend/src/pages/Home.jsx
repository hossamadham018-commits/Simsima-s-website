import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import './Home.css';

function FeatureIcon({ type }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === 'leaf' && <><path d="M20 3C9 2 3 7 5 14s15 7 15-11Z" /><path d="M3 21 15 9" /></>}
    {type === 'chef' && <><path d="M7 17V10C1 10 2 3 7 5c1-5 9-5 10 0 5-2 6 5 0 5v7M7 17h10v4H7z" /><path d="M10 12v2m4-2v2" /></>}
    {type === 'delivery' && <><path d="M3 6h11v12H3zM14 10h4l3 4v4h-7" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>}
  </svg>;
}

export default function Home() {
  const { t, language } = useLanguage();
  const arabic = language === 'ar';
  const features = [['leaf', 'freshIngredients', 'freshDesc'], ['chef', 'expertChefs', 'expertDesc'], ['delivery', 'fastDelivery', 'fastDesc']];
  return <>
    <Navbar />
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-inner">
          <div className="home-intro">
            <p className="home-eyebrow"><span />{arabic ? 'أهلاً بكم في مطبخ سمسمة' : "Welcome to Simsima’s Kitchen"}</p>
            <h1 id="home-title">{arabic ? 'طعم البيت،' : 'A little taste'}<br /><em>{arabic ? 'في كل لقمة.' : 'of home.'}</em></h1>
            <p className="home-description">{t('subtitle')}</p>
            <Link className="home-order" to="/menu">{t('orderNow')}<span aria-hidden="true">{arabic ? '←' : '→'}</span></Link>
            <div className="home-signature"><span aria-hidden="true" />{arabic ? 'من مطبخنا إلى مائدتكم' : 'From our kitchen to your table'}</div>
          </div>
          <figure className="home-art">
            <div className="home-art-frame"><img src="/home-table.png" width="1254" height="1254" alt={arabic ? 'رسم لمائدة بأرز ذهبي وبيض وسلطة طازجة' : 'Illustration of golden fried rice, a sunny-side egg, and fresh salad on a green table'} fetchPriority="high" /></div>
            <figcaption><span>{arabic ? 'بكل حب' : 'Made with love'}</span><span>{arabic ? 'مطبخ سمسمة' : 'Simsima’s Kitchen'}</span></figcaption>
          </figure>
        </div>
      </section>
      <section className="home-values" aria-labelledby="home-values-title">
        <div className="home-values-heading"><p className="home-eyebrow">{arabic ? 'لمسة منزلية' : 'The homemade difference'}</p><h2 id="home-values-title">{t('whyChoose')}</h2></div>
        <div className="home-feature-grid">{features.map(([icon, title, description], index) => <article className="home-feature" key={title}>
          <div className="home-feature-top"><span className="home-feature-icon"><FeatureIcon type={icon} /></span><span className="home-feature-number" aria-hidden="true">0{index + 1}</span></div>
          <h3>{t(title)}</h3><p>{t(description)}</p>
        </article>)}</div>
      </section>
    </main>
  </>;
}
