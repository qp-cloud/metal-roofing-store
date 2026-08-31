export type Spec = {
  profileTh: string;
  profileEn: string;
  thicknessTh: string;
  thicknessEn: string;
  applicationTh: string;
  applicationEn: string;
  startingPrice: string;
};

export const specs: Spec[] = [
  {
    profileTh: 'ลอนเมทัลชีท (Metal Sheet)',
    profileEn: 'Standard Metal Sheet',
    thicknessTh: '0.35 – 0.50 มม.',
    thicknessEn: '0.35 – 0.50 mm',
    applicationTh: 'หลังคาบ้าน โรงจอดรถ',
    applicationEn: 'House roofs, carports',
    startingPrice: '',
  },
  {
    profileTh: 'PU Foam ฉนวนกันความร้อน',
    profileEn: 'PU Foam Insulated',
    thicknessTh: '25 – 50 มม. (ฉนวน)',
    thicknessEn: '25 – 50 mm (insulation)',
    applicationTh: 'ห้องเย็น โรงงานควบคุมอุณหภูมิ',
    applicationEn: 'Cold storage, climate-controlled plants',
    startingPrice: '',
  },
  {
    profileTh: 'Bolt Type ยึดสกรู',
    profileEn: 'Bolt-Type',
    thicknessTh: '0.40 – 0.47 มม.',
    thicknessEn: '0.40 – 0.47 mm',
    applicationTh: 'หลังคาโรงงานทั่วไป',
    applicationEn: 'General factory roofing',
    startingPrice: '',
  },
  {
    profileTh: 'Clip-Lock ระบบคลิปล็อก',
    profileEn: 'Clip-Lock',
    thicknessTh: '0.47 – 0.55 มม.',
    thicknessEn: '0.47 – 0.55 mm',
    applicationTh: 'อาคารพาณิชย์ หลังคาลาดต่ำ',
    applicationEn: 'Commercial buildings, low-slope roofs',
    startingPrice: '',
  },
  {
    profileTh: 'Snap-Lock ระบบสแนปล็อก',
    profileEn: 'Snap-Lock',
    thicknessTh: '0.47 – 0.55 มม.',
    thicknessEn: '0.47 – 0.55 mm',
    applicationTh: 'อาคารสถาปัตยกรรม หลังคาโค้ง',
    applicationEn: 'Architectural buildings, curved roofs',
    startingPrice: '',
  },
  {
    profileTh: 'Panel Sheet แผ่นผนัง',
    profileEn: 'Wall Panel',
    thicknessTh: '30 – 75 มม.',
    thicknessEn: '30 – 75 mm',
    applicationTh: 'ผนังโรงงาน คลังสินค้า',
    applicationEn: 'Factory & warehouse walls',
    startingPrice: '',
  },
];

export const specsNoteTh = 'ราคาขึ้นอยู่กับความหนา สี ปริมาณการสั่งซื้อ และราคาเหล็กในช่วงนั้น กรุณาติดต่อทีมขายเพื่อขอใบเสนอราคาที่แน่นอน';
export const specsNoteEn = 'Pricing varies with thickness, colour, order volume, and the prevailing steel price. Contact our sales team for a firm quote.';
