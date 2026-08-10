export type ColorOption = {
  nameTh: string;
  nameEn: string;
  hex: string;
};

export const roofColors: ColorOption[] = [
  { nameTh: 'แดงอิฐ', nameEn: 'Brick Red', hex: '#8c3a2b' },
  { nameTh: 'น้ำเงินกรมท่า', nameEn: 'Navy Blue', hex: '#233a5e' },
  { nameTh: 'เขียวใบไม้', nameEn: 'Forest Green', hex: '#2f4d3a' },
  { nameTh: 'เทาแกรไฟต์', nameEn: 'Graphite Gray', hex: '#4a4d52' },
  { nameTh: 'ขาวมุก', nameEn: 'Pearl White', hex: '#e9e7e2' },
  { nameTh: 'น้ำตาลช็อกโกแลต', nameEn: 'Chocolate Brown', hex: '#4a2f24' },
  { nameTh: 'ฟ้าท้องฟ้า', nameEn: 'Sky Blue', hex: '#5b7a99' },
  { nameTh: 'ส้มอิฐเผา', nameEn: 'Terracotta', hex: '#a15332' },
];

export type ProfileOption = {
  nameTh: string;
  nameEn: string;
  descTh: string;
  descEn: string;
};

export const profiles: ProfileOption[] = [
  { nameTh: 'ลอนเมทัลชีทมาตรฐาน', nameEn: 'Standard Corrugated', descTh: 'ลอนคลื่นคลาสสิก แข็งแรง ราคาประหยัด', descEn: 'Classic wave profile — strong, economical.' },
  { nameTh: 'ลอนบิ๊กไฟว์', nameEn: 'Big-Five Profile', descTh: 'ลอนสูงรับน้ำหนักได้ดี ระบายน้ำเร็ว', descEn: 'Tall ribs for load strength and fast runoff.' },
  { nameTh: 'ลอนทรงสถาปัตย์', nameEn: 'Architectural Standing Seam', descTh: 'ผิวเรียบ เส้นสันคม เหมาะอาคารดีไซน์', descEn: 'Flat pan, crisp seams — for design-forward buildings.' },
];

export type InsulationOption = {
  nameTh: string;
  nameEn: string;
  descTh: string;
  descEn: string;
};

export const insulationOptions: InsulationOption[] = [
  { nameTh: 'PU Foam', nameEn: 'PU Foam', descTh: 'กันความร้อนและเสียงสูงสุด นิยมใช้กับห้องเย็น', descEn: 'Maximum thermal & acoustic performance — common in cold storage.' },
  { nameTh: 'ใยแก้ว (Glass Wool)', nameEn: 'Glass Wool', descTh: 'ราคาประหยัด กันความร้อนได้ดี น้ำหนักเบา', descEn: 'Economical, good thermal resistance, lightweight.' },
  { nameTh: 'อลูมิเนียมฟอยล์สะท้อนความร้อน', nameEn: 'Reflective Foil', descTh: 'สะท้อนความร้อนจากแสงแดด ติดตั้งเสริมง่าย', descEn: 'Reflects solar heat, simple to retrofit.' },
];
