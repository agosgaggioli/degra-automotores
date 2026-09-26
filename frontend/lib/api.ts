export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface Vehicle {
  id: string;
  slug: string;
  brand: string;
  model: string;
  version: string | null;
  year: number;
  mileage: number;
  price: number;
  currency: string;
  transmission: string | null;
  fuel: string | null;
  color: string | null;
  license_plate: string | null;
  description: string | null;
  status: 'published' | 'draft' | 'sold';
  featured: boolean;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface Paginated<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface VehicleFilters {
  brands: string[];
  transmissions: string[];
  fuels: string[];
}

export interface Consignment {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  city: string | null;
  brand: string;
  model: string;
  version: string | null;
  year: number | null;
  mileage: number | null;
  license_plate: string | null;
  color: string | null;
  fuel: string | null;
  transmission: string | null;
  expected_price: number | null;
  observations: string | null;
  status: 'pending' | 'contacted' | 'evaluated' | 'accepted' | 'rejected';
  internal_notes: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string | null;
  message: string;
  status: 'new' | 'read' | 'answered';
  created_at: string;
  updated_at: string;
}

export interface Financing {
  id: string;
  type: 'general' | 'brand';
  bank: string;
  logo: string | null;
  name: string;
  cuotas: number;
  tasa: string | null;
  anticipo: string | null;
  beneficio: string | null;
  url: string;
  brand: string | null;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await res.json() : null;

  if (!res.ok) {
    const message = body?.error || `Error ${res.status} al comunicarse con el servidor.`;
    throw new ApiError(message, res.status);
  }

  return body as T;
}

function authHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = window.localStorage.getItem('dr_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* =========================================================
   PÚBLICO
   ========================================================= */

export async function fetchVehicles(params: {
  search?: string;
  brand?: string;
  transmission?: string;
  fuel?: string;
  yearMin?: number | '';
  yearMax?: number | '';
  featured?: boolean;
  page?: number;
  pageSize?: number;
} = {}): Promise<Paginated<Vehicle>> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      qs.set(key, String(value));
    }
  });

  const res = await fetch(`${API_URL}/vehicles?${qs.toString()}`, { cache: 'no-store' });
  return handleResponse<Paginated<Vehicle>>(res);
}

export async function fetchFeaturedVehicles(pageSize = 3): Promise<Paginated<Vehicle>> {
  return fetchVehicles({ featured: true, pageSize });
}

export async function fetchVehicleFilters(): Promise<VehicleFilters> {
  const res = await fetch(`${API_URL}/vehicles/filters`, { cache: 'no-store' });
  return handleResponse<VehicleFilters>(res);
}

export async function fetchVehicleBySlug(slug: string): Promise<{ data: Vehicle }> {
  const res = await fetch(`${API_URL}/vehicles/${slug}`, { cache: 'no-store' });
  return handleResponse<{ data: Vehicle }>(res);
}

export async function submitConsignment(formData: FormData): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/consignments`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse<{ message: string }>(res);
}

export async function submitContact(payload: {
  name: string;
  phone: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<{ message: string }>(res);
}

export async function fetchFinancings(): Promise<{ data: Financing[] }> {
  const res = await fetch(`${API_URL}/financings`, { cache: 'no-store' });
  return handleResponse<{ data: Financing[] }>(res);
}

/* =========================================================
   AUTH / BACKOFFICE
   ========================================================= */

export async function loginAdmin(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<{ token: string; user: { id: string; name: string; email: string; role: string } }>(res);
}

export async function fetchMe() {
  const res = await fetch(`${API_URL}/auth/me`, { headers: { ...authHeaders() } });
  return handleResponse<{ user: any }>(res);
}

export async function fetchStats() {
  const res = await fetch(`${API_URL}/admin/stats`, { headers: { ...authHeaders() } });
  return handleResponse<{
    vehicles: { published: number; draft: number; sold: number };
    consignments: { pending: number; total: number };
    contact: { new: number };
  }>(res);
}

export async function fetchAdminVehicles(params: {
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<Paginated<Vehicle>> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') qs.set(key, String(value));
  });
  const res = await fetch(`${API_URL}/admin/vehicles?${qs.toString()}`, { headers: { ...authHeaders() } });
  return handleResponse<Paginated<Vehicle>>(res);
}

export async function fetchAdminVehicle(id: string) {
  const res = await fetch(`${API_URL}/admin/vehicles/${id}`, { headers: { ...authHeaders() } });
  return handleResponse<{ data: Omit<Vehicle, 'images'> & { images: { id: string; url: string }[] } }>(res);
}

export async function createVehicle(formData: FormData) {
  const res = await fetch(`${API_URL}/admin/vehicles`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: formData,
  });
  return handleResponse<{ data: Vehicle }>(res);
}

export async function updateVehicle(id: string, formData: FormData) {
  const res = await fetch(`${API_URL}/admin/vehicles/${id}`, {
    method: 'PUT',
    headers: { ...authHeaders() },
    body: formData,
  });
  return handleResponse<{ data: Vehicle }>(res);
}

export async function deleteVehicle(id: string) {
  const res = await fetch(`${API_URL}/admin/vehicles/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  return handleResponse<{ ok: true }>(res);
}

export async function deleteVehicleImage(vehicleId: string, imageId: string) {
  const res = await fetch(`${API_URL}/admin/vehicles/${vehicleId}/images/${imageId}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  return handleResponse<{ ok: true }>(res);
}

export async function fetchAdminConsignments(params: {
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<Paginated<Consignment>> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') qs.set(key, String(value));
  });
  const res = await fetch(`${API_URL}/admin/consignments?${qs.toString()}`, { headers: { ...authHeaders() } });
  return handleResponse<Paginated<Consignment>>(res);
}

export async function updateConsignment(id: string, payload: { status?: string; internal_notes?: string }) {
  const res = await fetch(`${API_URL}/admin/consignments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handleResponse<{ data: Consignment }>(res);
}

export async function deleteConsignment(id: string) {
  const res = await fetch(`${API_URL}/admin/consignments/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  return handleResponse<{ ok: true }>(res);
}

export async function fetchAdminContact(params: {
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<Paginated<ContactMessage>> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') qs.set(key, String(value));
  });
  const res = await fetch(`${API_URL}/admin/contact?${qs.toString()}`, { headers: { ...authHeaders() } });
  return handleResponse<Paginated<ContactMessage>>(res);
}

export async function updateContactMessage(id: string, payload: { status: string }) {
  const res = await fetch(`${API_URL}/admin/contact/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handleResponse<{ data: ContactMessage }>(res);
}

export async function deleteContactMessage(id: string) {
  const res = await fetch(`${API_URL}/admin/contact/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  return handleResponse<{ ok: true }>(res);
}
export async function fetchAdminFinancings(params: { status?: string; search?: string } = {}): Promise<{
  data: Financing[];
}> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') qs.set(key, String(value));
  });
  const res = await fetch(`${API_URL}/admin/financings?${qs.toString()}`, { headers: { ...authHeaders() } });
  return handleResponse<{ data: Financing[] }>(res);
}

export async function fetchAdminFinancing(id: string) {
  const res = await fetch(`${API_URL}/admin/financings/${id}`, { headers: { ...authHeaders() } });
  return handleResponse<{ data: Financing }>(res);
}

export async function createFinancing(formData: FormData) {
  const res = await fetch(`${API_URL}/admin/financings`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: formData,
  });
  return handleResponse<{ data: Financing }>(res);
}

export async function updateFinancing(id: string, formData: FormData) {
  const res = await fetch(`${API_URL}/admin/financings/${id}`, {
    method: 'PUT',
    headers: { ...authHeaders() },
    body: formData,
  });
  return handleResponse<{ data: Financing }>(res);
}

export async function deleteFinancing(id: string) {
  const res = await fetch(`${API_URL}/admin/financings/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  return handleResponse<{ ok: true }>(res);
}

export { ApiError };
