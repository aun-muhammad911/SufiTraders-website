export type Enquiry = {
  id: string;
  name: string;
  business: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
  status: "open" | "resolved";
  resolvedAt?: string;
};

export type EnquiryInput = Omit<Enquiry, "id" | "createdAt" | "status" | "resolvedAt">;

function clean(value: unknown, maxLength: number) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

export function normalizeEnquiryInput(input: Partial<EnquiryInput>): EnquiryInput {
  const enquiry = {
    name: clean(input.name, 100),
    business: clean(input.business, 150),
    phone: clean(input.phone, 30),
    email: clean(input.email, 254).toLowerCase(),
    message: String(input.message ?? "")
      .trim()
      .slice(0, 2_000),
  };

  if (enquiry.name.length < 2) throw new Error("Please enter your full name.");
  if (enquiry.business.length < 2) throw new Error("Please enter your business name.");
  if (!/^[+()\d\s-]{6,30}$/.test(enquiry.phone)) {
    throw new Error("Please enter a valid phone number.");
  }
  if (enquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    throw new Error("Please enter a valid email address.");
  }
  if (enquiry.message.length < 5) throw new Error("Please add a short enquiry message.");

  return enquiry;
}
