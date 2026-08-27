export type Phone = {
  /** How the number is shown on screen. */
  display: string;
  /** tel: URI in E.164. */
  href: string;
  labelTh: string;
  labelEn: string;
};

/**
 * Contact details are the real ones supplied by the business.
 * The 042 number is a landline; 08x/09x are mobiles — that is the only
 * distinction the labels claim, because which desk answers which line
 * has not been confirmed.
 */
export const phones: Phone[] = [
  {
    display: '042-990-595',
    href: 'tel:+6642990595',
    labelTh: 'สำนักงาน',
    labelEn: 'Office',
  },
  {
    display: '091-052-9136',
    href: 'tel:+66910529136',
    labelTh: 'มือถือ',
    labelEn: 'Mobile',
  },
  {
    display: '081-872-6147',
    href: 'tel:+66818726147',
    labelTh: 'มือถือ',
    labelEn: 'Mobile',
  },
];

export const site = {
  nameTh: 'หจก.มีชัยสตีล',
  // หจก. is ห้างหุ้นส่วนจำกัด — a limited partnership, not a company limited.
  nameEn: 'Meechai Steel Ltd., Part.',
  taglineTh: 'ผู้ผลิตและจำหน่ายแผ่นหลังคาเหล็กและแผ่นฉนวน มาตรฐานโรงงาน ทีมช่างมืออาชีพ',
  taglineEn: 'Metal roofing & insulated panel manufacturer — factory-standard quality, expert installation.',

  /** Primary number for single-CTA spots (header, sticky bar). */
  phone: phones[0].display,
  phoneHref: phones[0].href,
  phones,

  lineId: '@680rgqnj',
  lineHref: 'https://line.me/R/ti/p/@680rgqnj',
  facebookHref: 'https://www.facebook.com/profile.php?id=61593025679719',
};

export type NavChild = { th: string; en: string; href: string; isNew?: boolean };
export type NavGroup = { th: string; en: string; items: NavChild[] };
export type NavEntry =
  | { kind: 'link'; th: string; en: string; href: string }
  | { kind: 'dropdown'; th: string; en: string; items: NavChild[] }
  | { kind: 'mega'; th: string; en: string; groups: NavGroup[] };

export const nav: NavEntry[] = [
  { kind: 'link', th: 'หน้าแรก', en: 'Home', href: '/' },
  {
    kind: 'dropdown',
    th: 'เกี่ยวกับเรา',
    en: 'About Us',
    items: [
      { th: 'บริษัทของเรา', en: 'Our Company', href: '/about' },
      { th: 'วิสัยทัศน์', en: 'Vision', href: '/about#vision', isNew: true },
      { th: 'จุดเด่น / มาตรฐาน', en: 'Standards', href: '/about#standards' },
      { th: 'ทีมช่างเทคนิค', en: 'Technical Team', href: '/technical-team' },
    ],
  },
  {
    kind: 'mega',
    th: 'สินค้าและบริการ',
    en: 'Products & Services',
    groups: [
      {
        th: 'ระบบหลังคา',
        en: 'Roofing Systems',
        items: [
          { th: 'หลังคาเมทัลชีท', en: 'Metal Roofing', href: '/products#metal-sheet' },
          { th: 'Snap Lock', en: 'Snap Lock', href: '/products#snap-lock' },
        ],
      },
      {
        th: 'ผนังและฉนวน',
        en: 'Walls & Insulation',
        items: [
          { th: 'ผนัง', en: 'Wall Panels', href: '/products#panel-sheet' },
          { th: 'ฉนวน PU', en: 'PU Foam Insulation', href: '/products#pu-foam' },
          { th: 'ฉนวน PE', en: 'PE Insulation', href: '/products#pe-foam', isNew: true },
          { th: 'ฉนวน EPS', en: 'EPS Insulation', href: '/products#eps', isNew: true },
          { th: 'อุปกรณ์ / อะไหล่', en: 'Accessories & Parts', href: '/products#category-accessories', isNew: true },
        ],
      },
      {
        th: 'เครื่องมือช่วยตัดสินใจ',
        en: 'Decision Tools',
        items: [
          { th: 'สเปกสินค้า', en: 'Specifications', href: '/specifications' },
          { th: 'สี / วัสดุ', en: 'Colors & Materials', href: '/colors' },
          { th: 'ออกแบบ 3D', en: '3D Configurator', href: '/configurator' },
          { th: 'บริการ', en: 'Services', href: '/services' },
        ],
      },
    ],
  },
  {
    kind: 'dropdown',
    th: 'ตัวอย่างผลงาน',
    en: 'Our Work',
    items: [
      { th: 'ผลงานทั้งหมด', en: 'All Work', href: '/gallery' },
      { th: 'รีวิวลูกค้า', en: 'Testimonials', href: '/testimonials' },
      { th: 'บทความ', en: 'Blog', href: '/blog' },
    ],
  },
  { kind: 'link', th: 'โปรโมชั่น', en: 'Promotions', href: '/promotions' },
  {
    kind: 'dropdown',
    th: 'ติดต่อเรา',
    en: 'Contact',
    items: [
      { th: 'ที่อยู่', en: 'Address', href: '/branches' },
      { th: 'โทรศัพท์', en: 'Phone', href: '/contact#phone' },
      { th: 'LINE', en: 'LINE', href: '/contact#line' },
      { th: 'Facebook', en: 'Facebook', href: '/contact#facebook' },
      { th: 'Google Maps', en: 'Google Maps', href: '/contact#map', isNew: true },
      { th: 'เวลาเปิด–ปิด', en: 'Business Hours', href: '/contact#hours', isNew: true },
      { th: 'โบรชัวร์', en: 'Brochure', href: '/brochure' },
    ],
  },
];

// Deliberately independent of `nav` — the footer wants plain landing
// pages, not the nested dropdown/mega structure (which has no single
// "first item" that would make a good footer link for every entry).
export const footerLinks: { th: string; en: string; href: string }[] = [
  { th: 'หน้าแรก', en: 'Home', href: '/' },
  { th: 'เกี่ยวกับเรา', en: 'About Us', href: '/about' },
  { th: 'สินค้าและบริการ', en: 'Products & Services', href: '/products' },
  { th: 'ตัวอย่างผลงาน', en: 'Our Work', href: '/gallery' },
  { th: 'โปรโมชั่น', en: 'Promotions', href: '/promotions' },
  { th: 'ติดต่อเรา', en: 'Contact', href: '/contact' },
];
