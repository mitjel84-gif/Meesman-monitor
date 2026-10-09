import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Activity, ArrowDownRight, ArrowUpRight, ChartNoAxesCombined, ChevronRight,
  CircleHelp, ExternalLink, Filter, Globe2, LayoutDashboard, Menu, Search,
  Settings2, ShieldAlert, SlidersHorizontal, TrendingDown, TrendingUp, Wallet,
  X
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ReferenceLine
} from 'recharts'
import './style.css'

const holdings = [
  { name: 'NVIDIA', ticker: 'NVDA', weight: 4.6 },
  { name: 'Apple', ticker: 'AAPL', weight: 4.0 },
  { name: 'Alphabet', ticker: 'GOOGL / GOOG', weight: 3.3 },
  { name: 'Microsoft', ticker: 'MSFT', weight: 2.8 },
  { name: 'Amazon', ticker: 'AMZN', weight: 2.2 },
  { name: 'Broadcom', ticker: 'AVGO', weight: 1.5 },
  { name: 'Taiwan Semiconductor', ticker: 'TSM', weight: 1.4 },
  { name: 'Meta Platforms', ticker: 'META', weight: 1.4 },
  { name: 'Tesla', ticker: 'TSLA', weight: 1.1 },
  { name: 'JPMorgan Chase', ticker: 'JPM', weight: 0.9 },
]
const periods = ['Dit jaar', '12 maanden', '3 jaar', '5 jaar']
const money = n => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

function App() {
  const [page, setPage] = useState('Overzicht')
  const [period, setPeriod] = useState('12 maanden')
  const [metric, setMetric] = useState('Totaalrendement incl. dividend')
  const [ranking, setRanking] = useState('Beide')
  const [query, setQuery] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const filtered = useMemo(() => holdings.filter(h => `${h.name} ${h.ticker}`.toLowerCase().includes(query.toLowerCase())), [query])
  const nav = [
    { name: 'Overzicht', icon: LayoutDashboard },
    { name: 'Aandelen', icon: ChartNoAxesCombined },
    { name: 'Stijgers & dalers', icon: Activity },
    { name: 'Instellingen', icon: SlidersHorizontal },
  ]
  const go = name => { setPage(name); setMobileMenu(false) }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
      <div className="brand">
        <div className="brand-icon"><Globe2 size={24}/></div>
        <div><strong>Meesman Monitor</strong><span>Wereldwijd Totaal</span></div>
        <button className="mobile-close icon-button" onClick={() => setMobileMenu(false)} aria-label="Menu sluiten"><X size={19}/></button>
      </div>
      <div className="side-label">DASHBOARD</div>
      <nav>{nav.map(({name, icon: Icon}) => <button key={name} onClick={() => go(name)} className={`nav-item ${page === name ? 'active' : ''}`}><Icon size={18}/><span>{name}</span>{page === name && <ChevronRight size={16} className="nav-chevron"/>}</button>)}</nav>
      <div className="sidebar-bottom">
        <div className="side-note"><ShieldAlert size={18}/><p><b>Onafhankelijk dashboard</b><br/>Geen officiële Meesman-app. Gegevens moeten worden gecontroleerd.</p></div>
        <a href="https://www.meesman.nl/onze-fondsen/aandelen-wereldwijd-totaal/" target="_blank" rel="noreferrer">Officiële fondspagina <ExternalLink size={14}/></a>
      </div>
    </aside>
    {mobileMenu && <button className="scrim" aria-label="Menu sluiten" onClick={() => setMobileMenu(false)}/>}
    <main className="main">
      <header className="topbar">
        <button className="icon-button mobile-menu-button" onClick={() => setMobileMenu(true)} aria-label="Menu openen"><Menu size={21}/></button>
        <div className="crumb">Beleggen <span>/</span> <b>{page}</b></div>
        <div className="top-right"><span className="status-dot"/> <span>Meesman Wereldwijd Totaal</span></div>
      </header>
      <div className="content">
        {page === 'Overzicht' && <Overview setPage={go} period={period} setPeriod={setPeriod}/>}
        {page === 'Aandelen' && <Holdings filtered={filtered} query={query} setQuery={setQuery}/>}
        {page === 'Stijgers & dalers' && <Rankings period={period} setPeriod={setPeriod} metric={metric} setMetric={setMetric} ranking={ranking} setRanking={setRanking}/>}
        {page === 'Instellingen' && <Settings period={period} setPeriod={setPeriod} metric={metric} setMetric={setMetric} ranking={ranking} setRanking={setRanking}/>}
        <footer>Meesman Monitor is een onafhankelijk project en geen officiële dienst van Meesman. Controleer gegevens bij de fondsaanbieder. Geen beleggingsadvies.</footer>
      </div>
    </main>
  </div>
}

function PageHeading({eyebrow, title, description, action}) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>
}
function DataNotice({children}) {
  return <div className="notice"><ShieldAlert size={19}/><div><b>Live gegevens nog niet aangesloten</b><p>{children}</p></div></div>
}
function Overview({setPage, period, setPeriod}) {
  const [amount, setAmount] = useState('1000')
  return <>
    <PageHeading eyebrow="JOUW BELEGGINGSOVERZICHT" title="Goedemiddag 👋" description="Bekijk de opbouw van het fonds en onderzoek de prestaties van aandelen." action={<a className="button secondary" href="https://www.meesman.nl/onze-fondsen/aandelen-wereldwijd-totaal/" target="_blank" rel="noreferrer">Officiële gegevens <ExternalLink size={15}/></a>}/>
    <div className="hero-card">
      <div className="hero-orb orb-one"/><div className="hero-orb orb-two"/>
      <div className="hero-top"><div className="fund-mark"><Globe2 size={25}/></div><span className="pill"><span className="status-dot"/> Wereldwijde spreiding</span></div>
      <div className="hero-title">Aandelen Wereldwijd Totaal</div>
      <p>Een wereldwijd gespreide aandelenportefeuille via Meesman Indexbeleggen.</p>
      <div className="hero-bottom"><div><span>Fondstype</span><b>Indexfonds aandelen</b></div><div><span>ISIN</span><b>NL0013689110</b></div><div><span>Fondskosten*</span><b>0,40% per jaar*</b></div></div>
    </div>
    <div className="stats-grid">
      <Stat icon={Globe2} label="Spreiding" value="Wereldwijd" sub="Ontwikkelde & opkomende markten"/>
      <Stat icon={ChartNoAxesCombined} label="Voorbeeldposities" value="10 grootste" sub="Niet de volledige portefeuille"/>
      <Stat icon={Wallet} label="Kostenindicatie" value="0,40%" sub="Controleer actuele fondsdocumenten"/>
    </div>
    <div className="section-heading"><div><h2>Grootste voorbeeldposities</h2><p>Gewicht in het fonds · indicatieve voorbeelddata</p></div><button className="text-button" onClick={() => setPage('Aandelen')}>Alle posities <ChevronRight size={16}/></button></div>
    <div className="panel holdings-panel">
      {holdings.slice(0,5).map((h,i)=><div className="holding-row" key={h.ticker}><div className="rank-number">{String(i+1).padStart(2,'0')}</div><div className="company-monogram">{h.name.slice(0,1)}</div><div className="holding-info"><b>{h.name}</b><span>{h.ticker}</span><div className="weight-track"><div style={{width:`${h.weight/4.6*100}%`}}/></div></div><div className="holding-weight">{h.weight.toLocaleString('nl-NL')}%</div></div>)}
      <div className="small-disclaimer">*Bovenstaande gewichten zijn illustratief en kunnen afwijken van de actuele portefeuille. Laatste officiële peildatum moet nog worden gecontroleerd.</div>
    </div>
    <div className="section-heading"><div><h2>Analyse instellen</h2><p>Kies hoe je de prestaties wilt vergelijken.</p></div></div>
    <div className="panel filter-panel"><div className="field"><label>Periode</label><select value={period} onChange={e=>setPeriod(e.target.value)}>{periods.map(p=><option key={p}>{p}</option>)}</select></div><div className="filter-explain"><CircleHelp size={18}/><span>De app toont geen verzonnen rendementen. De ranglijst wordt pas berekend wanneer historische koersdata is aangesloten.</span></div><button className="button primary" onClick={() => setPage('Stijgers & dalers')}>Open rendementanalyse <ChevronRight size={17}/></button></div>
    <div className="section-heading"><div><h2>Wat betekent dit voor jou?</h2><p>Rekenvoorbeeld, geen voorspelling.</p></div></div>
    <div className="panel calculator"><div><div className="eyebrow">REKENVOORBEELD</div><h3>Wat kost 0,40% op jouw belegging?</h3><p>Pas het bedrag aan om de jaarlijkse kostenindicatie te zien.</p></div><div className="calc-input"><label htmlFor="amount">Belegd bedrag (€)</label><input id="amount" type="number" min="0" value={amount} onChange={e=>setAmount(e.target.value)}/><div className="calc-result"><span>Indicatie per jaar</span><b>{money(Math.max(0, Number(amount)||0)*0.004)}</b></div></div></div>
  </>
}
function Stat({icon:Icon,label,value,sub}) {return <div className="stat-card"><div className="stat-icon"><Icon size={19}/></div><span className="stat-label">{label}</span><b className="stat-value">{value}</b><span className="stat-sub">{sub}</span></div>}
function Holdings({filtered,query,setQuery}) {
  return <>
    <PageHeading eyebrow="FONDSOPBOUW" title="Aandelen in het fonds" description="Zoek in de voorbeeldlijst van grote posities. De actuele volledige portefeuille is nog niet gekoppeld."/>
    <div className="toolbar"><div className="searchbox"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Zoek bedrijf of ticker…"/></div><span className="result-count">{filtered.length} resultaten</span></div>
    <div className="panel table-panel"><div className="table-scroll"><table><thead><tr><th>#</th><th>Bedrijf</th><th>Ticker</th><th className="align-right">Indicatief gewicht</th><th>Portefeuille-aandeel</th></tr></thead><tbody>{filtered.map((h,i)=><tr key={h.ticker}><td className="muted">{String(i+1).padStart(2,'0')}</td><td><b>{h.name}</b></td><td><span className="ticker">{h.ticker}</span></td><td className="align-right"><b>{h.weight.toLocaleString('nl-NL')}%</b></td><td><div className="weight-track wide"><div style={{width:`${h.weight/4.6*100}%`}}/></div></td></tr>)}</tbody></table></div>{filtered.length===0&&<div className="empty">Geen aandelen gevonden. Probeer een andere zoekterm.</div>}<div className="panel-foot"><ShieldAlert size={16}/> Voorbeelddata; geen geverifieerde actuele holdings. Gebruik de officiële factsheet voor de actuele samenstelling.</div></div>
    <DataNotice>De app bevat op dit moment alleen een kleine voorbeeldlijst. Voor een volledig overzicht moet een actuele holdings-export van Meesman worden geïmporteerd en periodiek bijgewerkt.</DataNotice>
  </>
}
function Rankings({period,setPeriod,metric,setMetric,ranking,setRanking}) {
  return <>
    <PageHeading eyebrow="RENDEMENTANALYSE" title="Stijgers & dalers" description="Vergelijk aandelen over een gelijke periode met dezelfde rendementsmethode."/>
    <div className="panel controls-panel"><div className="field"><label>Periode</label><select value={period} onChange={e=>setPeriod(e.target.value)}>{periods.map(p=><option key={p}>{p}</option>)}</select></div><div className="field"><label>Rendementstype</label><select value={metric} onChange={e=>setMetric(e.target.value)}><option>Koersrendement</option><option>Totaalrendement incl. dividend</option></select></div><div className="segmented">{['Beide','Stijgers','Dalers'].map(r=><button key={r} onClick={()=>setRanking(r)} className={ranking===r?'selected':''}>{r}</button>)}</div></div>
    {ranking!=='Dalers'&&<RankingEmpty title="Top 5 best presterende aandelen" positive/>}
    {ranking!=='Stijgers'&&<RankingEmpty title="Top 5 slechtst presterende aandelen"/>}
    <DataNotice>Er is nog geen betrouwbare historische databron aangesloten. De app berekent bewust geen top 5 met gefingeerde percentages. Zodra gevalideerde holdings en historische koersen zijn gekoppeld, kan deze pagina de ranglijsten en grafieken tonen.</DataNotice>
    <div className="panel methodology"><h3>Zo wordt de ranglijst berekend</h3><div className="method-row"><span>1</span><div><b>Peildatum vaststellen</b><p>Welke aandelen zaten in het fonds aan het begin en einde van de periode?</p></div></div><div className="method-row"><span>2</span><div><b>Koersen corrigeren</b><p>Rekening houden met aandelensplitsingen en ontbrekende handelsdagen.</p></div></div><div className="method-row"><span>3</span><div><b>Dividend meenemen</b><p>Bij totaalrendement tellen herbelegde dividenden mee.</p></div></div></div>
  </>
}
function RankingEmpty({title,positive}) {
  return <section className="ranking-section"><div className={`ranking-title ${positive?'positive':''}`}><div className="ranking-icon">{positive?<TrendingUp size={19}/>:<TrendingDown size={19}/>}</div><div><h2>{title}</h2><p>Geen geverifieerde resultaten beschikbaar</p></div></div><div className="panel chart-placeholder"><div className="placeholder-icon"><Activity size={25}/></div><b>Wacht op koersgegevens</b><p>De grafiek verschijnt hier zodra historische marktdata beschikbaar is.</p></div></section>
}
function Settings({period,setPeriod,metric,setMetric,ranking,setRanking}) {
  return <>
    <PageHeading eyebrow="VOORKEUREN" title="Instellingen" description="Pas de standaardfilters van de rendementanalyse aan."/>
    <div className="panel settings-panel"><h2><Filter size={19}/> Rendementfilters</h2><div className="field"><label>Standaardperiode</label><select value={period} onChange={e=>setPeriod(e.target.value)}>{periods.map(p=><option key={p}>{p}</option>)}</select></div><div className="field"><label>Rendementstype</label><select value={metric} onChange={e=>setMetric(e.target.value)}><option>Koersrendement</option><option>Totaalrendement incl. dividend</option></select></div><div className="field"><label>Standaardweergave</label><select value={ranking} onChange={e=>setRanking(e.target.value)}>{['Beide','Stijgers','Dalers'].map(p=><option key={p}>{p}</option>)}</select></div><div className="settings-hint"><Settings2 size={18}/><span>Deze voorkeuren gelden zolang de app open is. Opslaan tussen bezoeken kan later worden toegevoegd.</span></div></div>
    <div className="panel settings-panel"><h2><Globe2 size={19}/> Officiële bron</h2><p>Controleer fondsdocumenten en de actuele samenstelling altijd bij Meesman.</p><a className="button secondary" href="https://www.meesman.nl/onze-fondsen/aandelen-wereldwijd-totaal/" target="_blank" rel="noreferrer">Open Meesman <ExternalLink size={15}/></a></div>
    <DataNotice>Deze app is onafhankelijk en heeft geen verbinding met je Meesman-account. Deel nooit inloggegevens of API-sleutels in deze repository.</DataNotice>
  </>
}

createRoot(document.getElementById('root')).render(<App/>)
