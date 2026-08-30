/**
 * Design reminder — Thai Industrial Supplier:
 * Deep navy, steel gray, warm white, and construction gold. Use compact
 * architectural proportions, readable Thai typography, and practical CTAs.
 */
import { useState } from "react";
import { ArrowRight, Building2, Check, ChevronDown, Clock3, Factory, Facebook, Fence, Hammer, Home as HomeIcon, Menu, MessageCircle, Phone, Ruler, ShieldCheck, Thermometer, X } from "lucide-react";
import { toast } from "sonner";

const categories = [
  { id: "roofing", label: "หลังคาเมทัลชีท", icon: HomeIcon, note: "ลอน 760 / Snap Lock 304" },
  { id: "wall-ceiling", label: "ผนังและฝ้า", icon: Building2, note: "ลอนระแนง 310 / ลายไม้" },
  { id: "fence", label: "รั้วเมทัลชีท", icon: Fence, note: "ลอนรั้ว 110" },
  { id: "wpc", label: "ไม้สังเคราะห์ WPC", icon: Hammer, note: "พื้น / ผนัง / ระแนง" },
  { id: "insulation", label: "ฉนวนกันความร้อน", icon: Thermometer, note: "PU / PE / EPS / ISOWALL" },
  { id: "steel", label: "โครงเหล็กน็อคดาวน์", icon: Ruler, note: "ตัดตามแบบหน้างาน" },
];

const advantages = [
  ["01", "สั่งตัดตามขนาด", "ผลิตและตัดความยาวตามแบบ ลดรอยต่อและเศษวัสดุหน้างาน"],
  ["02", "มีหลายสี หลายลอน", "เลือกวัสดุและเฉดสีให้เข้ากับบ้าน ร้านค้า โรงงาน และโกดัง"],
  ["03", "ให้คำปรึกษาก่อนสั่งซื้อ", "ส่งขนาดพื้นที่หรือแบบก่อสร้างมาให้ทีมงานช่วยประเมินได้"],
  ["04", "ครบตั้งแต่แผ่นถึงอุปกรณ์", "วางแผนงานหลังคา ผนัง รั้ว ฉนวน และโครงสร้างได้ในที่เดียว"],
];

const flow = [
  ["01", "ส่งแบบหรือขนาดพื้นที่", "ส่งขนาดหลังคา รูปหน้างาน หรือแบบก่อสร้างให้ทีมงานดูได้ทาง LINE"],
  ["02", "รับคำแนะนำและประเมินราคา", "ทีมงานช่วยเลือกสเปก สี ลอน ความยาว และคำนวณจำนวนวัสดุให้เหมาะกับงาน"],
  ["03", "ยืนยันสเปกและสั่งผลิต", "เมื่อยืนยันรายการแล้ว เราเตรียมวัสดุตามขนาด พร้อมอุปกรณ์ประกอบให้ครบชุด"],
];

function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }
function ContactButton({ kind, children }: { kind: "line" | "phone" | "facebook"; children: React.ReactNode }) {
  return <button className={`contact-button ${kind}`} onClick={() => toast("ช่องทางติดต่อ", { description: "เชื่อมต่อ LINE, Messenger หรือหมายเลขโทรศัพท์จริงของบริษัทได้ที่นี่" })}>{children}</button>;
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const quote = () => toast("ส่งคำขอประเมินราคา", { description: "เชื่อมต่อฟอร์มนี้กับ LINE หรือระบบรับใบเสนอราคาของบริษัทได้" });
  return (
    <div className="supplier-site">
      <div className="contact-bar"><div className="wide-container contact-bar-inner"><span>สอบถามสินค้า / ประเมินราคา <b>โทร 0XX-XXX-XXXX</b></span><div className="contact-links"><span><Clock3 size={13} /> จันทร์–เสาร์ 08:00–17:00</span><span>LINE</span><span>Facebook</span></div></div></div>
      <header className="site-nav"><div className="wide-container nav-inner"><a href="#home" className="supplier-logo" aria-label="กลับหน้าแรก"><span className="logo-block"><i /><i /><i /><i /></span><span><b>เมทัลชีท</b><small>ครบทุกงาน</small></span></a><nav className="desktop-links">{[["หน้าแรก", "home"], ["สินค้า", "products"], ["ทำไมต้องเรา", "why"], ["ขั้นตอนสั่งซื้อ", "how"], ["ติดต่อเรา", "contact"]].map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}</nav><button className="nav-quote" onClick={quote}>ขอใบเสนอราคา <ArrowRight size={16} /></button><button className="mobile-menu-button" onClick={() => setMenu((v) => !v)} aria-label="เปิดเมนู">{menu ? <X size={21} /> : <Menu size={21} />}</button></div>{menu && <div className="mobile-drawer">{[["หน้าแรก", "home"], ["สินค้า", "products"], ["ทำไมต้องเรา", "why"], ["ขั้นตอนสั่งซื้อ", "how"], ["ติดต่อเรา", "contact"]].map(([label, id]) => <button key={id} onClick={() => { scrollTo(id); setMenu(false); }}>{label}<ArrowRight size={15} /></button>)}<button className="mobile-quote" onClick={quote}>ขอใบเสนอราคา <ArrowRight size={16} /></button></div>}</header>

      <main>
        <section id="home" className="hero-section anchor"><div className="wide-container hero-grid"><div className="hero-copy"><div className="eyebrow"><span /> ผู้จำหน่ายและผลิตเมทัลชีทตามขนาด</div><h1>เมทัลชีทครบทุกงาน<br /><em>หลังคา • ผนัง • รั้ว • ฉนวน • โครงสร้าง</em></h1><p>จำหน่ายและผลิตเมทัลชีทตามขนาด พร้อมอุปกรณ์และวัสดุก่อสร้างครบชุด เลือกสี เลือกลอน และสั่งตัดความยาวได้ตามหน้างาน</p><div className="hero-actions"><button className="gold-button" onClick={quote}>ประเมินราคาฟรี <ArrowRight size={18} /></button><button className="outline-button" onClick={() => scrollTo("products")}>ดูสินค้าทั้งหมด <ChevronDown size={17} /></button></div><div className="hero-helper"><Check size={15} /> ส่งขนาดพื้นที่หรือแบบก่อสร้างมาให้ทีมงานช่วยประเมินได้</div></div><div className="hero-image-wrap"><img src="/manus-storage/supplier-roof_1e71ae65.jpg" alt="บ้านสมัยใหม่ที่ใช้หลังคาเมทัลชีท" /><div className="hero-image-card"><span>งานบ้าน / ร้านค้า / โรงงาน</span><b>ตัดความยาวตามหน้างาน</b><ArrowRight size={18} /></div><div className="image-index">01 / PROJECT MATERIAL</div></div></div><div className="wide-container trust-row"><span>วัสดุสำหรับทุกโครงการ</span><span>บ้านพักอาศัย</span><span>ร้านค้าและคาเฟ่</span><span>โรงงานและโกดัง</span></div></section>

        <section id="products" className="products-section anchor"><div className="wide-container"><div className="section-heading"><div><p className="section-kicker">01 / WHAT WE SUPPLY</p><h2>วัสดุครบ จบในที่เดียว</h2></div><p>เลือกสินค้าให้ตรงกับงานของคุณ พร้อมคำแนะนำเรื่องสเปก สี ลอน และจำนวนวัสดุก่อนสั่งซื้อ</p></div><div className="category-grid">{categories.map(({ id, label, icon: Icon, note }, index) => <button key={id} className={`category-card card-${index + 1}`} onClick={() => scrollTo(id)}><span className="category-number">0{index + 1}</span><Icon size={26} strokeWidth={1.7} /><strong>{label}</strong><small>{note}</small><ArrowRight className="category-arrow" size={17} /></button>)}</div></div></section>

        <section id="roofing" className="product-feature anchor"><div className="wide-container feature-grid"><div className="feature-copy"><p className="section-kicker">02 / ROOFING METAL SHEET</p><h2>หลังคาเมทัลชีท<br /><em>สวย เรียบ ลดปัญหารั่วซึม</em></h2><p>เลือกหลังคาให้เหมาะกับบ้าน อาคาร โรงงาน และโกดัง พร้อมบริการสั่งผลิตและตัดความยาวตามขนาดหน้างาน</p><div className="spec-chips"><span>ลอนมาตรฐาน 760</span><span>Snap Lock 304</span><span>Custom Length</span><span>หลายเฉดสี</span></div><button className="dark-button" onClick={quote}>ส่งขนาดหลังคาให้เราประเมิน <ArrowRight size={17} /></button></div><div className="feature-panel"><div className="panel-header"><span>ROOFING / PRODUCT RANGE</span><span>เลือกสเปกตามลักษณะงาน</span></div><div className="roof-lines"><div><b>760</b><span>ลอนมาตรฐาน</span></div><div className="active"><b>304</b><span>Snap Lock</span></div><div><b>∿</b><span>หลังคาโค้ง</span></div></div><div className="panel-note"><Check size={16} /> สั่งตัดความยาว ลดรอยต่อและลดเศษวัสดุ</div></div></div></section>

        <section id="wall-ceiling" className="split-product anchor"><div className="split-image"><img src="/manus-storage/supplier-wall_b1d4a099.jpg" alt="ผนังและฝ้าเมทัลชีทลายไม้ในอาคารสมัยใหม่" /><span>03 / WALL & CEILING</span></div><div className="split-copy"><p className="section-kicker">ผนังและฝ้าเมทัลชีท</p><h2>เปลี่ยนฝ้าและผนังเดิม<br />ให้ดูโมเดิร์นด้วยลายไม้</h2><p>ลอนระแนง 310 และลอนสเปนเดล ให้พื้นผิวดูพรีเมียม น้ำหนักเบา ติดตั้งรวดเร็ว เหมาะสำหรับบ้าน คอนโด คาเฟ่ ร้านค้า และสำนักงาน</p><div className="bullet-list"><span><Check size={15} /> ลายไม้และสีโมเดิร์น</span><span><Check size={15} /> ลดปัญหาปลวกแบบไม้ธรรมชาติ</span><span><Check size={15} /> เหมาะกับงานภายในและภายนอก</span></div><button className="text-button" onClick={quote}>สอบถามสีทาง LINE <ArrowRight size={17} /></button></div></section>

        <section id="why" className="why-section anchor"><div className="wide-container"><div className="section-heading why-heading"><div><p className="section-kicker">04 / WHY CHOOSE US</p><h2>มีสินค้าจริง<br />ให้คำปรึกษาได้จริง</h2></div><p>ตั้งแต่เลือกวัสดุไปจนถึงสั่งผลิต ทีมงานช่วยมองภาพรวมของงานให้คุณตัดสินใจได้ง่ายขึ้น</p></div><div className="advantage-grid">{advantages.map(([number, title, copy]) => <article key={number}><span>{number}</span><div className="advantage-line" /><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

        <section id="fence" className="compact-products anchor"><div className="wide-container compact-grid"><div><p className="section-kicker">05 / MORE MATERIALS</p><h2>ต่อยอดงานให้ครบทุกมุม</h2><p>นอกจากหลังคา เรายังมีวัสดุสำหรับงานผนัง รั้ว ตกแต่ง และฉนวน เพื่อให้คุณวางแผนทั้งโครงการได้จากผู้จำหน่ายรายเดียว</p></div><div className="compact-list"><article><span>รั้ว 110</span><b>เพิ่มความเป็นส่วนตัวด้วยดีไซน์โมเดิร์น</b><small>ประตูรั้ว / รั้วบ้าน / ระแนงบังตา / Facade</small></article><article id="wpc"><span>WPC</span><b>สัมผัสเหมือนไม้จริง ดูแลง่ายกว่า</b><small>พื้นระเบียง / ผนัง / ฝ้า / ระแนง</small></article><article id="steel"><span>STEEL</span><b>โครงเหล็กน็อคดาวน์ตามแบบ</b><small>วัดขนาด วางสเปก และเตรียมชิ้นส่วนให้พร้อมติดตั้ง</small></article></div></div></section>

        <section id="insulation" className="insulation-section anchor"><div className="wide-container insulation-grid"><div className="insulation-copy"><p className="section-kicker">06 / HEAT INSULATION</p><h2>บ้านเย็น โกดังเย็น<br /><em>ลดความร้อนสะสมใต้หลังคา</em></h2><p>เลือกฉนวนให้เหมาะกับโครงสร้างและงบประมาณของงาน พร้อมอธิบายข้อแตกต่างก่อนตัดสินใจ</p><div className="insulation-cards"><span><b>PU</b>25 mm</span><span><b>PE</b>5 mm</span><span><b>EPS</b>1–4 นิ้ว</span><span><b>ISOWALL</b>ผนังสำเร็จรูป</span></div></div><div className="insulation-image"><img src="/manus-storage/supplier-insulation_d71a7b25.jpg" alt="ตัวอย่างวัสดุฉนวนกันความร้อนหลายประเภท" /></div></div></section>

        <section id="how" className="how-section anchor"><div className="wide-container"><div className="section-heading"><div><p className="section-kicker">07 / HOW TO ORDER</p><h2>สั่งซื้อไม่ยุ่งยาก</h2></div><p>ส่งข้อมูลเท่าที่มีมาให้ทีมงานก่อนได้ แม้ยังไม่มีแบบละเอียด เราช่วยไล่รายการให้เป็นขั้นตอนได้</p></div><div className="flow-grid">{flow.map(([number, title, copy]) => <article key={number}><span className="flow-number">{number}</span><h3>{title}</h3><p>{copy}</p><ArrowRight size={19} /></article>)}</div></div></section>

        <section id="contact" className="contact-section anchor"><div className="wide-container contact-grid"><div><p className="section-kicker">08 / LET'S TALK MATERIALS</p><h2>มีแบบอยู่ในมือ<br />หรือแค่มีไอเดีย?</h2><p>ส่งรายละเอียดมาให้เราได้เลย ทีมงานจะช่วยดูวัสดุและประเมินเบื้องต้นให้เหมาะกับงานของคุณ</p><div className="contact-actions"><ContactButton kind="line"><MessageCircle size={18} /> สอบถามทาง LINE</ContactButton><ContactButton kind="phone"><Phone size={17} /> โทรสอบถาม</ContactButton><ContactButton kind="facebook"><Facebook size={17} /> Messenger</ContactButton></div></div><form className="quote-form" onSubmit={(event) => { event.preventDefault(); quote(); }}><div className="form-heading"><span>ขอใบเสนอราคา</span><small>กรอกข้อมูลเบื้องต้น</small></div><label>ชื่อ / บริษัท<input required placeholder="เช่น บริษัท ABC จำกัด" /></label><label>ประเภทงาน<select defaultValue=""><option value="" disabled>เลือกประเภทงาน</option><option>หลังคาเมทัลชีท</option><option>ผนังและฝ้า</option><option>รั้ว / WPC</option><option>ฉนวนกันความร้อน</option><option>โครงเหล็ก</option></select></label><label>รายละเอียดหรือขนาดพื้นที่<textarea rows={3} placeholder="ส่งขนาดโดยประมาณ หรือแนบรายละเอียดใน LINE ภายหลัง" /></label><button className="gold-button" type="submit">ส่งข้อมูลให้ทีมงาน <ArrowRight size={18} /></button></form></div></section>
      </main>
      <footer className="site-footer"><div className="wide-container footer-inner"><div className="supplier-logo"><span className="logo-block"><i /><i /><i /><i /></span><span><b>เมทัลชีท</b><small>ครบทุกงาน</small></span></div><p>จำหน่ายและผลิตเมทัลชีท พร้อมวัสดุก่อสร้างสำหรับบ้าน อาคาร โรงงาน และโกดัง</p><div><span className="footer-label">ติดต่อเรา</span><b>โทร 0XX-XXX-XXXX</b><small>เปิดทำการ จันทร์–เสาร์ 08:00–17:00</small></div></div></footer>
      <div className="floating-contact"><ContactButton kind="line"><MessageCircle size={20} /></ContactButton><ContactButton kind="phone"><Phone size={19} /></ContactButton></div>
    </div>
  );
}
