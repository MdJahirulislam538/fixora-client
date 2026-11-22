export interface TechnicianSummary {
  id?: string;
  name: string;
  photo: string;
  area: string;
  bio: string;
}

export interface ServiceRecord {
  id?: string;
  _id?: string;
  title: string;
  category: string;
  image: string;
  description: string;
  startingPrice: number | string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  approvalStatus: string;
  isAvailable: boolean;
  technician: TechnicianSummary;
}

export function getServiceId(service: ServiceRecord) {
  return service.id || service._id || "";
}

export function isRequestableService(service: ServiceRecord) {
  return service.approvalStatus === "approved" && service.isAvailable === true;
}

export function formatServiceMode(mode: string) {
  const normalized = mode.toLowerCase().replace(/[_-]+/g, " ");
  if (normalized.includes("home")) return "Home Visit";
  if (normalized.includes("shop") || normalized.includes("drop")) {
    return "Shop Drop-off";
  }
  return mode;
}

export function formatStartingPrice(price: number | string) {
  if (typeof price === "number") return `৳${price.toLocaleString()}`;
  return price.startsWith("৳") ? price : `৳${price}`;
}
