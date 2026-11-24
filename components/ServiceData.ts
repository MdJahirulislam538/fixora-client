export interface TechnicianSummary {
  id?: string;
  name: string;
  email?: string;
  photo: string;
  area: string;
  bio: string;
}

export interface ServicePriceFields {
  basePrice?: number | string | null;
  startingPrice?: number | string | null;
}

export interface ServiceTechnicianFields {
  technicianName?: string;
  technicianEmail?: string;
  technician?: Partial<TechnicianSummary> | null;
}

export interface ServiceRecord extends ServicePriceFields, ServiceTechnicianFields {
  id?: string;
  _id?: string;
  title: string;
  category: string;
  image: string;
  description: string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  approvalStatus: string;
  isAvailable: boolean;
}

export function getServiceId(service: ServiceRecord) {
  return service.id || service._id || "";
}

export function isRequestableService(service: ServiceRecord) {
  return service.approvalStatus === "approved" && service.isAvailable === true;
}

export function getServicePrice(service: ServicePriceFields) {
  return service.basePrice ?? service.startingPrice ?? 0;
}

export function getServiceTechnician(service: ServiceTechnicianFields): TechnicianSummary {
  return {
    id: service.technician?.id,
    name: service.technicianName || service.technician?.name || "Technician",
    photo: service.technician?.photo || "",
    area: service.technician?.area || "",
    bio: service.technician?.bio || "",
  };
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

export function formatServicePrice(service: ServicePriceFields) {
  return formatStartingPrice(getServicePrice(service));
}
