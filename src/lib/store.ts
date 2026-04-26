/**
 * Stratifyr data hooks — backed by Supabase, scoped to the authenticated user via RLS.
 * Replaces the previous localStorage store. Keeps a similar API to minimize UI churn.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { db } from "@/services/db";
import { useAuth } from "@/lib/auth";
import type { Database } from "@/integrations/supabase/types";

// ---------- Types (UI-facing) ----------
export type Channel = {
  id: string;
  name: string;
  amount: number;
  color: string;
};

export type CampaignStatus = Database["public"]["Enums"]["campaign_status"];

export type Campaign = {
  id: string;
  name: string;
  channel: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
};

// ---------- Helpers ----------
export function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

// In-memory client-side state for the strategy text (not persisted in DB by request scope).
const strategyKey = "stratifyr.strategy";

// ---------- Aggregate hook ----------
export function useStore() {
  const { user, loading: authLoading } = useAuth();
  const [budget, setBudgetState] = useState<number>(0);
  const [budgetId, setBudgetId] = useState<string | null>(null);
  const [channels, setChannelsState] = useState<Channel[]>([]);
  const [campaigns, setCampaignsState] = useState<Campaign[]>([]);
  const [strategy, setStrategyState] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(strategyKey) ?? "";
  });
  const [loading, setLoading] = useState(true);

  // Load all data when user is available
  const refresh = useCallback(async () => {
    if (!user) {
      setBudget(0);
      setBudgetId(null);
      setChannelsState([]);
      setCampaignsState([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [b, c, k] = await Promise.all([
      db.getAll("budgets", { orderBy: { column: "created_at", ascending: false }, limit: 1 }),
      db.getAll("channels", { orderBy: { column: "created_at", ascending: true } }),
      db.getAll("campaigns", { orderBy: { column: "start_date", ascending: true } }),
    ]);
    if (b.data[0]) {
      setBudgetId(b.data[0].id);
      setBudgetState(Number(b.data[0].amount));
    } else {
      setBudgetId(null);
      setBudgetState(0);
    }
    setChannelsState(
      c.data.map((row) => ({
        id: row.id,
        name: row.name,
        amount: Number(row.amount),
        color: row.color,
      })),
    );
    setCampaignsState(
      k.data.map((row) => ({
        id: row.id,
        name: row.name,
        channel: row.channel,
        budget: Number(row.budget),
        startDate: row.start_date,
        endDate: row.end_date,
        status: row.status,
      })),
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    void refresh();
  }, [authLoading, refresh]);

  // ----- Budget -----
  const setBudget = useCallback(
    async (amount: number) => {
      setBudgetState(amount);
      if (!user) return;
      if (budgetId) {
        await db.updateRecord("budgets", budgetId, { amount });
      } else {
        const { data } = await db.createRecord("budgets", { amount, user_id: user.id });
        if (data) setBudgetId(data.id);
      }
    },
    [user, budgetId],
  );

  // ----- Channels -----
  const addChannel = useCallback(
    async (name: string, amount: number) => {
      if (!user) return;
      const color = CHART_COLORS[channels.length % CHART_COLORS.length];
      const { data } = await db.createRecord("channels", {
        name,
        amount,
        color,
        user_id: user.id,
      });
      if (data) {
        setChannelsState((prev) => [
          ...prev,
          { id: data.id, name: data.name, amount: Number(data.amount), color: data.color },
        ]);
      }
    },
    [user, channels.length],
  );

  const updateChannel = useCallback(async (id: string, amount: number) => {
    setChannelsState((prev) => prev.map((c) => (c.id === id ? { ...c, amount } : c)));
    await db.updateRecord("channels", id, { amount });
  }, []);

  const removeChannel = useCallback(async (id: string) => {
    setChannelsState((prev) => prev.filter((c) => c.id !== id));
    await db.deleteRecord("channels", id);
  }, []);

  // ----- Campaigns -----
  const addCampaign = useCallback(
    async (c: Omit<Campaign, "id">) => {
      if (!user) return;
      const { data } = await db.createRecord("campaigns", {
        name: c.name,
        channel: c.channel,
        budget: c.budget,
        start_date: c.startDate,
        end_date: c.endDate,
        status: c.status,
        user_id: user.id,
      });
      if (data) {
        setCampaignsState((prev) => [
          ...prev,
          {
            id: data.id,
            name: data.name,
            channel: data.channel,
            budget: Number(data.budget),
            startDate: data.start_date,
            endDate: data.end_date,
            status: data.status,
          },
        ]);
      }
    },
    [user],
  );

  const updateCampaign = useCallback(
    async (id: string, patch: Partial<Campaign>) => {
      setCampaignsState((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
      const dbPatch: Database["public"]["Tables"]["campaigns"]["Update"] = {};
      if (patch.name !== undefined) dbPatch.name = patch.name;
      if (patch.channel !== undefined) dbPatch.channel = patch.channel;
      if (patch.budget !== undefined) dbPatch.budget = patch.budget;
      if (patch.startDate !== undefined) dbPatch.start_date = patch.startDate;
      if (patch.endDate !== undefined) dbPatch.end_date = patch.endDate;
      if (patch.status !== undefined) dbPatch.status = patch.status;
      await db.updateRecord("campaigns", id, dbPatch);
    },
    [],
  );

  const removeCampaign = useCallback(async (id: string) => {
    setCampaignsState((prev) => prev.filter((c) => c.id !== id));
    await db.deleteRecord("campaigns", id);
  }, []);

  // ----- Strategy (local-only persistence) -----
  const setStrategy = useCallback((s: string) => {
    setStrategyState(s);
    if (typeof window !== "undefined") window.localStorage.setItem(strategyKey, s);
  }, []);

  // Realtime sync — keep tabs in sync when the user makes changes elsewhere.
  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel(`stratifyr:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "channels", filter: `user_id=eq.${user.id}` },
        () => void refresh(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "campaigns", filter: `user_id=eq.${user.id}` },
        () => void refresh(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "budgets", filter: `user_id=eq.${user.id}` },
        () => void refresh(),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [user, refresh]);

  const state = useMemo(
    () => ({
      user: user ? { name: user.user_metadata?.display_name ?? user.email?.split("@")[0] ?? "User", email: user.email ?? "" } : null,
      budget,
      channels,
      campaigns,
      strategy,
    }),
    [user, budget, channels, campaigns, strategy],
  );

  return {
    state,
    loading,
    refresh,
    setBudget,
    addChannel,
    updateChannel,
    removeChannel,
    addCampaign,
    updateCampaign,
    removeCampaign,
    setStrategy,
  };
}
