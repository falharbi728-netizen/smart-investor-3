import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const OPPORTUNITIES = [
  { id: 1, title: "مجمع تجاري متكامل", titleEn: "Integrated Commercial Complex", sector: "عقارات", sectorEn: "Real Estate", city: "الرياض", cityEn: "Riyadh", region: "منطقة الرياض", regionEn: "Riyadh Region", cost: 15000000, roi: 22, risk: "متوسط", riskEn: "Medium", score: 87, lat: 24.7136, lng: 46.6753, description: "مجمع تجاري متطور يضم محلات تجارية ومكاتب ومطاعم في قلب الرياض. يستهدف المشروع الفئة المتوسطة والعليا.", descriptionEn: "A sophisticated commercial complex featuring retail outlets, offices, and restaurants in the heart of Riyadh.", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80", tag: "مميز" },
  { id: 2, title: "منتجع سياحي ساحلي", titleEn: "Coastal Tourist Resort", sector: "سياحة", sectorEn: "Tourism", city: "جدة", cityEn: "Jeddah", region: "منطقة مكة", regionEn: "Makkah Region", cost: 45000000, roi: 18, risk: "منخفض", riskEn: "Low", score: 91, lat: 21.5433, lng: 39.1728, description: "منتجع سياحي فاخر على ساحل البحر الأحمر مع وحدات فندقية وشاليهات وخدمات ترفيهية متكاملة.", descriptionEn: "A luxury resort on the Red Sea coast with hotel units, chalets, and integrated entertainment services.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", tag: "الأعلى تقييماً" },
  { id: 3, title: "مزرعة تقنية زراعية", titleEn: "AgriTech Smart Farm", sector: "زراعة", sectorEn: "Agriculture", city: "القصيم", cityEn: "Qassim", region: "منطقة القصيم", regionEn: "Qassim Region", cost: 8000000, roi: 31, risk: "مرتفع", riskEn: "High", score: 74, lat: 26.3260, lng: 43.9750, description: "مزرعة ذكية تستخدم تقنيات الزراعة المائية والطاقة الشمسية لإنتاج محاصيل عضوية عالية الجودة.", descriptionEn: "A smart farm using hydroponic technology and solar energy to produce high-quality organic crops.", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80", tag: "عائد مرتفع" },
  { id: 4, title: "مركز لوجستي متكامل", titleEn: "Integrated Logistics Center", sector: "لوجستيات", sectorEn: "Logistics", city: "الدمام", cityEn: "Dammam", region: "المنطقة الشرقية", regionEn: "Eastern Province", cost: 28000000, roi: 25, risk: "منخفض", riskEn: "Low", score: 89, lat: 26.4207, lng: 50.0888, description: "مركز لوجستي استراتيجي قرب الميناء يخدم قطاعات التجارة والصناعة والتوزيع في المنطقة الشرقية.", descriptionEn: "A strategic logistics center near the port serving trade, industry, and distribution sectors.", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80", tag: "" },
  { id: 5, title: "محطة طاقة شمسية", titleEn: "Solar Energy Station", sector: "طاقة", sectorEn: "Energy", city: "تبوك", cityEn: "Tabuk", region: "منطقة تبوك", regionEn: "Tabuk Region", cost: 55000000, roi: 19, risk: "منخفض", riskEn: "Low", score: 93, lat: 28.3838, lng: 36.5550, description: "محطة طاقة شمسية ضخمة بقدرة 200 ميجاوات تساهم في تحقيق أهداف رؤية 2030 للطاقة المتجددة.", descriptionEn: "A 200MW solar power plant contributing to Vision 2030 renewable energy targets.", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80", tag: "رؤية 2030" },
  { id: 6, title: "حي ترفيهي متكامل", titleEn: "Entertainment District", sector: "ترفيه", sectorEn: "Entertainment", city: "مكة المكرمة", cityEn: "Makkah", region: "منطقة مكة", regionEn: "Makkah Region", cost: 120000000, roi: 27, risk: "متوسط", riskEn: "Medium", score: 85, lat: 21.3891, lng: 39.8579, description: "حي ترفيهي شامل يضم مراكز تسوق وترفيه وفنادق ومطاعم عالمية لخدمة ملايين الزوار سنوياً.", descriptionEn: "A comprehensive entertainment district with shopping, entertainment, hotels, and international restaurants.", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80", tag: "" },
];

const CONSULTANTS = [
  { id: 1, name: "د. محمد الغامدي", nameEn: "Dr. Mohammed Al-Ghamdi", specialty: "عقارات واستثمار", specialtyEn: "Real Estate & Investment", studies: 24, rating: 4.9, city: "الرياض", cityEn: "Riyadh", avatar: "MG", verified: true },
  { id: 2, name: "أ. سارة الزهراني", nameEn: "Sara Al-Zahrani", specialty: "السياحة والضيافة", specialtyEn: "Tourism & Hospitality", studies: 18, rating: 4.8, city: "جدة", cityEn: "Jeddah", avatar: "SZ", verified: true },
  { id: 3, name: "م. خالد العتيبي", nameEn: "Eng. Khalid Al-Otaibi", specialty: "الطاقة المتجددة", specialtyEn: "Renewable Energy", studies: 31, rating: 4.7, city: "الدمام", cityEn: "Dammam", avatar: "KA", verified: true },
  { id: 4, name: "د. ريم الحربي", nameEn: "Dr. Reem Al-Harbi", specialty: "التقنية والابتكار", specialtyEn: "Technology & Innovation", studies: 15, rating: 4.9, city: "الرياض", cityEn: "Riyadh", avatar: "RH", verified: false },
];

const SECTORS = ["عقارات", "سياحة", "زراعة", "لوجستيات", "طاقة", "ترفيه", "تقنية", "صحة"];
const SECTORS_EN = ["Real Estate", "Tourism", "Agriculture", "Logistics", "Energy", "Entertainment", "Technology", "Healthcare"];
const REGIONS = ["منطقة الرياض", "منطقة مكة", "المنطقة الشرقية", "منطقة القصيم", "منطقة تبوك", "منطقة المدينة المنورة"];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, className = "" }) => {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    map: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
    briefcase: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    trending: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    message: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    heart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    upload: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    pin: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    chevronRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><polyline points="9 18 15 12 9 6"/></svg>,
    grid: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    list: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}><polyline points="20 6 9 17 4 12"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    ai: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M12 2a4 4 0 0 1 4 4v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z"/><circle cx="12" cy="13" r="2"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  };
  return icons[name] || null;
};

// ─── SCORE RING ───────────────────────────────────────────────────────────────
const ScoreRing = ({ score, size = 56 }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 85 ? "#10b981" : score >= 70 ? "#f59e0b" : "#ef4444";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s ease" }}/>
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        style={{ transform: "rotate(90deg) translate(0, -56px)", transformOrigin: `${size/2}px ${size/2}px`, fill: color, fontSize: 13, fontWeight: 700 }}>
        {score}
      </text>
    </svg>
  );
};

// ─── OPPORTUNITY CARD ─────────────────────────────────────────────────────────
const OpportunityCard = ({ opp, lang, onView, saved, onSave }) => {
  const isAr = lang === "ar";
  const riskColors = { "منخفض": "bg-emerald-500/20 text-emerald-400", "متوسط": "bg-amber-500/20 text-amber-400", "مرتفع": "bg-red-500/20 text-red-400" };
  const riskColorsEn = { "Low": "bg-emerald-500/20 text-emerald-400", "Medium": "bg-amber-500/20 text-amber-400", "High": "bg-red-500/20 text-red-400" };
  const riskClass = isAr ? riskColors[opp.risk] : riskColorsEn[opp.riskEn];

  return (
    <div className="group relative rounded-2xl overflow-hidden cursor-pointer" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", transition: "all 0.3s ease" }}
      onMouseEnter={e => e.currentTarget.style.border = "1px solid rgba(212,175,55,0.4)"}
      onMouseLeave={e => e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"}
    >
      <div className="relative h-44 overflow-hidden">
        <img src={opp.image} alt="" className="w-full h-full object-cover" style={{ transition: "transform 0.5s ease", filter: "brightness(0.75)" }}
          onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}/>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,20,0.9) 0%, transparent 60%)" }}/>
        {opp.tag && (
          <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full" style={{ background: "rgba(212,175,55,0.9)", color: "#0a0a14" }}>{opp.tag}</span>
        )}
        <button onClick={(e) => { e.stopPropagation(); onSave(opp.id); }} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: saved ? "rgba(212,175,55,0.9)" : "rgba(0,0,0,0.5)", transition: "all 0.2s" }}>
          <Icon name="heart" size={14} className={saved ? "text-black" : "text-white"} />
        </button>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-white font-bold text-base leading-tight">{isAr ? opp.title : opp.titleEn}</p>
            <p className="text-gray-300 text-xs flex items-center gap-1 mt-0.5"><Icon name="pin" size={11}/>{isAr ? opp.city : opp.cityEn}</p>
          </div>
          <div className="flex-shrink-0"><ScoreRing score={opp.score} size={52}/></div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(99,179,237,0.15)", color: "#63b3ed" }}>{isAr ? opp.sector : opp.sectorEn}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${riskClass}`}>{isAr ? opp.risk : opp.riskEn}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
            <p className="text-gray-400 text-xs mb-0.5">{isAr ? "التكلفة" : "Cost"}</p>
            <p className="text-white font-bold text-sm">{(opp.cost / 1000000).toFixed(0)}M <span className="text-gray-400 font-normal text-xs">{isAr ? "ريال" : "SAR"}</span></p>
          </div>
          <div className="text-center p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
            <p className="text-gray-400 text-xs mb-0.5">{isAr ? "العائد" : "ROI"}</p>
            <p className="font-bold text-sm" style={{ color: "#10b981" }}>{opp.roi}%</p>
          </div>
        </div>
        <button onClick={() => onView(opp)} className="w-full py-2.5 rounded-xl text-sm font-bold transition-all" style={{ background: "linear-gradient(135deg, #d4af37, #b8962e)", color: "#0a0a14" }}>
          {isAr ? "عرض التفاصيل" : "View Details"}
        </button>
      </div>
    </div>
  );
};

// ─── MAP VIEW ─────────────────────────────────────────────────────────────────
const MapView = ({ opportunities, lang, onView }) => {
  const isAr = lang === "ar";
  const [selected, setSelected] = useState(null);

  // SVG map of Saudi Arabia (simplified)
  const cities = opportunities.map(o => ({
    ...o,
    // Normalize lat/lng to SVG coords (rough projection)
    x: ((o.lng - 36) / (56 - 36)) * 500 + 30,
    y: ((28 - o.lat) / (28 - 16)) * 320 + 40,
  }));

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", minHeight: 420 }}>
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-white font-bold text-sm">{isAr ? "خريطة الفرص الاستثمارية" : "Investment Opportunities Map"}</h3>
        <p className="text-gray-400 text-xs mt-0.5">{isAr ? "انقر على النقاط لعرض التفاصيل" : "Click markers for details"}</p>
      </div>
      <svg viewBox="0 0 560 400" className="w-full" style={{ minHeight: 380 }}>
        <defs>
          <radialGradient id="mapBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0a0a14" />
          </radialGradient>
        </defs>
        <rect width="560" height="400" fill="url(#mapBg)"/>
        {/* Grid lines */}
        {[1,2,3,4,5].map(i => <line key={i} x1={i*100} y1="0" x2={i*100} y2="400" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>)}
        {[1,2,3].map(i => <line key={i} x1="0" y1={i*100} x2="560" y2={i*100} stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>)}
        {/* Saudi Arabia outline (simplified) */}
        <path d="M 80 60 L 140 50 L 200 60 L 280 55 L 340 70 L 400 100 L 460 130 L 490 180 L 480 240 L 450 290 L 400 320 L 360 340 L 300 350 L 240 340 L 200 310 L 170 270 L 150 220 L 120 200 L 90 170 L 70 130 Z"
          fill="rgba(212,175,55,0.04)" stroke="rgba(212,175,55,0.2)" strokeWidth="1.5"/>
        {/* City markers */}
        {cities.map(city => (
          <g key={city.id} onClick={() => setSelected(selected?.id === city.id ? null : city)} style={{ cursor: "pointer" }}>
            <circle cx={city.x} cy={city.y} r={selected?.id === city.id ? 20 : 14} fill="rgba(212,175,55,0.1)" style={{ transition: "r 0.2s" }}>
              <animate attributeName="r" values={`${selected?.id === city.id ? 20 : 14};${selected?.id === city.id ? 26 : 18};${selected?.id === city.id ? 20 : 14}`} dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx={city.x} cy={city.y} r={selected?.id === city.id ? 10 : 7} fill={selected?.id === city.id ? "#d4af37" : "rgba(212,175,55,0.7)"} style={{ transition: "all 0.2s" }}/>
            <text x={city.x} y={city.y + 22} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="600">
              {isAr ? city.city : city.cityEn}
            </text>
          </g>
        ))}
      </svg>
      {selected && (
        <div className="absolute bottom-4 left-4 right-4 rounded-xl p-4" style={{ background: "rgba(10,10,20,0.95)", border: "1px solid rgba(212,175,55,0.3)", backdropFilter: "blur(10px)" }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h4 className="text-white font-bold text-sm">{isAr ? selected.title : selected.titleEn}</h4>
              <p className="text-gray-400 text-xs mt-0.5">{isAr ? selected.sector : selected.sectorEn} · {isAr ? selected.city : selected.cityEn}</p>
              <div className="flex gap-4 mt-2">
                <span className="text-xs" style={{ color: "#d4af37" }}>{isAr ? "العائد: " : "ROI: "}<strong>{selected.roi}%</strong></span>
                <span className="text-xs text-gray-300">{isAr ? "التكلفة: " : "Cost: "}<strong>{(selected.cost/1000000).toFixed(0)}M SAR</strong></span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onView(selected)} className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: "#d4af37", color: "#0a0a14" }}>
                {isAr ? "التفاصيل" : "Details"}
              </button>
              <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
                <Icon name="x" size={12} className="text-white"/>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
const DetailModal = ({ opp, lang, onClose, saved, onSave }) => {
  const isAr = lang === "ar";
  const [aiSummary, setAiSummary] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [tab, setTab] = useState("overview");

  const generateAISummary = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          messages: [{
            role: "user",
            content: `Generate a concise investment feasibility summary in ${isAr ? "Arabic" : "English"} for this opportunity:
Title: ${isAr ? opp.title : opp.titleEn}
Sector: ${isAr ? opp.sector : opp.sectorEn}
City: ${isAr ? opp.city : opp.cityEn}
Investment Cost: ${opp.cost.toLocaleString()} SAR
Expected ROI: ${opp.roi}%
Risk Level: ${isAr ? opp.risk : opp.riskEn}
Description: ${isAr ? opp.description : opp.descriptionEn}

Write 3-4 sentences covering key strengths, risks, and recommendation. Be professional and concise.`
          }]
        })
      });
      const data = await res.json();
      setAiSummary(data.content?.[0]?.text || (isAr ? "تعذّر توليد الملخص." : "Could not generate summary."));
    } catch {
      setAiSummary(isAr ? "خطأ في الاتصال بالذكاء الاصطناعي." : "AI connection error.");
    }
    setLoadingAI(false);
  };

  const tabs = [
    { id: "overview", label: isAr ? "نظرة عامة" : "Overview" },
    { id: "financials", label: isAr ? "المالية" : "Financials" },
    { id: "ai", label: isAr ? "تحليل AI" : "AI Analysis" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl" style={{ background: "#0d0d1a", border: "1px solid rgba(212,175,55,0.2)" }} onClick={e => e.stopPropagation()}>
        <div className="relative h-56 overflow-hidden rounded-t-2xl">
          <img src={opp.image} alt="" className="w-full h-full object-cover" style={{ filter: "brightness(0.6)" }}/>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0d0d1a 0%, transparent 50%)" }}/>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
            <Icon name="x" size={16} className="text-white"/>
          </button>
          <button onClick={() => onSave(opp.id)} className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: saved ? "rgba(212,175,55,0.9)" : "rgba(0,0,0,0.6)" }}>
            <Icon name="heart" size={16} className={saved ? "text-black" : "text-white"}/>
          </button>
          <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
            <div>
              <h2 className="text-white font-bold text-xl">{isAr ? opp.title : opp.titleEn}</h2>
              <p className="text-gray-300 text-sm flex items-center gap-1"><Icon name="pin" size={12}/>{isAr ? opp.city : opp.cityEn} · {isAr ? opp.sector : opp.sectorEn}</p>
            </div>
            <ScoreRing score={opp.score} size={60}/>
          </div>
        </div>

        <div className="p-6">
          <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className="flex-1 py-2 text-sm font-medium rounded-lg transition-all"
                style={{ background: tab === t.id ? "rgba(212,175,55,0.2)" : "transparent", color: tab === t.id ? "#d4af37" : "rgba(255,255,255,0.5)" }}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{isAr ? opp.description : opp.descriptionEn}</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: isAr ? "حجم الاستثمار" : "Investment", value: `${(opp.cost/1000000).toFixed(0)}M SAR`, icon: "briefcase" },
                  { label: isAr ? "العائد المتوقع" : "Expected ROI", value: `${opp.roi}%`, icon: "trending", color: "#10b981" },
                  { label: isAr ? "درجة المخاطرة" : "Risk Level", value: isAr ? opp.risk : opp.riskEn, icon: "shield" },
                ].map((stat, i) => (
                  <div key={i} className="p-3 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
                    <p className="font-bold text-sm" style={{ color: stat.color || "#fff" }}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "financials" && (
            <div className="space-y-3">
              {[
                { label: isAr ? "إجمالي التكلفة" : "Total Cost", value: `${opp.cost.toLocaleString()} SAR` },
                { label: isAr ? "العائد السنوي المتوقع" : "Expected Annual ROI", value: `${opp.roi}%`, highlight: true },
                { label: isAr ? "فترة الاسترداد" : "Payback Period", value: isAr ? `${Math.round(100/opp.roi)} سنوات` : `${Math.round(100/opp.roi)} years` },
                { label: isAr ? "مستوى المخاطرة" : "Risk Level", value: isAr ? opp.risk : opp.riskEn },
                { label: isAr ? "نقاط الاستثمار الذكي" : "Smart Score", value: `${opp.score}/100`, highlight: true },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-2.5 px-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <span className="text-gray-400 text-sm">{row.label}</span>
                  <span className="font-bold text-sm" style={{ color: row.highlight ? "#d4af37" : "#fff" }}>{row.value}</span>
                </div>
              ))}
            </div>
          )}

          {tab === "ai" && (
            <div>
              <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.2)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="ai" size={16} className="text-yellow-400"/>
                  <span className="text-yellow-400 text-sm font-bold">{isAr ? "تحليل الذكاء الاصطناعي" : "AI Feasibility Analysis"}</span>
                </div>
                {aiSummary ? (
                  <p className="text-gray-300 text-sm leading-relaxed">{aiSummary}</p>
                ) : (
                  <p className="text-gray-500 text-sm">{isAr ? "اضغط لتوليد تحليل ذكي لهذه الفرصة الاستثمارية." : "Click to generate an AI-powered analysis of this opportunity."}</p>
                )}
              </div>
              <button onClick={generateAISummary} disabled={loadingAI} className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={{ background: loadingAI ? "rgba(212,175,55,0.3)" : "linear-gradient(135deg, #d4af37, #b8962e)", color: "#0a0a14" }}>
                {loadingAI ? (
                  <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"/>{isAr ? "جارٍ التحليل..." : "Analyzing..."}</>
                ) : (
                  <><Icon name="ai" size={16}/>{isAr ? "توليد التحليل الذكي" : "Generate AI Analysis"}</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── MESSAGING ────────────────────────────────────────────────────────────────
const MessagingPanel = ({ lang }) => {
  const isAr = lang === "ar";
  const [messages, setMessages] = useState([
    { id: 1, from: "consultant", text: isAr ? "مرحباً، أنا هنا للإجابة على استفساراتك حول فرص الاستثمار." : "Hello! I'm here to answer your questions about investment opportunities.", time: "10:30" },
    { id: 2, from: "investor", text: isAr ? "شكراً، أريد معرفة المزيد عن منتجع جدة الساحلي." : "Thanks! I'd like to know more about the Jeddah coastal resort.", time: "10:32" },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { id: Date.now(), from: "investor", text: input, time: new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }) }]);
    setInput("");
    setTimeout(() => {
      setMessages(m => [...m, { id: Date.now(), from: "consultant", text: isAr ? "سيسعدني مساعدتك، هذا المشروع يوفر عائداً ممتازاً بمخاطر منخفضة." : "Happy to help! This project offers excellent returns with low risk.", time: new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }) }]);
    }, 1200);
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", height: 400, display: "flex", flexDirection: "column" }}>
      <div className="p-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "rgba(212,175,55,0.2)", color: "#d4af37" }}>SZ</div>
        <div><p className="text-white text-sm font-bold">{isAr ? "أ. سارة الزهراني" : "Sara Al-Zahrani"}</p><p className="text-emerald-400 text-xs">{isAr ? "متاح الآن" : "Online"}</p></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === "investor" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-xs px-3 py-2 rounded-2xl" style={{ background: msg.from === "investor" ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.07)", borderRadius: msg.from === "investor" ? "18px 18px 4px 18px" : "18px 18px 18px 4px" }}>
              <p className="text-white text-sm">{msg.text}</p>
              <p className="text-gray-500 text-xs mt-1 text-right">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 flex gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={isAr ? "اكتب رسالة..." : "Type a message..."} className="flex-1 px-3 py-2 rounded-xl text-sm text-white outline-none" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}/>
        <button onClick={send} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(212,175,55,0.8)", color: "#0a0a14" }}>
          <Icon name="send" size={15}/>
        </button>
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ lang, role, savedIds, opportunities }) => {
  const isAr = lang === "ar";
  const saved = opportunities.filter(o => savedIds.includes(o.id));
  const stats = [
    { label: isAr ? "فرص محفوظة" : "Saved", value: savedIds.length, icon: "heart", color: "#ec4899" },
    { label: isAr ? "مشاهدات" : "Views", value: 47, icon: "eye", color: "#63b3ed" },
    { label: isAr ? "رسائل" : "Messages", value: 3, icon: "message", color: "#d4af37" },
    { label: isAr ? "متوسط العائد" : "Avg ROI", value: "22%", icon: "trending", color: "#10b981" },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: `${s.color}22` }}>
              <Icon name={s.icon} size={16} style={{ color: s.color }}/>
            </div>
            <p className="text-white font-bold text-xl">{s.value}</p>
            <p className="text-gray-400 text-xs">{s.label}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-white font-bold mb-3">{isAr ? "الفرص المحفوظة" : "Saved Opportunities"}</h3>
        {saved.length === 0 ? (
          <div className="text-center py-10 text-gray-500"><Icon name="heart" size={32} className="mx-auto mb-2 opacity-30"/><p>{isAr ? "لا توجد فرص محفوظة بعد" : "No saved opportunities yet"}</p></div>
        ) : (
          <div className="grid gap-3">
            {saved.map(o => (
              <div key={o.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <img src={o.image} className="w-14 h-14 rounded-lg object-cover" alt=""/>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{isAr ? o.title : o.titleEn}</p>
                  <p className="text-gray-400 text-xs">{isAr ? o.city : o.cityEn} · {o.roi}% ROI</p>
                </div>
                <span className="text-sm font-bold" style={{ color: "#d4af37" }}>{o.score}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── CONSULTANTS PAGE ─────────────────────────────────────────────────────────
const ConsultantsPage = ({ lang }) => {
  const isAr = lang === "ar";
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-xl">{isAr ? "المستشارون الماليون" : "Financial Consultants"}</h2>
        <span className="text-gray-400 text-sm">{CONSULTANTS.length} {isAr ? "مستشار" : "consultants"}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {CONSULTANTS.map(c => (
          <div key={c.id} className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ background: "rgba(212,175,55,0.15)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.3)" }}>
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold">{isAr ? c.name : c.nameEn}</p>
                  {c.verified && <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#10b981" }}><Icon name="check" size={10} className="text-white"/></span>}
                </div>
                <p className="text-gray-400 text-sm">{isAr ? c.specialty : c.specialtyEn}</p>
                <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5"><Icon name="pin" size={10}/>{isAr ? c.city : c.cityEn}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-1">
                <Icon name="star" size={13} className="text-yellow-400"/>
                <span className="text-white text-sm font-bold">{c.rating}</span>
              </div>
              <span className="text-gray-400 text-xs">{c.studies} {isAr ? "دراسة جدوى" : "studies"}</span>
              <button className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: "rgba(212,175,55,0.2)", color: "#d4af37" }}>
                {isAr ? "تواصل" : "Contact"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("ar");
  const [page, setPage] = useState("home");
  const [view, setView] = useState("grid");
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [savedIds, setSavedIds] = useState([2, 5]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ sector: "", risk: "", region: "" });
  const [mobileMenu, setMobileMenu] = useState(false);
  const isAr = lang === "ar";

  const filtered = OPPORTUNITIES.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q || (isAr ? o.title : o.titleEn).toLowerCase().includes(q) || (isAr ? o.city : o.cityEn).toLowerCase().includes(q) || (isAr ? o.sector : o.sectorEn).toLowerCase().includes(q);
    const matchSector = !filters.sector || (isAr ? o.sector : o.sectorEn) === filters.sector;
    const matchRisk = !filters.risk || (isAr ? o.risk : o.riskEn) === filters.risk;
    const matchRegion = !filters.region || (isAr ? o.region : o.regionEn) === filters.region;
    return matchSearch && matchSector && matchRisk && matchRegion;
  });

  const toggleSave = (id) => setSavedIds(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const navLinks = [
    { id: "home", label: isAr ? "الرئيسية" : "Home", icon: "home" },
    { id: "opportunities", label: isAr ? "الفرص" : "Opportunities", icon: "briefcase" },
    { id: "map", label: isAr ? "الخريطة" : "Map", icon: "map" },
    { id: "consultants", label: isAr ? "المستشارون" : "Consultants", icon: "users" },
    { id: "dashboard", label: isAr ? "لوحتي" : "Dashboard", icon: "chart" },
    { id: "messages", label: isAr ? "الرسائل" : "Messages", icon: "message" },
  ];

  return (
    <div dir={isAr ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: "#0a0a14", fontFamily: isAr ? "'Tajawal', 'Cairo', sans-serif" : "'DM Sans', sans-serif", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 10px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .gold-gradient { background: linear-gradient(135deg, #d4af37 0%, #f0d060 50%, #b8962e 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(10,10,20,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #d4af37, #b8962e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="trending" size={18} className="text-black"/>
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 14, color: "#d4af37", lineHeight: 1.1 }}>{isAr ? "المستثمر الذكي" : "Smart Investor"}</p>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>{isAr ? "رؤية 2030" : "VISION 2030"}</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.04)", padding: 4, borderRadius: 12, flexWrap: "wrap" }} className="hidden-mobile">
            {navLinks.map(link => (
              <button key={link.id} onClick={() => setPage(link.id)} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, background: page === link.id ? "rgba(212,175,55,0.2)" : "transparent", color: page === link.id ? "#d4af37" : "rgba(255,255,255,0.5)", cursor: "pointer", border: "none", transition: "all 0.2s", whiteSpace: "nowrap" }}>
                {link.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <button onClick={() => setLang(l => l === "ar" ? "en" : "ar")} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "rgba(212,175,55,0.1)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.2)", cursor: "pointer" }}>
              {isAr ? "EN" : "عربي"}
            </button>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: "pointer" }}>
              <Icon name="bell" size={15} className="text-gray-400"/>
              <span style={{ position: "absolute", top: 5, right: 5, width: 6, height: 6, borderRadius: "50%", background: "#d4af37" }}/>
            </div>
            <button onClick={() => setMobileMenu(m => !m)} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none" }}>
              <Icon name="menu" size={16} className="text-gray-400"/>
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div style={{ padding: "8px 20px 12px", background: "rgba(10,10,20,0.95)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {navLinks.map(link => (
                <button key={link.id} onClick={() => { setPage(link.id); setMobileMenu(false); }} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 13, background: page === link.id ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.06)", color: page === link.id ? "#d4af37" : "rgba(255,255,255,0.7)", border: "none", cursor: "pointer" }}>
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* PAGE CONTENT */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 20px 60px" }}>

        {/* HOME */}
        {page === "home" && (
          <div className="fade-up">
            {/* Hero */}
            <div style={{ textAlign: "center", padding: "48px 0 40px", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                <div style={{ position: "absolute", top: "20%", left: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)", filter: "blur(40px)" }}/>
                <div style={{ position: "absolute", top: "10%", right: "15%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,179,237,0.04) 0%, transparent 70%)", filter: "blur(30px)" }}/>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#d4af37" }}/>
                <span style={{ fontSize: 12, color: "#d4af37", fontWeight: 600 }}>{isAr ? "مدعوم برؤية 2030" : "Powered by Vision 2030"}</span>
              </div>
              <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}>
                <span className="gold-gradient">{isAr ? "استثمر بذكاء" : "Invest Smarter"}</span><br/>
                <span style={{ color: "rgba(255,255,255,0.85)" }}>{isAr ? "في مستقبل المملكة" : "in Saudi Arabia's Future"}</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "clamp(0.9rem, 2vw, 1.1rem)", maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.7 }}>
                {isAr ? "اكتشف أفضل الفرص الاستثمارية عبر مناطق المملكة مع تحليل ذكي وتقييمات احترافية" : "Discover top investment opportunities across Saudi Arabia with AI-powered analysis and expert ratings"}
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => setPage("opportunities")} style={{ padding: "14px 28px", borderRadius: 12, fontWeight: 700, fontSize: 15, background: "linear-gradient(135deg, #d4af37, #b8962e)", color: "#0a0a14", cursor: "pointer", border: "none" }}>
                  {isAr ? "استكشف الفرص" : "Explore Opportunities"}
                </button>
                <button onClick={() => setPage("map")} style={{ padding: "14px 28px", borderRadius: 12, fontWeight: 600, fontSize: 15, background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.8)", cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {isAr ? "عرض الخريطة" : "View Map"}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 40 }}>
              {[
                { v: "٢٠٠+", vEn: "200+", l: "فرصة استثمارية", lEn: "Opportunities" },
                { v: "١٣", vEn: "13", l: "منطقة مغطاة", lEn: "Regions" },
                { v: "٥٠+", vEn: "50+", l: "مستشار معتمد", lEn: "Consultants" },
                { v: "٩٢٪", vEn: "92%", l: "رضا المستثمرين", lEn: "Satisfaction" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: "20px 16px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#d4af37" }}>{isAr ? s.v : s.vEn}</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 4 }}>{isAr ? s.l : s.lEn}</p>
                </div>
              ))}
            </div>

            {/* Featured */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontWeight: 800, fontSize: 20 }}>{isAr ? "الفرص المميزة" : "Featured Opportunities"}</h2>
                <button onClick={() => setPage("opportunities")} style={{ fontSize: 13, color: "#d4af37", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  {isAr ? "عرض الكل" : "View all"}<Icon name="chevronRight" size={14}/>
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {OPPORTUNITIES.slice(0, 3).map(o => (
                  <OpportunityCard key={o.id} opp={o} lang={lang} onView={setSelectedOpp} saved={savedIds.includes(o.id)} onSave={toggleSave}/>
                ))}
              </div>
            </div>

            {/* Sectors */}
            <div style={{ marginTop: 40 }}>
              <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>{isAr ? "القطاعات الرائدة" : "Leading Sectors"}</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {SECTORS.map((s, i) => (
                  <button key={i} onClick={() => { setFilters(f => ({ ...f, sector: s })); setPage("opportunities"); }} style={{ padding: "10px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(212,175,55,0.1)"; e.currentTarget.style.color = "#d4af37"; e.currentTarget.style.border = "1px solid rgba(212,175,55,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"; }}>
                    {isAr ? s : SECTORS_EN[i]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* OPPORTUNITIES */}
        {page === "opportunities" && (
          <div className="fade-up">
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontWeight: 800, fontSize: 24, marginBottom: 4 }}>{isAr ? "الفرص الاستثمارية" : "Investment Opportunities"}</h1>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>{filtered.length} {isAr ? "فرصة متاحة" : "opportunities available"}</p>
            </div>

            {/* Search & Filters */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
              <div style={{ flex: "1 1 220px", position: "relative" }}>
                <span style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [isAr ? "right" : "left"]: 12, color: "rgba(255,255,255,0.3)" }}><Icon name="search" size={16}/></span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={isAr ? "ابحث عن فرصة..." : "Search opportunities..."} style={{ width: "100%", padding: isAr ? "10px 40px 10px 16px" : "10px 16px 10px 40px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 14, outline: "none" }}/>
              </div>
              <select value={filters.sector} onChange={e => setFilters(f => ({ ...f, sector: e.target.value }))} style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: filters.sector ? "#d4af37" : "rgba(255,255,255,0.4)", fontSize: 14, outline: "none", cursor: "pointer" }}>
                <option value="">{isAr ? "كل القطاعات" : "All Sectors"}</option>
                {SECTORS.map((s, i) => <option key={s} value={isAr ? s : SECTORS_EN[i]} style={{ background: "#1a1a2e" }}>{isAr ? s : SECTORS_EN[i]}</option>)}
              </select>
              <select value={filters.risk} onChange={e => setFilters(f => ({ ...f, risk: e.target.value }))} style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: filters.risk ? "#d4af37" : "rgba(255,255,255,0.4)", fontSize: 14, outline: "none", cursor: "pointer" }}>
                <option value="">{isAr ? "مستوى المخاطرة" : "Risk Level"}</option>
                {isAr ? ["منخفض", "متوسط", "مرتفع"].map(r => <option key={r} value={r} style={{ background: "#1a1a2e" }}>{r}</option>) : ["Low", "Medium", "High"].map(r => <option key={r} value={r} style={{ background: "#1a1a2e" }}>{r}</option>)}
              </select>
              <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", padding: 4, borderRadius: 10 }}>
                <button onClick={() => setView("grid")} style={{ width: 34, height: 34, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", background: view === "grid" ? "rgba(212,175,55,0.2)" : "transparent", cursor: "pointer", border: "none" }}><Icon name="grid" size={15} className={view === "grid" ? "text-yellow-400" : "text-gray-500"}/></button>
                <button onClick={() => setView("list")} style={{ width: 34, height: 34, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", background: view === "list" ? "rgba(212,175,55,0.2)" : "transparent", cursor: "pointer", border: "none" }}><Icon name="list" size={15} className={view === "list" ? "text-yellow-400" : "text-gray-500"}/></button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.3)" }}>
                <Icon name="search" size={40} className="mx-auto mb-3 opacity-30"/>
                <p style={{ fontSize: 16 }}>{isAr ? "لا توجد نتائج مطابقة" : "No matching results"}</p>
              </div>
            ) : view === "grid" ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {filtered.map(o => <OpportunityCard key={o.id} opp={o} lang={lang} onView={setSelectedOpp} saved={savedIds.includes(o.id)} onSave={toggleSave}/>)}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filtered.map(o => (
                  <div key={o.id} style={{ display: "flex", gap: 14, padding: "14px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer" }} onClick={() => setSelectedOpp(o)}>
                    <img src={o.image} style={{ width: 80, height: 80, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} alt=""/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <p style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>{isAr ? o.title : o.titleEn}</p>
                        {o.tag && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, background: "rgba(212,175,55,0.2)", color: "#d4af37" }}>{o.tag}</span>}
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{isAr ? o.city : o.cityEn} · {isAr ? o.sector : o.sectorEn}</p>
                      <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
                        <span style={{ fontSize: 13, color: "#10b981" }}>{isAr ? "العائد: " : "ROI: "}{o.roi}%</span>
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{(o.cost/1000000).toFixed(0)}M SAR</span>
                        <span style={{ fontSize: 13, color: "#d4af37", fontWeight: 700 }}>{isAr ? "نقاط: " : "Score: "}{o.score}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MAP */}
        {page === "map" && (
          <div className="fade-up">
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontWeight: 800, fontSize: 24 }}>{isAr ? "خريطة الاستثمارات" : "Investment Map"}</h1>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 4 }}>{isAr ? "تصفح فرص الاستثمار على خريطة المملكة" : "Browse investment opportunities across Saudi Arabia"}</p>
            </div>
            <MapView opportunities={filtered} lang={lang} onView={setSelectedOpp}/>
          </div>
        )}

        {/* CONSULTANTS */}
        {page === "consultants" && <div className="fade-up"><ConsultantsPage lang={lang}/></div>}

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <div className="fade-up">
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontWeight: 800, fontSize: 24 }}>{isAr ? "لوحة التحكم" : "Dashboard"}</h1>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 4 }}>{isAr ? "مرحباً، المستثمر" : "Welcome, Investor"}</p>
            </div>
            <Dashboard lang={lang} role="INVESTOR" savedIds={savedIds} opportunities={OPPORTUNITIES}/>
          </div>
        )}

        {/* MESSAGES */}
        {page === "messages" && (
          <div className="fade-up">
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontWeight: 800, fontSize: 24 }}>{isAr ? "الرسائل" : "Messages"}</h1>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 4 }}>{isAr ? "تواصل مع المستشارين الماليين" : "Connect with financial consultants"}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16 }}>
              <MessagingPanel lang={lang}/>
            </div>
          </div>
        )}
      </main>

      {/* DETAIL MODAL */}
      {selectedOpp && <DetailModal opp={selectedOpp} lang={lang} onClose={() => setSelectedOpp(null)} saved={savedIds.includes(selectedOpp.id)} onSave={toggleSave}/>}

      {/* BOTTOM NAV (mobile) */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(10,10,20,0.97)", borderTop: "1px solid rgba(212,175,55,0.1)", display: "flex", justifyContent: "space-around", padding: "8px 0 12px", zIndex: 30, backdropFilter: "blur(20px)" }}>
        {navLinks.slice(0, 5).map(link => (
          <button key={link.id} onClick={() => setPage(link.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 8, minWidth: 0 }}>
            <Icon name={link.icon} size={20} style={{ color: page === link.id ? "#d4af37" : "rgba(255,255,255,0.3)" }}/>
            <span style={{ fontSize: 9, color: page === link.id ? "#d4af37" : "rgba(255,255,255,0.3)", fontWeight: page === link.id ? 700 : 400 }}>{link.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
