import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
// New palette: Deep navy + electric teal + vibrant emerald accents
// Arabic-first luxury fintech aesthetic

const OPPORTUNITIES = [
  { id: 1, title: "مجمع تجاري متكامل", titleEn: "Integrated Commercial Complex", sector: "عقارات", sectorEn: "Real Estate", city: "الرياض", cityEn: "Riyadh", region: "منطقة الرياض", regionEn: "Riyadh Region", cost: 15000000, roi: 22, risk: "متوسط", riskEn: "Medium", score: 87, trend: "+4.2%", lat: 24.7136, lng: 46.6753, description: "مجمع تجاري متطور يضم محلات تجارية ومكاتب ومطاعم في قلب الرياض. يستهدف المشروع الفئة المتوسطة والعليا ويتميز بموقع استراتيجي فريد.", descriptionEn: "A sophisticated commercial complex featuring retail outlets, offices, and restaurants in the heart of Riyadh, targeting middle and upper segments.", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80", tag: "مميز", views: 1240, fundedPct: 68 },
  { id: 2, title: "منتجع سياحي ساحلي", titleEn: "Coastal Tourist Resort", sector: "سياحة", sectorEn: "Tourism", city: "جدة", cityEn: "Jeddah", region: "منطقة مكة", regionEn: "Makkah Region", cost: 45000000, roi: 18, risk: "منخفض", riskEn: "Low", score: 91, trend: "+7.8%", lat: 21.5433, lng: 39.1728, description: "منتجع سياحي فاخر على ساحل البحر الأحمر مع وحدات فندقية وشاليهات وخدمات ترفيهية متكاملة تستقطب السياح المحليين والدوليين.", descriptionEn: "A luxury resort on the Red Sea coast with hotel units, chalets, and integrated entertainment services attracting local and international tourists.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", tag: "الأعلى تقييماً", views: 3820, fundedPct: 85 },
  { id: 3, title: "مزرعة تقنية زراعية", titleEn: "AgriTech Smart Farm", sector: "زراعة", sectorEn: "Agriculture", city: "القصيم", cityEn: "Qassim", region: "منطقة القصيم", regionEn: "Qassim Region", cost: 8000000, roi: 31, risk: "مرتفع", riskEn: "High", score: 74, trend: "+12.1%", lat: 26.3260, lng: 43.9750, description: "مزرعة ذكية تستخدم تقنيات الزراعة المائية والطاقة الشمسية لإنتاج محاصيل عضوية عالية الجودة بكفاءة مائية تفوق 90٪.", descriptionEn: "A smart farm using hydroponic technology and solar energy to produce high-quality organic crops with over 90% water efficiency.", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80", tag: "عائد مرتفع", views: 890, fundedPct: 42 },
  { id: 4, title: "مركز لوجستي متكامل", titleEn: "Integrated Logistics Center", sector: "لوجستيات", sectorEn: "Logistics", city: "الدمام", cityEn: "Dammam", region: "المنطقة الشرقية", regionEn: "Eastern Province", cost: 28000000, roi: 25, risk: "منخفض", riskEn: "Low", score: 89, trend: "+5.5%", lat: 26.4207, lng: 50.0888, description: "مركز لوجستي استراتيجي قرب الميناء يخدم قطاعات التجارة والصناعة والتوزيع في المنطقة الشرقية بإمكانيات تخزين هائلة.", descriptionEn: "A strategic logistics center near the port serving trade, industry, and distribution with massive storage capabilities.", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80", tag: "", views: 2100, fundedPct: 71 },
  { id: 5, title: "محطة طاقة شمسية", titleEn: "Solar Energy Station", sector: "طاقة", sectorEn: "Energy", city: "تبوك", cityEn: "Tabuk", region: "منطقة تبوك", regionEn: "Tabuk Region", cost: 55000000, roi: 19, risk: "منخفض", riskEn: "Low", score: 93, trend: "+9.3%", lat: 28.3838, lng: 36.5550, description: "محطة طاقة شمسية ضخمة بقدرة 200 ميجاوات تساهم في تحقيق أهداف رؤية 2030 للطاقة المتجددة وتخفيض الانبعاثات الكربونية.", descriptionEn: "A 200MW solar power plant contributing to Vision 2030 renewable energy targets and reducing carbon emissions.", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80", tag: "رؤية 2030", views: 4500, fundedPct: 92 },
  { id: 6, title: "حي ترفيهي متكامل", titleEn: "Entertainment District", sector: "ترفيه", sectorEn: "Entertainment", city: "مكة المكرمة", cityEn: "Makkah", region: "منطقة مكة", regionEn: "Makkah Region", cost: 120000000, roi: 27, risk: "متوسط", riskEn: "Medium", score: 85, trend: "+3.9%", lat: 21.3891, lng: 39.8579, description: "حي ترفيهي شامل يضم مراكز تسوق وترفيه وفنادق ومطاعم عالمية لخدمة ملايين الزوار سنوياً.", descriptionEn: "A comprehensive entertainment district with shopping, entertainment, hotels, and international restaurants serving millions yearly.", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80", tag: "", views: 5670, fundedPct: 55 },
  { id: 7, title: "مستشفى تخصصي ذكي", titleEn: "Smart Specialty Hospital", sector: "صحة", sectorEn: "Healthcare", city: "الرياض", cityEn: "Riyadh", region: "منطقة الرياض", regionEn: "Riyadh Region", cost: 75000000, roi: 21, risk: "منخفض", riskEn: "Low", score: 90, trend: "+6.1%", lat: 24.6877, lng: 46.7219, description: "مستشفى تخصصي من الجيل الجديد يدمج الذكاء الاصطناعي في التشخيص والعلاج لتقديم رعاية صحية استثنائية.", descriptionEn: "Next-generation specialty hospital integrating AI in diagnosis and treatment to deliver exceptional healthcare.", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80", tag: "جديد", views: 1980, fundedPct: 38 },
  { id: 8, title: "حديقة تقنية ناشئة", titleEn: "Tech Startup Park", sector: "تقنية", sectorEn: "Technology", city: "نيوم", cityEn: "NEOM", region: "منطقة تبوك", regionEn: "Tabuk Region", cost: 200000000, roi: 35, risk: "مرتفع", riskEn: "High", score: 78, trend: "+18.7%", lat: 28.0, lng: 35.5, description: "مجمع تقني متكامل في مدينة نيوم يستقطب الشركات الناشئة والمبدعين التقنيين من حول العالم لبناء مستقبل المملكة.", descriptionEn: "An integrated tech complex in NEOM attracting startups and tech innovators from around the world.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", tag: "نيوم", views: 8900, fundedPct: 28 },
];

const CONSULTANTS = [
  { id: 1, name: "د. محمد الغامدي", nameEn: "Dr. Mohammed Al-Ghamdi", specialty: "عقارات واستثمار", specialtyEn: "Real Estate & Investment", studies: 24, rating: 4.9, city: "الرياض", cityEn: "Riyadh", avatar: "MG", verified: true, clients: 142, responseTime: "< ٢ ساعة", responseTimeEn: "< 2 hours" },
  { id: 2, name: "أ. سارة الزهراني", nameEn: "Sara Al-Zahrani", specialty: "السياحة والضيافة", specialtyEn: "Tourism & Hospitality", studies: 18, rating: 4.8, city: "جدة", cityEn: "Jeddah", avatar: "SZ", verified: true, clients: 98, responseTime: "< ٣ ساعات", responseTimeEn: "< 3 hours" },
  { id: 3, name: "م. خالد العتيبي", nameEn: "Eng. Khalid Al-Otaibi", specialty: "الطاقة المتجددة", specialtyEn: "Renewable Energy", studies: 31, rating: 4.7, city: "الدمام", cityEn: "Dammam", avatar: "KA", verified: true, clients: 210, responseTime: "< ١ ساعة", responseTimeEn: "< 1 hour" },
  { id: 4, name: "د. ريم الحربي", nameEn: "Dr. Reem Al-Harbi", specialty: "التقنية والابتكار", specialtyEn: "Technology & Innovation", studies: 15, rating: 4.9, city: "الرياض", cityEn: "Riyadh", avatar: "RH", verified: false, clients: 67, responseTime: "< ٤ ساعات", responseTimeEn: "< 4 hours" },
];

const SECTORS_DATA = [
  { ar: "عقارات", en: "Real Estate", icon: "🏢", color: "#06b6d4" },
  { ar: "سياحة", en: "Tourism", icon: "🏖️", color: "#10b981" },
  { ar: "زراعة", en: "Agriculture", icon: "🌿", color: "#84cc16" },
  { ar: "لوجستيات", en: "Logistics", icon: "🚢", color: "#f59e0b" },
  { ar: "طاقة", en: "Energy", icon: "⚡", color: "#eab308" },
  { ar: "ترفيه", en: "Entertainment", icon: "🎭", color: "#ec4899" },
  { ar: "تقنية", en: "Technology", icon: "💡", color: "#8b5cf6" },
  { ar: "صحة", en: "Healthcare", icon: "🏥", color: "#14b8a6" },
];

const MARKET_DATA = [
  { month: "يناير", monthEn: "Jan", value: 4200 },
  { month: "فبراير", monthEn: "Feb", value: 4800 },
  { month: "مارس", monthEn: "Mar", value: 4500 },
  { month: "أبريل", monthEn: "Apr", value: 5200 },
  { month: "مايو", monthEn: "May", value: 5800 },
  { month: "يونيو", monthEn: "Jun", value: 6100 },
  { month: "يوليو", monthEn: "Jul", value: 5900 },
  { month: "أغسطس", monthEn: "Aug", value: 6700 },
];

// ─── ICON SET ───────────────────────────────────────────────────────────────
const I = ({ n, s = 18, c = "" }) => {
  const paths = {
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    map: <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
    brief: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    trend: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    msg: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
    upload: <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>,
    pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    menu: <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    right: <polyline points="9 18 15 12 9 6"/>,
    left: <polyline points="15 18 9 12 15 6"/>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    list: <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    ai: <><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></>,
    chart: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    compare: <><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></>,
    alert: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    calc: <><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/></>,
    news: <><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></>,
    award: <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}>
      {paths[n]}
    </svg>
  );
};

// ─── MINI SPARKLINE ─────────────────────────────────────────────────────────
const Sparkline = ({ data, color = "#06b6d4", w = 80, h = 32 }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts.split(" ").pop().split(",")[0]} cy={pts.split(" ").pop().split(",")[1]} r="3" fill={color}/>
    </svg>
  );
};

// ─── SCORE RING ─────────────────────────────────────────────────────────────
const Ring = ({ v, size = 54 }) => {
  const r = (size - 10) / 2, c = 2 * Math.PI * r;
  const col = v >= 85 ? "#10b981" : v >= 70 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth="5"
          strokeDasharray={`${(v/100)*c} ${c}`} strokeLinecap="round"/>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: col }}>{v}</div>
    </div>
  );
};

// ─── FUND PROGRESS ──────────────────────────────────────────────────────────
const FundBar = ({ pct, lang }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{lang === "ar" ? "نسبة التمويل" : "Funded"}</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: "#06b6d4" }}>{pct}%</span>
    </div>
    <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: pct > 80 ? "linear-gradient(90deg,#10b981,#06d6a0)" : "linear-gradient(90deg,#06b6d4,#38bdf8)", transition: "width 0.8s ease" }}/>
    </div>
  </div>
);

// ─── CALCULATOR ─────────────────────────────────────────────────────────────
const Calculator = ({ lang }) => {
  const isAr = lang === "ar";
  const [amount, setAmount] = useState(1000000);
  const [years, setYears] = useState(5);
  const [roi, setRoi] = useState(20);
  const total = amount * Math.pow(1 + roi / 100, years);
  const profit = total - amount;

  return (
    <div style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 20, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(6,182,212,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <I n="calc" s={16} c="text-cyan-400"/>
        </div>
        <h3 style={{ fontWeight: 800, fontSize: 16 }}>{isAr ? "حاسبة العائد الاستثماري" : "ROI Calculator"}</h3>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        {[
          { label: isAr ? "مبلغ الاستثمار (ريال)" : "Investment (SAR)", value: amount, set: setAmount, min: 100000, max: 100000000, step: 100000 },
          { label: isAr ? "سنوات الاستثمار" : "Investment Years", value: years, set: setYears, min: 1, max: 20, step: 1 },
          { label: isAr ? "العائد السنوي ٪" : "Annual ROI %", value: roi, set: setRoi, min: 1, max: 50, step: 1, span: 2 },
        ].map((f, i) => (
          <div key={i} style={f.span ? { gridColumn: `span ${f.span}` } : {}}>
            <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>{f.label}</label>
            <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={e => f.set(+e.target.value)}
              style={{ width: "100%", accentColor: "#06b6d4", cursor: "pointer" }}/>
            <div style={{ textAlign: "center", fontSize: 14, fontWeight: 700, color: "#06b6d4", marginTop: 4 }}>
              {f.label.includes("ريال") || f.label.includes("SAR") ? `${(f.value/1000000).toFixed(1)}M` : f.value}{f.label.includes("٪") || f.label.includes("%") ? "%" : ""}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ padding: "14px", borderRadius: 12, background: "rgba(6,182,212,0.08)", textAlign: "center" }}>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{isAr ? "إجمالي الثروة" : "Total Value"}</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#06b6d4" }}>{(total/1000000).toFixed(2)}M</p>
        </div>
        <div style={{ padding: "14px", borderRadius: 12, background: "rgba(16,185,129,0.08)", textAlign: "center" }}>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{isAr ? "صافي الربح" : "Net Profit"}</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#10b981" }}>+{(profit/1000000).toFixed(2)}M</p>
        </div>
      </div>
    </div>
  );
};

// ─── MARKET CHART ───────────────────────────────────────────────────────────
const MarketChart = ({ lang }) => {
  const isAr = lang === "ar";
  const max = Math.max(...MARKET_DATA.map(d => d.value));
  const min = Math.min(...MARKET_DATA.map(d => d.value));
  const w = 520, h = 120;
  const pts = MARKET_DATA.map((d, i) => {
    const x = 20 + (i / (MARKET_DATA.length - 1)) * (w - 40);
    const y = h - 20 - ((d.value - min) / (max - min)) * (h - 40);
    return { x, y, ...d };
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = path + ` L${pts[pts.length-1].x},${h-20} L${pts[0].x},${h-20} Z`;

  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 15 }}>{isAr ? "مؤشر السوق الاستثماري" : "Investment Market Index"}</h3>
          <p style={{ color: "#10b981", fontSize: 12, fontWeight: 600, marginTop: 2 }}>▲ +14.3% {isAr ? "هذا العام" : "YTD"}</p>
        </div>
        <span style={{ fontSize: 10, padding: "4px 10px", borderRadius: 99, background: "rgba(16,185,129,0.15)", color: "#10b981", fontWeight: 700 }}>{isAr ? "مباشر" : "LIVE"}</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[0,0.25,0.5,0.75,1].map((t, i) => (
          <line key={i} x1="20" y1={20 + t*(h-40)} x2={w-20} y2={20 + t*(h-40)} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        ))}
        <path d={area} fill="url(#grad)"/>
        <path d={path} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#06b6d4" stroke="#0a1628" strokeWidth="2"/>
        ))}
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={h} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">
            {isAr ? p.month : p.monthEn}
          </text>
        ))}
      </svg>
    </div>
  );
};

// ─── COMPARE PANEL ──────────────────────────────────────────────────────────
const ComparePanel = ({ opps, lang, onClose }) => {
  const isAr = lang === "ar";
  const metrics = [
    { label: isAr ? "تكلفة الاستثمار" : "Investment Cost", key: "cost", fmt: v => `${(v/1e6).toFixed(0)}M SAR` },
    { label: isAr ? "العائد المتوقع" : "Expected ROI", key: "roi", fmt: v => `${v}%`, good: "high" },
    { label: isAr ? "نقاط الذكاء" : "Smart Score", key: "score", fmt: v => `${v}/100`, good: "high" },
    { label: isAr ? "مستوى المخاطرة", label: isAr ? "مستوى المخاطرة" : "Risk Level", key: isAr ? "risk" : "riskEn", fmt: v => v },
    { label: isAr ? "نسبة التمويل" : "Funding %", key: "fundedPct", fmt: v => `${v}%`, good: "high" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,12,0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ width: "100%", maxWidth: 680, background: "#0a1628", border: "1px solid rgba(6,182,212,0.25)", borderRadius: 24, overflow: "hidden" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontWeight: 800, fontSize: 18 }}>{isAr ? "مقارنة الفرص الاستثمارية" : "Compare Opportunities"}</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I n="x" s={14} c="text-gray-400"/>
          </button>
        </div>
        <div style={{ padding: 24, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: isAr ? "right" : "left", padding: "8px 12px", color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 500, width: "35%" }}>{isAr ? "المعيار" : "Metric"}</th>
                {opps.map(o => (
                  <th key={o.id} style={{ textAlign: "center", padding: "8px 12px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#06b6d4" }}>{isAr ? o.title : o.titleEn}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{isAr ? o.city : o.cityEn}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{m.label}</td>
                  {opps.map(o => {
                    const v = o[m.key] || o[isAr ? "risk" : "riskEn"];
                    const isHighest = m.good === "high" && opps.every(oo => (oo[m.key]||0) <= (o[m.key]||0));
                    return (
                      <td key={o.id} style={{ textAlign: "center", padding: "10px 12px", fontSize: 13, fontWeight: 600, color: isHighest ? "#10b981" : "#fff" }}>
                        {m.fmt(v)}{isHighest && " ✓"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── NEWS TICKER ─────────────────────────────────────────────────────────────
const NewsTicker = ({ lang }) => {
  const isAr = lang === "ar";
  const items = isAr
    ? ["▲ مؤشر الاستثمار السعودي يرتفع 2.3٪", "• إطلاق صندوق استثمار جديد بقيمة 5 مليار ريال في قطاع التقنية", "▲ ارتفاع الطلب على العقارات الفندقية بنسبة 18٪", "• نيوم تعلن عن 12 مشروع استثماري جديد لعام 2025", "▲ رؤية 2030: تحقيق 65٪ من مستهدفات الاستثمار الأجنبي"]
    : ["▲ Saudi Investment Index rises 2.3%", "• New SAR 5B tech fund launched", "▲ Hotel real estate demand up 18%", "• NEOM announces 12 new projects for 2025", "▲ Vision 2030: 65% of FDI targets achieved"];
  const [pos, setPos] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPos(p => (p + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, [items.length]);
  return (
    <div style={{ background: "rgba(6,182,212,0.08)", borderBottom: "1px solid rgba(6,182,212,0.15)", padding: "8px 20px", display: "flex", alignItems: "center", gap: 12, overflow: "hidden" }}>
      <span style={{ fontSize: 10, fontWeight: 800, color: "#06b6d4", background: "rgba(6,182,212,0.2)", padding: "2px 8px", borderRadius: 99, flexShrink: 0, letterSpacing: "0.06em" }}>{isAr ? "أخبار" : "LIVE"}</span>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap", transition: "all 0.4s ease" }}>{items[pos]}</p>
      </div>
    </div>
  );
};

// ─── OPP CARD ────────────────────────────────────────────────────────────────
const OppCard = ({ o, lang, onView, saved, onSave, onCompareAdd, inCompare }) => {
  const isAr = lang === "ar";
  const riskStyle = {
    "منخفض": { bg: "rgba(16,185,129,0.12)", c: "#10b981" },
    "متوسط": { bg: "rgba(245,158,11,0.12)", c: "#f59e0b" },
    "مرتفع": { bg: "rgba(239,68,68,0.12)", c: "#ef4444" },
    "Low": { bg: "rgba(16,185,129,0.12)", c: "#10b981" },
    "Medium": { bg: "rgba(245,158,11,0.12)", c: "#f59e0b" },
    "High": { bg: "rgba(239,68,68,0.12)", c: "#ef4444" },
  };
  const rs = riskStyle[isAr ? o.risk : o.riskEn] || riskStyle["متوسط"];
  const sectorInfo = SECTORS_DATA.find(s => s.ar === o.sector);

  return (
    <div style={{ borderRadius: 20, overflow: "hidden", background: "rgba(255,255,255,0.03)", border: `1px solid ${inCompare ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.07)"}`, transition: "all 0.3s", cursor: "pointer" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(6,182,212,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
        <img src={o.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65)" }}/>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.2) 60%, transparent 100%)" }}/>
        {o.tag && <span style={{ position: "absolute", top: 10, left: isAr ? "auto" : 10, right: isAr ? 10 : "auto", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 99, background: "rgba(6,182,212,0.9)", color: "#fff", letterSpacing: "0.04em" }}>{o.tag}</span>}
        <div style={{ position: "absolute", top: 10, right: isAr ? "auto" : 10, left: isAr ? 10 : "auto", display: "flex", gap: 6 }}>
          <button onClick={e => { e.stopPropagation(); onSave(o.id); }} style={{ width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: saved ? "rgba(239,68,68,0.8)" : "rgba(0,0,0,0.5)", border: "none", cursor: "pointer" }}>
            <I n="heart" s={13} c={saved ? "text-white" : "text-gray-300"}/>
          </button>
          <button onClick={e => { e.stopPropagation(); onCompareAdd(o); }} style={{ width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: inCompare ? "rgba(6,182,212,0.8)" : "rgba(0,0,0,0.5)", border: "none", cursor: "pointer" }} title={isAr ? "إضافة للمقارنة" : "Add to compare"}>
            <I n="compare" s={12} c={inCompare ? "text-white" : "text-gray-300"}/>
          </button>
        </div>
        <div style={{ position: "absolute", bottom: 10, left: isAr ? "auto" : 12, right: isAr ? 12 : "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <I n="eye" s={12} c="text-gray-400"/>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{o.views.toLocaleString()}</span>
        </div>
        <div style={{ position: "absolute", bottom: 10, right: isAr ? "auto" : 10, left: isAr ? 10 : "auto" }}>
          <Ring v={o.score} size={50}/>
        </div>
        <div style={{ position: "absolute", bottom: 10, left: isAr ? "auto" : 12, right: isAr ? 12 : "auto" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{isAr ? o.title : o.titleEn}</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 3 }}>
            <I n="pin" s={10}/>{isAr ? o.city : o.cityEn}
          </p>
        </div>
      </div>
      <div style={{ padding: "14px 14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: `${sectorInfo?.color || "#06b6d4"}18`, color: sectorInfo?.color || "#06b6d4", fontWeight: 600 }}>
            {sectorInfo?.icon} {isAr ? o.sector : o.sectorEn}
          </span>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: rs.bg, color: rs.c, fontWeight: 600 }}>{isAr ? o.risk : o.riskEn}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          <div style={{ padding: "8px", borderRadius: 10, background: "rgba(255,255,255,0.03)", textAlign: "center" }}>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>{isAr ? "التكلفة" : "Cost"}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{(o.cost/1e6).toFixed(0)}<span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>M</span></p>
          </div>
          <div style={{ padding: "8px", borderRadius: 10, background: "rgba(255,255,255,0.03)", textAlign: "center" }}>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>{isAr ? "العائد" : "ROI"}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>{o.roi}%</p>
          </div>
        </div>
        <FundBar pct={o.fundedPct} lang={lang}/>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={() => onView(o)} style={{ flex: 1, padding: "9px", borderRadius: 10, fontSize: 12, fontWeight: 700, background: "linear-gradient(135deg,#0891b2,#06b6d4)", color: "#fff", border: "none", cursor: "pointer" }}>
            {isAr ? "عرض التفاصيل" : "View Details"}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#10b981", fontWeight: 600, flexShrink: 0 }}>
            {o.trend}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DETAIL MODAL ────────────────────────────────────────────────────────────
const DetailModal = ({ o, lang, onClose, saved, onSave }) => {
  const isAr = lang === "ar";
  const [tab, setTab] = useState("overview");
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  const genAI = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [{
            role: "user",
            content: `You are a senior investment analyst. Write a professional feasibility summary in ${isAr ? "Arabic" : "English"} for:
- Project: ${isAr ? o.title : o.titleEn}
- Sector: ${isAr ? o.sector : o.sectorEn}
- Location: ${isAr ? o.city : o.cityEn}, Saudi Arabia
- Investment: SAR ${o.cost.toLocaleString()}
- Expected ROI: ${o.roi}%
- Risk: ${isAr ? o.risk : o.riskEn}
- Smart Score: ${o.score}/100
- Current Funding: ${o.fundedPct}%

Provide: 1) Key strengths (2 points) 2) Risk factors (1 point) 3) Recommendation sentence. Be concise and professional.`
          }]
        })
      });
      const d = await res.json();
      setAiSummary(d.content?.[0]?.text || "Error generating summary.");
    } catch { setAiSummary(isAr ? "خطأ في الاتصال." : "Connection error."); }
    setAiLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,12,0.85)", backdropFilter: "blur(12px)" }} onClick={onClose}>
      <div style={{ width: "100%", maxWidth: 660, maxHeight: "92vh", overflowY: "auto", borderRadius: 24, background: "#0a1628", border: "1px solid rgba(6,182,212,0.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ position: "relative", height: 220, overflow: "hidden", borderRadius: "24px 24px 0 0" }}>
          <img src={o.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55)" }}/>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0a1628 0%, transparent 55%)" }}/>
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: 10, background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><I n="x" s={15} c="text-white"/></button>
          <button onClick={() => onSave(o.id)} style={{ position: "absolute", top: 14, left: 14, width: 34, height: 34, borderRadius: 10, background: saved ? "rgba(239,68,68,0.8)" : "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><I n="heart" s={15} c="text-white"/></button>
          <div style={{ position: "absolute", bottom: 14, left: isAr ? "auto" : 20, right: isAr ? 20 : "auto" }}>
            <h2 style={{ fontWeight: 800, fontSize: 20, color: "#fff" }}>{isAr ? o.title : o.titleEn}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 4 }}><I n="pin" s={11}/>{isAr ? o.city : o.cityEn}</span>
              <span style={{ fontSize: 12, color: "#06b6d4" }}>▲ {o.trend}</span>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 14, right: isAr ? "auto" : 14, left: isAr ? 14 : "auto" }}><Ring v={o.score} size={58}/></div>
        </div>

        <div style={{ padding: "0 20px 24px" }}>
          <div style={{ display: "flex", gap: 2, padding: 4, background: "rgba(255,255,255,0.04)", borderRadius: 14, margin: "16px 0" }}>
            {[
              { id: "overview", label: isAr ? "نظرة عامة" : "Overview" },
              { id: "finance", label: isAr ? "المالية" : "Financials" },
              { id: "ai", label: isAr ? "تحليل ذكي" : "AI Analysis" },
              { id: "book", label: isAr ? "حجز" : "Book" },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "8px 4px", borderRadius: 10, fontSize: 12, fontWeight: 600, background: tab === t.id ? "rgba(6,182,212,0.2)" : "transparent", color: tab === t.id ? "#06b6d4" : "rgba(255,255,255,0.4)", border: "none", cursor: "pointer", transition: "all 0.2s" }}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>{isAr ? o.description : o.descriptionEn}</p>
              <FundBar pct={o.fundedPct} lang={lang}/>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 16 }}>
                {[
                  { l: isAr ? "القطاع" : "Sector", v: isAr ? o.sector : o.sectorEn, c: "#06b6d4" },
                  { l: isAr ? "المخاطرة" : "Risk", v: isAr ? o.risk : o.riskEn },
                  { l: isAr ? "المشاهدات" : "Views", v: o.views.toLocaleString() },
                ].map((s, i) => (
                  <div key={i} style={{ padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.04)", textAlign: "center" }}>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>{s.l}</p>
                    <p style={{ fontWeight: 700, fontSize: 13, color: s.c || "#fff" }}>{s.v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "finance" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { l: isAr ? "إجمالي التكلفة" : "Total Cost", v: `SAR ${o.cost.toLocaleString()}` },
                { l: isAr ? "العائد السنوي المتوقع" : "Expected Annual ROI", v: `${o.roi}%`, hi: true },
                { l: isAr ? "فترة الاسترداد التقديرية" : "Est. Payback Period", v: `${Math.round(100/o.roi)} ${isAr ? "سنوات" : "years"}` },
                { l: isAr ? "نقاط الاستثمار الذكي" : "Smart Score", v: `${o.score}/100`, hi: true },
                { l: isAr ? "نسبة التمويل الحالية" : "Current Funding", v: `${o.fundedPct}%` },
                { l: isAr ? "اتجاه السوق" : "Market Trend", v: `▲ ${o.trend}`, pos: true },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{r.l}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: r.hi ? "#06b6d4" : r.pos ? "#10b981" : "#fff" }}>{r.v}</span>
                </div>
              ))}
            </div>
          )}

          {tab === "ai" && (
            <div>
              <div style={{ padding: 16, borderRadius: 14, background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(6,182,212,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <I n="ai" s={14} c="text-cyan-400"/>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#06b6d4" }}>{isAr ? "تحليل ذكاء اصطناعي" : "AI Feasibility Analysis"}</span>
                </div>
                {aiSummary
                  ? <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>{aiSummary}</p>
                  : <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>{isAr ? "اضغط لتوليد تحليل متخصص بالذكاء الاصطناعي لهذه الفرصة." : "Click below to generate an expert AI analysis for this opportunity."}</p>
                }
              </div>
              <button onClick={genAI} disabled={aiLoading} style={{ width: "100%", padding: "12px", borderRadius: 12, fontSize: 13, fontWeight: 700, background: aiLoading ? "rgba(6,182,212,0.3)" : "linear-gradient(135deg,#0891b2,#06b6d4)", color: "#fff", border: "none", cursor: aiLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {aiLoading ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 1s linear infinite" }}/>{isAr ? "جارٍ التحليل..." : "Analyzing..."}</> : <><I n="ai" s={15}/>{isAr ? "توليد التحليل الذكي" : "Generate AI Analysis"}</>}
              </button>
            </div>
          )}

          {tab === "book" && (
            <div>
              {booked ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <I n="check" s={28} c="text-emerald-400"/>
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>{isAr ? "تم تسجيل اهتمامك!" : "Interest Registered!"}</h3>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{isAr ? "سيتواصل معك أحد مستشارينا خلال 24 ساعة" : "Our consultant will contact you within 24 hours"}</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 16, lineHeight: 1.7 }}>
                    {isAr ? "سجّل اهتمامك بهذه الفرصة الاستثمارية وسيتواصل معك مستشارنا المتخصص لتزويدك بكافة التفاصيل والخطوات التالية." : "Register your interest and our specialist consultant will contact you with full details and next steps."}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                    {[isAr ? "الاسم الكامل" : "Full Name", isAr ? "البريد الإلكتروني" : "Email", isAr ? "رقم الجوال" : "Phone"].map((pl, i) => (
                      <input key={i} placeholder={pl} style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, outline: "none" }}/>
                    ))}
                  </div>
                  <button onClick={() => setBooked(true)} style={{ width: "100%", padding: "13px", borderRadius: 12, fontSize: 13, fontWeight: 700, background: "linear-gradient(135deg,#059669,#10b981)", color: "#fff", border: "none", cursor: "pointer" }}>
                    {isAr ? "تسجيل الاهتمام بالاستثمار" : "Register Investment Interest"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── MAP ─────────────────────────────────────────────────────────────────────
const MapView = ({ opps, lang, onView }) => {
  const isAr = lang === "ar";
  const [sel, setSel] = useState(null);
  const cities = opps.map(o => ({
    ...o,
    x: ((o.lng - 35) / (52 - 35)) * 480 + 40,
    y: ((30 - o.lat) / (30 - 18)) * 300 + 40,
  }));
  const sectorColor = (sector) => SECTORS_DATA.find(s => s.ar === sector)?.color || "#06b6d4";

  return (
    <div style={{ borderRadius: 20, overflow: "hidden", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", position: "relative" }}>
      <div style={{ padding: "16px 20px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 15 }}>{isAr ? "خريطة الفرص التفاعلية" : "Interactive Opportunity Map"}</h3>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{opps.length} {isAr ? "فرصة معروضة" : "opportunities shown"}</p>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SECTORS_DATA.slice(0, 4).map(s => (
            <span key={s.ar} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: `${s.color}18`, color: s.color }}>{s.icon} {isAr ? s.ar : s.en}</span>
          ))}
        </div>
      </div>
      <svg viewBox="0 0 560 380" style={{ width: "100%", display: "block", background: "rgba(6,182,212,0.02)" }}>
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(6,182,212,0.03)"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
        </defs>
        <rect width="560" height="380" fill="url(#mapGlow)"/>
        {[1,2,3,4,5].map(i => <line key={i} x1={i*100} y1="0" x2={i*100} y2="380" stroke="rgba(6,182,212,0.05)" strokeWidth="1"/>)}
        {[1,2,3].map(i => <line key={i} x1="0" y1={i*95} x2="560" y2={i*95} stroke="rgba(6,182,212,0.05)" strokeWidth="1"/>)}
        <path d="M 90 55 L 155 45 L 215 55 L 285 48 L 355 65 L 415 98 L 468 132 L 492 185 L 480 248 L 445 298 L 395 325 L 348 342 L 290 352 L 230 340 L 192 308 L 165 268 L 142 218 L 115 195 L 88 168 L 68 128 Z"
          fill="rgba(6,182,212,0.03)" stroke="rgba(6,182,212,0.15)" strokeWidth="1.5"/>
        {cities.map(city => {
          const col = sectorColor(city.sector);
          const isSelected = sel?.id === city.id;
          return (
            <g key={city.id} onClick={() => setSel(isSelected ? null : city)} style={{ cursor: "pointer" }}>
              <circle cx={city.x} cy={city.y} r={isSelected ? 24 : 18} fill={`${col}15`} stroke={`${col}40`} strokeWidth="1">
                <animate attributeName="r" values={`${isSelected ? 24 : 18};${isSelected ? 30 : 22};${isSelected ? 24 : 18}`} dur="2.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx={city.x} cy={city.y} r={isSelected ? 10 : 7} fill={isSelected ? col : `${col}CC`}/>
              <text x={city.x} y={city.y + 24} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8.5" fontWeight="600">
                {isAr ? city.city : city.cityEn}
              </text>
              {isSelected && (
                <circle cx={city.x} cy={city.y} r="14" fill="none" stroke={col} strokeWidth="2" strokeDasharray="4 2">
                  <animateTransform attributeName="transform" type="rotate" from={`0 ${city.x} ${city.y}`} to={`360 ${city.x} ${city.y}`} dur="4s" repeatCount="indefinite"/>
                </circle>
              )}
            </g>
          );
        })}
      </svg>
      {sel && (
        <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, background: "rgba(10,22,40,0.97)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: 16, padding: "14px 16px", backdropFilter: "blur(16px)", display: "flex", gap: 12, alignItems: "center" }}>
          <img src={sel.image} style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} alt=""/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>{isAr ? sel.title : sel.titleEn}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{isAr ? sel.sector : sel.sectorEn} · {sel.roi}% ROI · Score: {sel.score}</p>
            <FundBar pct={sel.fundedPct} lang={lang}/>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <button onClick={() => onView(sel)} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: "linear-gradient(135deg,#0891b2,#06b6d4)", color: "#fff", border: "none", cursor: "pointer" }}>
              {isAr ? "التفاصيل" : "Details"}
            </button>
            <button onClick={() => setSel(null)} style={{ padding: "5px", borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", display: "flex", justifyContent: "center" }}>
              <I n="x" s={12} c="text-gray-400"/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MESSAGING ────────────────────────────────────────────────────────────────
const Messaging = ({ lang }) => {
  const isAr = lang === "ar";
  const [activeCon, setActiveCon] = useState(0);
  const [msgs, setMsgs] = useState([
    { id: 1, from: "c", text: isAr ? "مرحباً! أنا هنا لمساعدتك في تقييم الفرص الاستثمارية." : "Hello! I'm here to help you evaluate investment opportunities.", time: "10:30" },
    { id: 2, from: "i", text: isAr ? "أريد معرفة المزيد عن منتجع جدة الساحلي." : "I'd like to know more about the Jeddah coastal resort.", time: "10:32" },
    { id: 3, from: "c", text: isAr ? "هذا المشروع يوفر عائداً 18٪ مع مخاطر منخفضة جداً، نسبة التمويل وصلت 85٪." : "This project offers 18% ROI with very low risk, funding is at 85%.", time: "10:34" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
    setMsgs(m => [...m, { id: Date.now(), from: "i", text: input, time: now }]);
    setInput("");
    setTimeout(() => {
      setMsgs(m => [...m, { id: Date.now() + 1, from: "c", text: isAr ? "شكراً على استفسارك، سأقوم بإرسال دراسة جدوى تفصيلية." : "Thank you for your inquiry, I'll send a detailed feasibility study.", time: new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }) }]);
    }, 1500);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 0, height: 480, borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.06)", padding: 12 }}>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 600, marginBottom: 10, padding: "0 4px" }}>{isAr ? "المحادثات" : "CHATS"}</p>
        {CONSULTANTS.map((c, i) => (
          <div key={c.id} onClick={() => setActiveCon(i)} style={{ padding: "10px 8px", borderRadius: 10, cursor: "pointer", background: activeCon === i ? "rgba(6,182,212,0.1)" : "transparent", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(6,182,212,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#06b6d4", flexShrink: 0, position: "relative" }}>
              {c.avatar}
              {i === 0 && <span style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%", background: "#10b981", border: "1.5px solid #0a1628" }}/>}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{isAr ? c.name.split(" ").slice(-1)[0] : c.nameEn.split(" ").slice(-1)[0]}</p>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{isAr ? c.specialty.split(" ")[0] : c.specialtyEn.split(" ")[0]}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", background: "#0a1628" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(6,182,212,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#06b6d4" }}>{CONSULTANTS[activeCon].avatar}</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700 }}>{isAr ? CONSULTANTS[activeCon].name : CONSULTANTS[activeCon].nameEn}</p>
            <p style={{ fontSize: 10, color: "#10b981" }}>● {isAr ? "متاح" : "Online"}</p>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {msgs.map(m => (
            <div key={m.id} style={{ display: "flex", justifyContent: m.from === "i" ? (isAr ? "flex-start" : "flex-end") : (isAr ? "flex-end" : "flex-start") }}>
              <div style={{ maxWidth: "70%", padding: "9px 13px", borderRadius: m.from === "i" ? (isAr ? "16px 16px 16px 4px" : "16px 16px 4px 16px") : (isAr ? "16px 16px 4px 16px" : "16px 16px 16px 4px"), background: m.from === "i" ? "rgba(6,182,212,0.18)" : "rgba(255,255,255,0.07)" }}>
                <p style={{ fontSize: 13, color: "#fff" }}>{m.text}</p>
                <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 4, textAlign: "right" }}>{m.time}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef}/>
        </div>
        <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={isAr ? "اكتب رسالتك..." : "Type a message..."} style={{ flex: 1, padding: "9px 14px", borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, outline: "none" }}/>
          <button onClick={send} style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#0891b2,#06b6d4)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I n="send" s={14} c="text-white"/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("ar");
  const [page, setPage] = useState("home");
  const [viewMode, setViewMode] = useState("grid");
  const [sel, setSel] = useState(null);
  const [saved, setSaved] = useState([2, 5]);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ sector: "", risk: "" });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const isAr = lang === "ar";

  const filtered = OPPORTUNITIES.filter(o => {
    const q = search.toLowerCase();
    const titleMatch = !q || (isAr ? o.title : o.titleEn).toLowerCase().includes(q) || (isAr ? o.city : o.cityEn).toLowerCase().includes(q);
    const sectorMatch = !filters.sector || (isAr ? o.sector : o.sectorEn) === filters.sector;
    const riskMatch = !filters.risk || (isAr ? o.risk : o.riskEn) === filters.risk;
    return titleMatch && sectorMatch && riskMatch;
  });

  const toggleSave = id => setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleCompare = o => setCompareList(c => c.find(x => x.id === o.id) ? c.filter(x => x.id !== o.id) : c.length < 3 ? [...c, o] : c);

  const navLinks = [
    { id: "home", label: isAr ? "الرئيسية" : "Home", icon: "home" },
    { id: "opportunities", label: isAr ? "الفرص" : "Opportunities", icon: "brief" },
    { id: "map", label: isAr ? "الخريطة" : "Map", icon: "map" },
    { id: "consultants", label: isAr ? "المستشارون" : "Consultants", icon: "users" },
    { id: "tools", label: isAr ? "أدوات" : "Tools", icon: "calc" },
    { id: "dashboard", label: isAr ? "لوحتي" : "Dashboard", icon: "chart" },
    { id: "messages", label: isAr ? "الرسائل" : "Messages", icon: "msg" },
  ];

  const notifs = isAr
    ? ["فرصة جديدة في الرياض تطابق اهتماماتك", "مستشارك أرسل دراسة جدوى", "محطة تبوك الشمسية وصلت 92٪ تمويل"]
    : ["New opportunity in Riyadh matches your interests", "Your consultant sent a feasibility study", "Tabuk solar station reached 92% funding"];

  return (
    <div dir={isAr ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: "#060d1a", color: "#fff", fontFamily: isAr ? "'Tajawal','Cairo',sans-serif" : "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(6,182,212,0.3);border-radius:99px}
        input[type=range]{height:4px;border-radius:99px}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        .fu{animation:fadeUp 0.4s ease forwards}
        .teal{background:linear-gradient(135deg,#06b6d4,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .btn-teal{background:linear-gradient(135deg,#0891b2,#06b6d4);color:#fff;border:none;cursor:pointer;font-family:inherit}
        .btn-ghost{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.1);cursor:pointer;font-family:inherit}
      `}</style>

      {/* NEWS TICKER */}
      <NewsTicker lang={lang}/>

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(6,13,26,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(6,182,212,0.1)" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, cursor: "pointer" }} onClick={() => setPage("home")}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#0891b2,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(6,182,212,0.4)" }}>
              <I n="trend" s={18} c="text-white"/>
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 14, color: "#fff", lineHeight: 1 }}>{isAr ? "المستثمر الذكي" : "Smart Investor"}</p>
              <p style={{ fontSize: 9, color: "#06b6d4", letterSpacing: "0.1em", marginTop: 1 }}>VISION 2030</p>
            </div>
          </div>

          {/* Nav links – hidden on small screens via flex wrap trick */}
          <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.03)", padding: "4px", borderRadius: 14, flexWrap: "nowrap", overflowX: "auto", maxWidth: "calc(100vw - 280px)" }}>
            {navLinks.map(l => (
              <button key={l.id} onClick={() => { setPage(l.id); setMobileOpen(false); }} style={{ padding: "7px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600, background: page === l.id ? "rgba(6,182,212,0.2)" : "transparent", color: page === l.id ? "#06b6d4" : "rgba(255,255,255,0.45)", border: "none", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", fontFamily: "inherit" }}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {compareList.length > 0 && (
              <button onClick={() => setShowCompare(true)} style={{ padding: "6px 12px", borderRadius: 10, fontSize: 11, fontWeight: 700, background: "rgba(6,182,212,0.15)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.25)", cursor: "pointer", fontFamily: "inherit" }}>
                {isAr ? `مقارنة (${compareList.length})` : `Compare (${compareList.length})`}
              </button>
            )}
            <button onClick={() => setLang(l => l === "ar" ? "en" : "ar")} style={{ padding: "6px 12px", borderRadius: 10, fontSize: 11, fontWeight: 800, background: "rgba(6,182,212,0.1)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.2)", cursor: "pointer", fontFamily: "inherit" }}>
              {isAr ? "EN" : "عربي"}
            </button>
            <div style={{ position: "relative" }}>
              <button onClick={() => setNotifOpen(n => !n)} style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I n="bell" s={16} c="text-gray-400"/>
                <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: "#06b6d4", border: "1.5px solid #060d1a", animation: "pulse 2s infinite" }}/>
              </button>
              {notifOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 280, background: "#0d1f38", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 14, padding: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", zIndex: 99 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{isAr ? "الإشعارات" : "NOTIFICATIONS"}</p>
                  {notifs.map((n, i) => (
                    <div key={i} style={{ padding: "10px", borderRadius: 10, background: i === 0 ? "rgba(6,182,212,0.08)" : "transparent", marginBottom: 4 }}>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{n}</p>
                      {i === 0 && <p style={{ fontSize: 10, color: "#06b6d4", marginTop: 3 }}>{isAr ? "الآن" : "Just now"}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: 1300, margin: "0 auto", padding: "28px 20px 80px" }}>

        {/* ── HOME ── */}
        {page === "home" && (
          <div className="fu">
            {/* Hero */}
            <div style={{ position: "relative", textAlign: "center", padding: "52px 20px 48px", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <div style={{ position: "absolute", top: "10%", left: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)", filter: "blur(60px)" }}/>
                <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)", filter: "blur(50px)" }}/>
                {/* Floating orbs */}
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{ position: "absolute", width: 6+i*2, height: 6+i*2, borderRadius: "50%", background: `rgba(6,182,212,${0.3-i*0.04})`, top: `${15+i*13}%`, left: `${8+i*15}%`, animation: `pulse ${2+i*0.5}s ease-in-out infinite` }}/>
                ))}
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 99, padding: "7px 18px", marginBottom: 24 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#06b6d4", animation: "pulse 1.5s ease-in-out infinite" }}/>
                <span style={{ fontSize: 12, color: "#06b6d4", fontWeight: 600 }}>{isAr ? "المنصة الاستثمارية الأذكى في المملكة" : "Saudi Arabia's Smartest Investment Platform"}</span>
              </div>
              <h1 style={{ fontSize: "clamp(2rem,5vw,3.8rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 18 }}>
                <span className="teal">{isAr ? "استثمر بذكاء" : "Invest Smarter"}</span><br/>
                <span style={{ color: "rgba(255,255,255,0.88)" }}>{isAr ? "في مستقبل المملكة العربية السعودية" : "in Saudi Arabia's Future"}</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.9rem,2vw,1.1rem)", maxWidth: 540, margin: "0 auto 36px", lineHeight: 1.8 }}>
                {isAr ? "اكتشف أفضل الفرص الاستثمارية عبر 13 منطقة في المملكة مع تحليل ذكاء اصطناعي متقدم ومستشارين معتمدين" : "Discover top investment opportunities across 13 Saudi regions with advanced AI analysis and certified consultants"}
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => setPage("opportunities")} className="btn-teal" style={{ padding: "14px 32px", borderRadius: 13, fontWeight: 700, fontSize: 15, boxShadow: "0 8px 32px rgba(6,182,212,0.3)", fontFamily: "inherit" }}>
                  {isAr ? "استكشف الفرص" : "Explore Opportunities"}
                </button>
                <button onClick={() => setPage("tools")} className="btn-ghost" style={{ padding: "14px 28px", borderRadius: 13, fontWeight: 600, fontSize: 15, fontFamily: "inherit" }}>
                  {isAr ? "🧮 حاسبة العائد" : "🧮 ROI Calculator"}
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 40 }}>
              {[
                { v: "200+", l: isAr ? "فرصة استثمارية" : "Opportunities", icon: "brief", sparkData: [40,55,48,62,70,80], color: "#06b6d4" },
                { v: "13", l: isAr ? "منطقة مغطاة" : "Regions", icon: "map", sparkData: [10,11,11,12,13,13], color: "#10b981" },
                { v: "50+", l: isAr ? "مستشار معتمد" : "Consultants", icon: "award", sparkData: [30,35,38,42,47,50], color: "#f59e0b" },
                { v: "SAR 2.4B", l: isAr ? "حجم الاستثمارات" : "Total Volume", icon: "trend", sparkData: [800,1100,1400,1700,2000,2400], color: "#8b5cf6" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "18px 16px", borderRadius: 18, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <I n={s.icon} s={16} style={{ color: s.color }}/>
                    </div>
                    <Sparkline data={s.sparkData} color={s.color} w={70} h={28}/>
                  </div>
                  <p style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{s.v}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{s.l}</p>
                </div>
              ))}
            </div>

            {/* Market Chart */}
            <div style={{ marginBottom: 36 }}><MarketChart lang={lang}/></div>

            {/* Featured opportunities */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h2 style={{ fontWeight: 800, fontSize: 20 }}>{isAr ? "🌟 الفرص المميزة" : "🌟 Featured Opportunities"}</h2>
                <button onClick={() => setPage("opportunities")} style={{ fontSize: 12, color: "#06b6d4", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
                  {isAr ? "عرض الكل" : "View all"} <I n={isAr ? "left" : "right"} s={13}/>
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 16 }}>
                {OPPORTUNITIES.filter(o => o.tag).slice(0, 4).map(o => (
                  <OppCard key={o.id} o={o} lang={lang} onView={setSel} saved={saved.includes(o.id)} onSave={toggleSave} onCompareAdd={toggleCompare} inCompare={compareList.some(c => c.id === o.id)}/>
                ))}
              </div>
            </div>

            {/* Sectors */}
            <div>
              <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>{isAr ? "القطاعات الاستثمارية" : "Investment Sectors"}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 10 }}>
                {SECTORS_DATA.map(s => (
                  <button key={s.ar} onClick={() => { setFilters(f => ({ ...f, sector: isAr ? s.ar : s.en })); setPage("opportunities"); }} style={{ padding: "14px 10px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: `1px solid ${s.color}22`, cursor: "pointer", textAlign: "center", transition: "all 0.2s", fontFamily: "inherit" }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${s.color}12`; e.currentTarget.style.border = `1px solid ${s.color}44`; e.currentTarget.style.transform = "scale(1.03)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.border = `1px solid ${s.color}22`; e.currentTarget.style.transform = "scale(1)"; }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{isAr ? s.ar : s.en}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── OPPORTUNITIES ── */}
        {page === "opportunities" && (
          <div className="fu">
            <div style={{ marginBottom: 22 }}>
              <h1 style={{ fontWeight: 800, fontSize: 24 }}>{isAr ? "الفرص الاستثمارية" : "Investment Opportunities"}</h1>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 4 }}>{filtered.length} {isAr ? "فرصة متاحة" : "available"}</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
              <div style={{ position: "relative", flex: "1 1 200px" }}>
                <span style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [isAr ? "right" : "left"]: 12, color: "rgba(255,255,255,0.3)", pointerEvents: "none" }}><I n="search" s={15}/></span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={isAr ? "ابحث..." : "Search..."} style={{ width: "100%", padding: isAr ? "10px 40px 10px 14px" : "10px 14px 10px 40px", borderRadius: 11, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, outline: "none", fontFamily: "inherit" }}/>
              </div>
              {[
                { key: "sector", opts: SECTORS_DATA.map(s => ({ v: isAr ? s.ar : s.en, l: `${s.icon} ${isAr ? s.ar : s.en}` })), ph: isAr ? "القطاع" : "Sector" },
                { key: "risk", opts: isAr ? [{ v: "منخفض", l: "🟢 منخفض" }, { v: "متوسط", l: "🟡 متوسط" }, { v: "مرتفع", l: "🔴 مرتفع" }] : [{ v: "Low", l: "🟢 Low" }, { v: "Medium", l: "🟡 Medium" }, { v: "High", l: "🔴 High" }], ph: isAr ? "المخاطرة" : "Risk" },
              ].map(f => (
                <select key={f.key} value={filters[f.key]} onChange={e => setFilters(p => ({ ...p, [f.key]: e.target.value }))} style={{ padding: "10px 14px", borderRadius: 11, background: "rgba(255,255,255,0.05)", border: `1px solid ${filters[f.key] ? "rgba(6,182,212,0.4)" : "rgba(255,255,255,0.1)"}`, color: filters[f.key] ? "#06b6d4" : "rgba(255,255,255,0.4)", fontSize: 13, outline: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  <option value="" style={{ background: "#0d1f38" }}>{f.ph}</option>
                  {f.opts.map(o => <option key={o.v} value={o.v} style={{ background: "#0d1f38" }}>{o.l}</option>)}
                </select>
              ))}
              {(filters.sector || filters.risk || search) && (
                <button onClick={() => { setFilters({ sector: "", risk: "" }); setSearch(""); }} style={{ padding: "10px 14px", borderRadius: 11, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                  {isAr ? "مسح الفلاتر" : "Clear"}
                </button>
              )}
              <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", padding: 4, borderRadius: 11 }}>
                {["grid", "list"].map(v => (
                  <button key={v} onClick={() => setViewMode(v)} style={{ width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: viewMode === v ? "rgba(6,182,212,0.2)" : "transparent", border: "none", cursor: "pointer" }}>
                    <I n={v} s={15} style={{ color: viewMode === v ? "#06b6d4" : "rgba(255,255,255,0.3)" }}/>
                  </button>
                ))}
              </div>
            </div>

            {viewMode === "grid" ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 16 }}>
                {filtered.map(o => <OppCard key={o.id} o={o} lang={lang} onView={setSel} saved={saved.includes(o.id)} onSave={toggleSave} onCompareAdd={toggleCompare} inCompare={compareList.some(c => c.id === o.id)}/>)}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filtered.map(o => {
                  const si = SECTORS_DATA.find(s => s.ar === o.sector);
                  return (
                    <div key={o.id} style={{ display: "flex", gap: 14, padding: 14, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", transition: "all 0.2s" }}
                      onClick={() => setSel(o)}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(6,182,212,0.3)"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
                      <img src={o.image} style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} alt=""/>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <p style={{ fontWeight: 700, fontSize: 14 }}>{isAr ? o.title : o.titleEn}</p>
                          {o.tag && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "rgba(6,182,212,0.15)", color: "#06b6d4" }}>{o.tag}</span>}
                        </div>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{isAr ? o.city : o.cityEn} · {si?.icon} {isAr ? o.sector : o.sectorEn}</p>
                        <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
                          <span style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>ROI {o.roi}%</span>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{(o.cost/1e6).toFixed(0)}M SAR</span>
                          <span style={{ fontSize: 12, color: "#06b6d4", fontWeight: 700 }}>Score {o.score}</span>
                          <span style={{ fontSize: 12, color: "#10b981" }}>▲ {o.trend}</span>
                        </div>
                        <div style={{ marginTop: 8, maxWidth: 240 }}><FundBar pct={o.fundedPct} lang={lang}/></div>
                      </div>
                      <div style={{ alignSelf: "center" }}><Ring v={o.score} size={48}/></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── MAP ── */}
        {page === "map" && (
          <div className="fu">
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontWeight: 800, fontSize: 24 }}>{isAr ? "خريطة الاستثمارات التفاعلية" : "Interactive Investment Map"}</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{isAr ? "استكشف الفرص الاستثمارية جغرافياً عبر مناطق المملكة" : "Explore opportunities geographically across Saudi regions"}</p>
            </div>
            <MapView opps={filtered} lang={lang} onView={setSel}/>
          </div>
        )}

        {/* ── CONSULTANTS ── */}
        {page === "consultants" && (
          <div className="fu">
            <div style={{ marginBottom: 22 }}>
              <h1 style={{ fontWeight: 800, fontSize: 24 }}>{isAr ? "المستشارون الماليون المعتمدون" : "Certified Financial Consultants"}</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{isAr ? "تواصل مع أفضل المستشارين الماليين في المملكة" : "Connect with Saudi Arabia's top financial advisors"}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
              {CONSULTANTS.map(c => (
                <div key={c.id} style={{ borderRadius: 20, overflow: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", padding: 20, transition: "all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(6,182,212,0.3)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#06b6d4", flexShrink: 0, position: "relative" }}>
                      {c.avatar}
                      {c.verified && <div style={{ position: "absolute", bottom: -3, right: -3, width: 18, height: 18, borderRadius: "50%", background: "#10b981", border: "2px solid #060d1a", display: "flex", alignItems: "center", justifyContent: "center" }}><I n="check" s={9} c="text-white"/></div>}
                    </div>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: 15 }}>{isAr ? c.name : c.nameEn}</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{isAr ? c.specialty : c.specialtyEn}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: 3, marginTop: 3 }}><I n="pin" s={10}/>{isAr ? c.city : c.cityEn}</p>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                    {[
                      { l: isAr ? "التقييم" : "Rating", v: c.rating, icon: "star", c: "#f59e0b" },
                      { l: isAr ? "الدراسات" : "Studies", v: c.studies, icon: "upload" },
                      { l: isAr ? "العملاء" : "Clients", v: c.clients, icon: "users" },
                    ].map((s, i) => (
                      <div key={i} style={{ textAlign: "center", padding: "8px 6px", borderRadius: 10, background: "rgba(255,255,255,0.04)" }}>
                        <p style={{ fontSize: 13, fontWeight: 800, color: s.c || "#fff" }}>{s.v}</p>
                        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{s.l}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{isAr ? "وقت الاستجابة: " : "Response: "}<span style={{ color: "#10b981" }}>{isAr ? c.responseTime : c.responseTimeEn}</span></span>
                  </div>
                  <button onClick={() => setPage("messages")} className="btn-teal" style={{ width: "100%", padding: "10px", borderRadius: 11, fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
                    {isAr ? "💬 تواصل الآن" : "💬 Contact Now"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TOOLS ── */}
        {page === "tools" && (
          <div className="fu">
            <div style={{ marginBottom: 22 }}>
              <h1 style={{ fontWeight: 800, fontSize: 24 }}>{isAr ? "أدوات الاستثمار الذكية" : "Smart Investment Tools"}</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{isAr ? "استخدم أدواتنا المتقدمة لاتخاذ قرارات استثمارية مدروسة" : "Use our advanced tools to make informed investment decisions"}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 20 }}>
              <Calculator lang={lang}/>
              <MarketChart lang={lang}/>
              {/* Risk Matrix */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <I n="shield" s={16} c="text-amber-400"/>
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: 16 }}>{isAr ? "مصفوفة المخاطر والعائد" : "Risk vs Return Matrix"}</h3>
                </div>
                <div style={{ position: "relative", height: 200, background: "rgba(255,255,255,0.02)", borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
                  <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 12px" }}>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{isAr ? "مخاطرة منخفضة" : "Low Risk"}</span>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{isAr ? "مخاطرة مرتفعة" : "High Risk"}</span>
                  </div>
                  {OPPORTUNITIES.slice(0, 6).map(o => {
                    const riskNum = o.risk === "منخفض" ? 0.15 : o.risk === "متوسط" ? 0.5 : 0.85;
                    const roiNorm = (o.roi - 15) / (35 - 15);
                    const si = SECTORS_DATA.find(s => s.ar === o.sector);
                    return (
                      <div key={o.id} style={{ position: "absolute", left: `${riskNum * 85 + 5}%`, bottom: `${roiNorm * 75 + 12}%`, transform: "translate(-50%, 50%)", cursor: "pointer" }} onClick={() => setSel(o)}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${si?.color || "#06b6d4"}33`, border: `2px solid ${si?.color || "#06b6d4"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }} title={isAr ? o.title : o.titleEn}>
                          {si?.icon}
                        </div>
                      </div>
                    );
                  })}
                  {/* Axes */}
                  <div style={{ position: "absolute", left: 10, top: 8, bottom: 20, width: 1, background: "rgba(255,255,255,0.08)" }}/>
                  <div style={{ position: "absolute", left: 10, right: 10, bottom: 20, height: 1, background: "rgba(255,255,255,0.08)" }}/>
                  <span style={{ position: "absolute", left: 14, top: "50%", fontSize: 9, color: "rgba(255,255,255,0.2)", transform: "translateY(-50%) rotate(-90deg)", transformOrigin: "center", whiteSpace: "nowrap" }}>{isAr ? "عائد مرتفع ↑" : "High ROI ↑"}</span>
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>{isAr ? "انقر على أي نقطة لعرض تفاصيل الفرصة" : "Click any dot to view opportunity details"}</p>
              </div>
              {/* Sector breakdown */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(139,92,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <I n="chart" s={16} c="text-violet-400"/>
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: 16 }}>{isAr ? "توزيع القطاعات" : "Sector Distribution"}</h3>
                </div>
                {SECTORS_DATA.map(s => {
                  const count = OPPORTUNITIES.filter(o => o.sector === s.ar).length;
                  const pct = (count / OPPORTUNITIES.length) * 100;
                  return count > 0 ? (
                    <div key={s.ar} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{s.icon} {isAr ? s.ar : s.en}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{count} {isAr ? "فرص" : "opps"}</span>
                      </div>
                      <div style={{ height: 5, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: s.color, borderRadius: 99, transition: "width 1s ease" }}/>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {page === "dashboard" && (
          <div className="fu">
            <div style={{ marginBottom: 22 }}>
              <h1 style={{ fontWeight: 800, fontSize: 24 }}>{isAr ? "لوحة التحكم" : "Dashboard"}</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{isAr ? "مرحباً بك، تتبع نشاطك الاستثماري" : "Welcome back. Track your investment activity."}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 28 }}>
              {[
                { l: isAr ? "محفوظة" : "Saved", v: saved.length, icon: "heart", c: "#ef4444" },
                { l: isAr ? "المشاهدات" : "Viewed", v: 47, icon: "eye", c: "#06b6d4" },
                { l: isAr ? "الرسائل" : "Messages", v: 3, icon: "msg", c: "#f59e0b" },
                { l: isAr ? "متوسط العائد" : "Avg ROI", v: "24%", icon: "trend", c: "#10b981" },
                { l: isAr ? "في المقارنة" : "Comparing", v: compareList.length, icon: "compare", c: "#8b5cf6" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "16px 14px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: `${s.c}1a`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                    <I n={s.icon} s={15} style={{ color: s.c }}/>
                  </div>
                  <p style={{ fontSize: 20, fontWeight: 800 }}>{s.v}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{s.l}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>{isAr ? "الفرص المحفوظة" : "Saved Opportunities"}</h3>
                {OPPORTUNITIES.filter(o => saved.includes(o.id)).length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px", color: "rgba(255,255,255,0.2)" }}><I n="heart" s={36} style={{ margin: "0 auto 10px", display: "block" }}/><p style={{ fontSize: 13 }}>{isAr ? "لا توجد فرص محفوظة" : "No saved opportunities"}</p></div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {OPPORTUNITIES.filter(o => saved.includes(o.id)).map(o => (
                      <div key={o.id} style={{ display: "flex", gap: 12, padding: "10px", borderRadius: 12, background: "rgba(255,255,255,0.03)", cursor: "pointer" }} onClick={() => setSel(o)}>
                        <img src={o.image} style={{ width: 50, height: 50, borderRadius: 10, objectFit: "cover" }} alt=""/>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{isAr ? o.title : o.titleEn}</p>
                          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{isAr ? o.city : o.cityEn} · <span style={{ color: "#10b981" }}>{o.roi}%</span></p>
                          <div style={{ marginTop: 4 }}><FundBar pct={o.fundedPct} lang={lang}/></div>
                        </div>
                        <Ring v={o.score} size={42}/>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>{isAr ? "أداء المحفظة" : "Portfolio Performance"}</h3>
                <MarketChart lang={lang}/>
              </div>
            </div>
          </div>
        )}

        {/* ── MESSAGES ── */}
        {page === "messages" && (
          <div className="fu">
            <div style={{ marginBottom: 22 }}>
              <h1 style={{ fontWeight: 800, fontSize: 24 }}>{isAr ? "المراسلات" : "Messages"}</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{isAr ? "تواصل مباشرة مع المستشارين الماليين" : "Communicate directly with financial consultants"}</p>
            </div>
            <Messaging lang={lang}/>
          </div>
        )}
      </main>

      {/* DETAIL MODAL */}
      {sel && <DetailModal o={sel} lang={lang} onClose={() => setSel(null)} saved={saved.includes(sel.id)} onSave={toggleSave}/>}

      {/* COMPARE MODAL */}
      {showCompare && compareList.length >= 2 && <ComparePanel opps={compareList} lang={lang} onClose={() => setShowCompare(false)}/>}

      {/* COMPARE FLOATING BAR */}
      {compareList.length >= 2 && (
        <div style={{ position: "fixed", bottom: 72, left: "50%", transform: "translateX(-50%)", zIndex: 35, background: "rgba(6,182,212,0.9)", backdropFilter: "blur(16px)", borderRadius: 99, padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 40px rgba(6,182,212,0.4)", whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{isAr ? `${compareList.length} فرص للمقارنة` : `${compareList.length} items to compare`}</span>
          <button onClick={() => setShowCompare(true)} style={{ padding: "6px 16px", borderRadius: 99, background: "#fff", color: "#0891b2", fontSize: 12, fontWeight: 800, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            {isAr ? "قارن الآن" : "Compare Now"}
          </button>
          <button onClick={() => setCompareList([])} style={{ background: "rgba(255,255,255,0.2)", border: "none", width: 26, height: 26, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I n="x" s={12} c="text-white"/>
          </button>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(6,13,26,0.97)", borderTop: "1px solid rgba(6,182,212,0.12)", display: "flex", justifyContent: "space-around", padding: "8px 4px 12px", zIndex: 30, backdropFilter: "blur(20px)" }}>
        {navLinks.slice(0, 6).map(l => (
          <button key={l.id} onClick={() => setPage(l.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "4px 6px", borderRadius: 8, fontFamily: "inherit", minWidth: 0 }}>
            <I n={l.icon} s={19} style={{ color: page === l.id ? "#06b6d4" : "rgba(255,255,255,0.25)" }}/>
            <span style={{ fontSize: 9, color: page === l.id ? "#06b6d4" : "rgba(255,255,255,0.25)", fontWeight: page === l.id ? 700 : 400, whiteSpace: "nowrap" }}>{l.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
