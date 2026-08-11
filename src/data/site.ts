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

export type NavItem = { th: string; en: string; href: string };

export const nav: NavItem[] = [
  { th: 'หน้าแรก', en: 'Home', href: '/' },
  { th: 'เกี่ยวกับเรา', en: 'About Us', href: '/about' },
  { th: 'สินค้า', en: 'Products', href: '/products' },
  { th: 'ออกแบบ 3D', en: '3D Configurator', href: '/configurator' },
  { th: 'สเปกสินค้า', en: 'Specifications', href: '/specifications' },
  { th: 'สี / วัสดุ', en: 'Colors & Materials', href: '/colors' },
  { th: 'บริการ', en: 'Services', href: '/services' },
  { th: 'ทีมช่างเทคนิค', en: 'Technical Team', href: '/technical-team' },
  { th: 'ที่ตั้ง', en: 'Location', href: '/branches' },
  { th: 'รีวิวลูกค้า', en: 'Testimonials', href: '/testimonials' },
  { th: 'บทความ', en: 'Blog', href: '/blog' },
  { th: 'โบรชัวร์', en: 'Brochure', href: '/brochure' },
  { th: 'ติดต่อเรา', en: 'Contact', href: '/contact' },
];
