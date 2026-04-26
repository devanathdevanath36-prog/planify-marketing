/**
 * Generic CRUD data access layer for Supabase tables.
 * Reusable across any table — type-safe via the generated `Database` types.
 *
 * Usage:
 *   import { db } from "@/services/db";
 *   const rows = await db.getAll("campaigns", { orderBy: { column: "start_date" } });
 */
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];
export type TableName = keyof Tables;

export type Row<T extends TableName> = Tables[T]["Row"];
export type Insert<T extends TableName> = Tables[T]["Insert"];
export type Update<T extends TableName> = Tables[T]["Update"];

// PostgREST's generated types are narrow per-table; for a generic helper we
// cast through a permissive alias. RLS still enforces real access at the DB.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sb = supabase as unknown as any;

export type ListOptions = {
  filters?: Record<string, string | number | boolean | null>;
  orderBy?: { column: string; ascending?: boolean };
  range?: { from: number; to: number }; // pagination
  search?: { column: string; value: string }; // ILIKE %value%
  limit?: number;
};

function logError(scope: string, error: unknown) {
  // Centralized logging — replace with your logger of choice in production.
  // eslint-disable-next-line no-console
  console.error(`[db:${scope}]`, error);
}

export const db = {
  async getAll<T extends TableName>(
    table: T,
    opts: ListOptions = {},
  ): Promise<{ data: Row<T>[]; count: number | null; error: string | null }> {
    try {
      let q = sb.from(table as string).select("*", { count: "exact" });
      if (opts.filters) {
        for (const [k, v] of Object.entries(opts.filters)) {
          q = v === null ? q.is(k, null) : q.eq(k, v);
        }
      }
      if (opts.search) {
        q = q.ilike(opts.search.column, `%${opts.search.value}%`);
      }
      if (opts.orderBy) {
        q = q.order(opts.orderBy.column, { ascending: opts.orderBy.ascending ?? true });
      }
      if (opts.range) {
        q = q.range(opts.range.from, opts.range.to);
      } else if (opts.limit) {
        q = q.limit(opts.limit);
      }
      const { data, error, count } = await q;
      if (error) throw error;
      return { data: (data ?? []) as unknown as Row<T>[], count, error: null };
    } catch (e) {
      logError(`getAll:${String(table)}`, e);
      return { data: [], count: null, error: (e as Error).message };
    }
  },

  async getById<T extends TableName>(
    table: T,
    id: string,
  ): Promise<{ data: Row<T> | null; error: string | null }> {
    try {
      const { data, error } = await sb.from(table as string).select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return { data: (data as unknown as Row<T> | null) ?? null, error: null };
    } catch (e) {
      logError(`getById:${String(table)}`, e);
      return { data: null, error: (e as Error).message };
    }
  },

  async createRecord<T extends TableName>(
    table: T,
    payload: Insert<T>,
  ): Promise<{ data: Row<T> | null; error: string | null }> {
    try {
      const { data, error } = await sb
        .from(table as string)
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return { data: data as unknown as Row<T>, error: null };
    } catch (e) {
      logError(`createRecord:${String(table)}`, e);
      return { data: null, error: (e as Error).message };
    }
  },

  async updateRecord<T extends TableName>(
    table: T,
    id: string,
    patch: Update<T>,
  ): Promise<{ data: Row<T> | null; error: string | null }> {
    try {
      const { data, error } = await sb
        .from(table as string)
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return { data: data as unknown as Row<T>, error: null };
    } catch (e) {
      logError(`updateRecord:${String(table)}`, e);
      return { data: null, error: (e as Error).message };
    }
  },

  async deleteRecord<T extends TableName>(
    table: T,
    id: string,
  ): Promise<{ error: string | null }> {
    try {
      const { error } = await sb.from(table as string).delete().eq("id", id);
      if (error) throw error;
      return { error: null };
    } catch (e) {
      logError(`deleteRecord:${String(table)}`, e);
      return { error: (e as Error).message };
    }
  },
};
