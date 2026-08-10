export type Testimonial = {
  quoteTh: string;
  quoteEn: string;
  nameTh: string;
  nameEn: string;
  projectTh: string;
  projectEn: string;
  branchTh: string;
  branchEn: string;
};

/**
 * Empty on purpose.
 *
 * This list previously held invented customer names and quotes. Real reviews
 * live on the Facebook page, which /testimonials links to. Only add entries
 * here for reviews a customer has actually given and agreed to be quoted on.
 */
export const testimonials: Testimonial[] = [];
