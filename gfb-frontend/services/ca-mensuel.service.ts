import api from "@/lib/api";
import {
  BulkCreateCaMensuelDto,
  CaMensuel,
  CreateCaMensuelDto,
  FilterCaMensuelDto,
  UpdateCaMensuelDto,
} from "@/types/ca-mensuel";

const BASE = "/ca-mensuel";

export const caMensuelService = {
  // ─── Lecture ──────────────────────────────────────────────────────────────

  getAll: async (filter?: FilterCaMensuelDto): Promise<CaMensuel[]> => {
    const { data } = await api.get<CaMensuel[]>(BASE, { params: filter });
    return data;
  },

  getById: async (id: number): Promise<CaMensuel> => {
    const { data } = await api.get<CaMensuel>(`${BASE}/${id}`);
    return data;
  },

  getByAnnee: async (annee: number): Promise<CaMensuel[]> => {
    const { data } = await api.get<CaMensuel[]>(`${BASE}/annee/${annee}`);
    return data;
  },

  getAnneesDisponibles: async (): Promise<number[]> => {
    const { data } = await api.get<number[]>(`${BASE}/annees`);
    return data;
  },

  create: async (dto: CreateCaMensuelDto): Promise<CaMensuel> => {
    const { data } = await api.post<CaMensuel>(BASE, dto);
    return data;
  },

  bulkCreate: async (dto: BulkCreateCaMensuelDto): Promise<CaMensuel[]> => {
    const { data } = await api.post<CaMensuel[]>(`${BASE}/bulk`, dto);
    return data;
  },

  update: async (id: number, dto: UpdateCaMensuelDto): Promise<CaMensuel> => {
    const { data } = await api.put<CaMensuel>(`${BASE}/${id}`, dto);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`${BASE}/${id}`);
  },

  removeByAnnee: async (annee: number): Promise<{ deleted: number }> => {
    const { data } = await api.delete<{ deleted: number }>(
      `${BASE}/annee/${annee}`,
    );
    return data;
  },
};
