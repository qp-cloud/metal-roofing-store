/**
 * Photo plan for the site.
 *
 * Every slot below is a real photo we are waiting on. Drop a file named
 * `<slot id>.jpg` (or .png/.webp) into `src/assets/photos/` and it appears
 * automatically — see src/components/Photo.astro. Until then the slot renders
 * a neutral placeholder, so the site is publishable with any subset shot.
 *
 * DESIGN.md asks for documentary on-site photography over stock, so these
 * descriptions describe the real thing to point a camera at, not a mood.
 */

export type MediaKind = 'photo' | 'video';

export type PhotoCategory = {
  id: string;
  /** Photos land in src/assets/photos; videos in public/media. */
  kind: MediaKind;
  titleTh: string;
  titleEn: string;
  /** What the photographer should capture. */
  briefTh: string;
  briefEn: string;
  /** Where it surfaces on the site. */
  usedOn: string;
  slots: PhotoSlot[];
};

export type PhotoSlot = {
  /** Filename stem in src/assets/photos/. */
  id: string;
  altTh: string;
  altEn: string;
};

export const photoCategories: PhotoCategory[] = [
  {
    id: 'facility',
    kind: 'photo',
    titleTh: 'อาคาร / โรงงาน',
    titleEn: 'Building / Facility',
    briefTh: 'ลักษณะอาคารและสถานที่ประกอบการ ถ่ายให้เห็นป้ายชื่อและขนาดของโรงงาน',
    briefEn: 'The premises — show the signage and the scale of the plant.',
    usedOn: '/about',
    slots: [
      {
        id: 'facility-exterior',
        altTh: 'อาคารโรงงานและป้ายชื่อ หจก.มีชัยสตีล',
        altEn: 'Meechai Steel factory building and signage',
      },
      {
        id: 'facility-yard',
        altTh: 'ลานเก็บวัสดุและพื้นที่ปฏิบัติงานภายในโรงงาน',
        altEn: 'Material yard and working area inside the plant',
      },
    ],
  },
  {
    id: 'products',
    kind: 'photo',
    titleTh: 'แผ่นเมทัลชีท',
    titleEn: 'Metal Sheet Products',
    briefTh: 'สินค้าจริง เน้นให้เห็นสี ลอน และผิวของแผ่น หนึ่งรูปต่อหนึ่งสินค้า',
    briefEn: 'The actual product — colour, profile and surface. One per product.',
    usedOn: '/products, /en/products',
    slots: [
      { id: 'product-metal-sheet', altTh: 'แผ่นเหล็กมุงหลังคา', altEn: 'Metal roofing sheet' },
      { id: 'product-pu-foam', altTh: 'แผ่นฉนวน PU Foam', altEn: 'PU foam insulated panel' },
      { id: 'product-bolt-type', altTh: 'หลังคาระบบยึดสกรู', altEn: 'Bolt-type roofing system' },
      { id: 'product-clip-lock', altTh: 'หลังคาระบบคลิปล็อก', altEn: 'Clip-lock roofing system' },
      { id: 'product-snap-lock', altTh: 'หลังคาระบบสแนปล็อก', altEn: 'Snap-lock roofing system' },
      { id: 'product-panel-sheet', altTh: 'แผ่นผนังพาแนล', altEn: 'Wall panel sheet' },
    ],
  },
  {
    id: 'production',
    kind: 'photo',
    titleTh: 'เครื่องจักร / กระบวนการผลิต',
    titleEn: 'Machinery / Production',
    briefTh: 'เครื่องรีดขึ้นรูป เครื่องตัด และสายการผลิตขณะทำงานจริง',
    briefEn: 'Roll former, cutting line, and production in progress.',
    usedOn: '/about (production section)',
    slots: [
      {
        id: 'production-roll-former',
        altTh: 'เครื่องรีดขึ้นรูปลอนแผ่นหลังคา',
        altEn: 'Roll-forming machine shaping roofing profile',
      },
      {
        id: 'production-line',
        altTh: 'สายการผลิตแผ่นหลังคาภายในโรงงาน',
        altEn: 'Roofing sheet production line',
      },
    ],
  },
  {
    id: 'installation',
    kind: 'photo',
    titleTh: 'งานติดตั้ง',
    titleEn: 'Installation',
    briefTh: 'ทีมช่างติดตั้งหน้างานจริง เห็นทั้งคนทำงานและหลังคาที่เสร็จแล้ว',
    briefEn: 'The crew working on site, plus finished roofs.',
    usedOn: '/services',
    slots: [
      {
        id: 'installation-crew',
        altTh: 'ทีมช่างกำลังติดตั้งแผ่นหลังคาหน้างาน',
        altEn: 'Installation crew fitting roofing sheet on site',
      },
      {
        id: 'installation-finished',
        altTh: 'หลังคาที่ติดตั้งเสร็จแล้ว',
        altEn: 'Completed roof installation',
      },
    ],
  },
  {
    id: 'delivery',
    kind: 'photo',
    titleTh: 'รถขนส่ง',
    titleEn: 'Delivery',
    briefTh: 'รถขนส่งและการจัดส่งแผ่นถึงหน้างาน',
    briefEn: 'Delivery vehicles and sheet being delivered to site.',
    usedOn: '/services (delivery section)',
    slots: [
      {
        id: 'delivery-truck',
        altTh: 'รถขนส่งแผ่นหลังคาของมีชัยสตีล',
        altEn: 'Meechai Steel delivery truck loaded with roofing sheet',
      },
    ],
  },
  {
    id: 'review-videos',
    kind: 'video',
    titleTh: 'วิดีโอรีวิวลูกค้า',
    titleEn: 'Customer Review Videos',
    briefTh: 'คลิปรีวิวจากลูกค้าจริง และคลิปหน้างานที่ติดตั้งเสร็จแล้ว ถ่ายแนวนอน มีเสียงพูดชัด',
    briefEn: 'Real customer reviews and walk-throughs of finished jobs. Shoot landscape, with audible speech.',
    usedOn: '/testimonials, /en/testimonials',
    slots: [
      {
        id: 'review-video-1',
        altTh: 'วิดีโอรีวิวจากลูกค้า',
        altEn: 'Customer review video',
      },
      {
        id: 'review-video-2',
        altTh: 'วิดีโอรีวิวจากลูกค้า',
        altEn: 'Customer review video',
      },
    ],
  },
];

/**
 * Review videos need the customer's agreement before they go on the site,
 * even when the clip is already public on Facebook — reposting is a separate
 * publication. Keep a record of who agreed to what.
 */

/** Flat lookup so components can resolve alt text from a slot id. */
export const photoSlots: Record<string, PhotoSlot> = Object.fromEntries(
  photoCategories.flatMap((c) => c.slots.map((s) => [s.id, s])),
);
