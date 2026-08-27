export type ProductCategory = 'roofing' | 'wall' | 'insulation' | 'accessories';

export type Product = {
  slug: string;
  category: ProductCategory;
  nameTh: string;
  nameEn: string;
  descTh: string;
  descEn: string;
  useTh: string;
  useEn: string;
  /** True for taxonomy categories that don't have real content yet. */
  comingSoon?: boolean;
};

export const productCategories: Record<ProductCategory, { th: string; en: string }> = {
  roofing: { th: 'หลังคาเมทัลชีท', en: 'Metal Roofing Systems' },
  wall: { th: 'ผนัง', en: 'Wall Panels' },
  insulation: { th: 'ฉนวนกันความร้อน', en: 'Insulation' },
  accessories: { th: 'อุปกรณ์และอะไหล่', en: 'Accessories & Parts' },
};

export const categoryOrder: readonly ProductCategory[] = ['roofing', 'wall', 'insulation', 'accessories'];

export const products: Product[] = [
  {
    slug: 'metal-sheet',
    category: 'roofing',
    nameTh: 'แผ่นเหล็กมุงหลังคา (Metal Sheet)',
    nameEn: 'Metal Roofing Sheet',
    descTh: 'แผ่นเหล็กเคลือบสี ขึ้นรูปลอนตามมาตรฐานโรงงาน แข็งแรง ทนแดดทนฝน',
    descEn: 'Pre-painted galvanized steel sheet, factory roll-formed for strength and weather resistance.',
    useTh: 'บ้านพักอาศัย โรงงาน โกดังสินค้า หลังคาโรงจอดรถ',
    useEn: 'Houses, factories, warehouses, carports.',
  },
  {
    slug: 'bolt-type',
    category: 'roofing',
    nameTh: 'หลังคาระบบยึดสกรู (Bolt Type)',
    nameEn: 'Bolt-Type Roofing System',
    descTh: 'ระบบหลังคายึดด้วยสกรูเจาะยึดโดยตรง ติดตั้งง่าย ราคาประหยัด',
    descEn: 'Through-fastened screw-down system — straightforward installation, cost-effective.',
    useTh: 'งานหลังคาทั่วไป งบประมาณจำกัด',
    useEn: 'General-purpose roofing, budget-conscious projects.',
  },
  {
    slug: 'clip-lock',
    category: 'roofing',
    nameTh: 'ระบบคลิปล็อก (Clip-Lock)',
    nameEn: 'Clip-Lock System',
    descTh: 'ยึดด้วยคลิปซ่อนสกรู ไม่เจาะทะลุแผ่น ลดจุดรั่วซึม เหมาะกับหลังคาลาดเอียงต่ำ',
    descEn: 'Concealed-clip fastening with no sheet penetration — fewer leak points, suited to low-slope roofs.',
    useTh: 'อาคารพาณิชย์ โรงงานที่ต้องการกันรั่วซึมสูง',
    useEn: 'Commercial buildings, plants requiring high leak resistance.',
  },
  {
    slug: 'snap-lock',
    category: 'roofing',
    nameTh: 'ระบบสแนปล็อก (Snap-Lock)',
    nameEn: 'Snap-Lock System',
    descTh: 'แผ่นล็อกตัวเองไม่ต้องใช้คลิปเพิ่ม ติดตั้งรวดเร็ว ผิวเรียบสวยงาม',
    descEn: 'Self-locking seam with no separate clips — fast installation, clean architectural finish.',
    useTh: 'อาคารสถาปัตยกรรมที่ต้องการความสวยงาม หลังคาโค้ง',
    useEn: 'Architectural buildings and curved roofs where finish matters.',
  },
  {
    slug: 'panel-sheet',
    category: 'wall',
    nameTh: 'แผ่นผนังพาแนล (Panel Sheet)',
    nameEn: 'Wall Panel Sheet',
    descTh: 'แผ่นผนังสำเร็จรูป ติดตั้งเร็ว ลดเวลาก่อสร้าง ใช้ได้ทั้งผนังภายในและภายนอก',
    descEn: 'Prefabricated wall panels — fast install, shorter construction time, interior or exterior use.',
    useTh: 'โรงงาน คลังสินค้า อาคารสำนักงานชั่วคราว',
    useEn: 'Factories, warehouses, temporary office buildings.',
  },
  {
    slug: 'pu-foam',
    category: 'insulation',
    nameTh: 'แผ่นฉนวน PU Foam',
    nameEn: 'PU Foam Insulated Panel',
    descTh: 'แผ่นเหล็กประกบฉนวนโพลียูรีเทน กันความร้อนและเสียงได้ดีเยี่ยม',
    descEn: 'Steel-faced polyurethane foam sandwich panel — high thermal and acoustic insulation.',
    useTh: 'ห้องเย็น โรงงานควบคุมอุณหภูมิ อาคารที่ต้องการกันร้อน',
    useEn: 'Cold storage, temperature-controlled plants, heat-sensitive buildings.',
  },
  {
    slug: 'pe-foam',
    category: 'insulation',
    comingSoon: true,
    nameTh: 'แผ่นฉนวน PE Foam',
    nameEn: 'PE Foam Insulation',
    descTh: 'รายละเอียดสเปกอยู่ระหว่างจัดเตรียม ติดต่อสอบถามข้อมูลเบื้องต้นได้ทาง LINE',
    descEn: 'Full specifications are being prepared. Contact us on LINE for preliminary details.',
    useTh: 'ข้อมูลเร็ว ๆ นี้',
    useEn: 'Details coming soon.',
  },
  {
    slug: 'eps',
    category: 'insulation',
    comingSoon: true,
    nameTh: 'แผ่นฉนวน EPS',
    nameEn: 'EPS Insulation',
    descTh: 'รายละเอียดสเปกอยู่ระหว่างจัดเตรียม ติดต่อสอบถามข้อมูลเบื้องต้นได้ทาง LINE',
    descEn: 'Full specifications are being prepared. Contact us on LINE for preliminary details.',
    useTh: 'ข้อมูลเร็ว ๆ นี้',
    useEn: 'Details coming soon.',
  },
  {
    slug: 'accessory-ridge-cap',
    category: 'accessories',
    comingSoon: true,
    nameTh: 'ครอบสันหลังคา',
    nameEn: 'Ridge Caps',
    descTh: 'รายละเอียดสเปกอยู่ระหว่างจัดเตรียม ติดต่อสอบถามข้อมูลเบื้องต้นได้ทาง LINE',
    descEn: 'Full specifications are being prepared. Contact us on LINE for preliminary details.',
    useTh: 'ข้อมูลเร็ว ๆ นี้',
    useEn: 'Details coming soon.',
  },
  {
    slug: 'accessory-screw',
    category: 'accessories',
    comingSoon: true,
    nameTh: 'สกรูยึดแผ่น',
    nameEn: 'Fixing Screws',
    descTh: 'รายละเอียดสเปกอยู่ระหว่างจัดเตรียม ติดต่อสอบถามข้อมูลเบื้องต้นได้ทาง LINE',
    descEn: 'Full specifications are being prepared. Contact us on LINE for preliminary details.',
    useTh: 'ข้อมูลเร็ว ๆ นี้',
    useEn: 'Details coming soon.',
  },
  {
    slug: 'accessory-flashing',
    category: 'accessories',
    comingSoon: true,
    nameTh: 'Flashing (แผ่นปิดรอยต่อ)',
    nameEn: 'Flashing',
    descTh: 'รายละเอียดสเปกอยู่ระหว่างจัดเตรียม ติดต่อสอบถามข้อมูลเบื้องต้นได้ทาง LINE',
    descEn: 'Full specifications are being prepared. Contact us on LINE for preliminary details.',
    useTh: 'ข้อมูลเร็ว ๆ นี้',
    useEn: 'Details coming soon.',
  },
  {
    slug: 'accessory-fixing',
    category: 'accessories',
    comingSoon: true,
    nameTh: 'อุปกรณ์ติดตั้ง',
    nameEn: 'Installation Fixings',
    descTh: 'รายละเอียดสเปกอยู่ระหว่างจัดเตรียม ติดต่อสอบถามข้อมูลเบื้องต้นได้ทาง LINE',
    descEn: 'Full specifications are being prepared. Contact us on LINE for preliminary details.',
    useTh: 'ข้อมูลเร็ว ๆ นี้',
    useEn: 'Details coming soon.',
  },
];
