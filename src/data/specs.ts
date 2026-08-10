export type Spec = {
  profileTh: string;
  profileEn: string;
  thickness: string;
  applicationTh: string;
  applicationEn: string;
  startingPrice: string;
};

export const specs: Spec[] = [
  {
    profileTh: 'ลอนเมทัลชีท (Metal Sheet)',
    profileEn: 'Standard Metal Sheet',
    thickness: '0.35 – 0.50 มม.',
    applicationTh: 'หลังคาบ้าน โรงจอดรถ',
    applicationEn: 'House roofs, carports',
    startingPrice: '',
  },
  {
    profileTh: 'PU Foam ฉนวนกันความร้อน',
    profileEn: 'PU Foam Insulated',
    thickness: '25 – 50 มม. (ฉนวน)',
    applicationTh: 'ห้องเย็น โรงงานควบคุมอุณหภูมิ',
    applicationEn: 'Cold storage, climate-controlled plants',
    startingPrice: '',
  },
  {
    profileTh: 'Bolt Type ยึดสกรู',
    profileEn: 'Bolt-Type',
    thickness: '0.40 – 0.47 มม.',
    applicationTh: 'หลังคาโรงงานทั่วไป',
    applicationEn: 'General factory roofing',
    startingPrice: '',
  },
  {
    profileTh: 'Clip-Lock ระบบคลิปล็อก',
    profileEn: 'Clip-Lock',
    thickness: '0.47 – 0.55 มม.',
    applicationTh: 'อาคารพาณิชย์ หลังคาลาดต่ำ',
    applicationEn: 'Commercial buildings, low-slope roofs',
    startingPrice: '',
  },
  {
    profileTh: 'Snap-Lock ระบบสแนปล็อก',
    profileEn: 'Snap-Lock',
    thickness: '0.47 – 0.55 มม.',
    applicationTh: 'อาคารสถาปัตยกรรม หลังคาโค้ง',
    applicationEn: 'Architectural buildings, curved roofs',
    startingPrice: '',
  },
  {
    profileTh: 'Panel Sheet แผ่นผนัง',
    profileEn: 'Wall Panel',
    thickness: '30 – 75 มม.',
    applicationTh: 'ผนังโรงงาน คลังสินค้า',
    applicationEn: 'Factory & warehouse walls',
    startingPrice: '',
  },
];

export const specsNoteTh = 'ราคาขึ้นอยู่กับความหนา สี ปริมาณการสั่งซื้อ และราคาเหล็กในช่วงนั้น กรุณาติดต่อทีมขายเพื่อขอใบเสนอราคาที่แน่นอน';
export const specsNoteEn = 'Pricing varies with thickness, colour, order volume, and the prevailing steel price. Contact our sales team for a firm quote.';
