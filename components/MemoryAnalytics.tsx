"use client";
import { useMemo } from "react";
import { Memory } from "@/lib/supabase";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = { memories: Memory[] };

const COLORS = {
  note: "#7c3aed",
  idea: "#f59e0b",
  doc: "#0ea5e9",
  chat: "#10b981",
};

const PURPLE = "#7c3aed";
const VIOLET = "#a78bfa";
const LIGHT = "#ede9fe";

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #f1f5f9",
        borderRadius: 20,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background: color + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          marginBottom: 2,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: "#0f172a",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: 11, color: "#94a3b8" }}>{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ede9fe",
        borderRadius: 12,
        padding: "10px 14px",
        boxShadow: "0 8px 24px rgba(124,58,237,0.12)",
        fontSize: 13,
      }}
    >
      <div style={{ fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>
        {label}
      </div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, fontWeight: 500 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

export default function MemoryAnalytics({ memories }: Props) {
  // ── Computed data ──────────────────────────────────────────
  const stats = useMemo(() => {
    const total = memories.length;
    const ideas = memories.filter((m) => m.source_type === "idea").length;
    const notes = memories.filter((m) => m.source_type === "note").length;
    const docs = memories.filter((m) => m.source_type === "doc").length;

    // Streak — consecutive days with at least 1 memory
    const dates = new Set(memories.map((m) => m.created_at.slice(0, 10)));
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (dates.has(key)) streak++;
      else if (i > 0) break;
    }

    // Total words
    const words = memories.reduce(
      (acc, m) => acc + m.content.split(" ").length,
      0,
    );

    // Top tags
    const tagCount: Record<string, number> = {};
    memories.forEach((m) =>
      m.tags.forEach((t) => {
        tagCount[t] = (tagCount[t] || 0) + 1;
      }),
    );
    const topTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return { total, ideas, notes, docs, streak, words, topTags };
  }, [memories]);

  // ── Last 7 days chart data ─────────────────────────────────
  const weekData = useMemo(() => {
    const days: {
      date: string;
      label: string;
      note: number;
      idea: number;
      doc: number;
    }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      const day = memories.filter((m) => m.created_at.slice(0, 10) === key);
      days.push({
        date: key,
        label,
        note: day.filter((m) => m.source_type === "note").length,
        idea: day.filter((m) => m.source_type === "idea").length,
        doc: day.filter((m) => m.source_type === "doc").length,
      });
    }
    return days;
  }, [memories]);

  // ── Last 30 days area chart ────────────────────────────────
  const monthData = useMemo(() => {
    const days: { label: string; count: number; cumulative: number }[] = [];
    let cumulative = 0;
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const count = memories.filter(
        (m) => m.created_at.slice(0, 10) === key,
      ).length;
      cumulative += count;
      days.push({ label, count, cumulative });
    }
    return days;
  }, [memories]);

  // ── Type pie data ──────────────────────────────────────────
  const pieData = useMemo(
    () =>
      [
        { name: "Notes", value: stats.notes, color: COLORS.note },
        { name: "Ideas", value: stats.ideas, color: COLORS.idea },
        { name: "Docs", value: stats.docs, color: COLORS.doc },
      ].filter((d) => d.value > 0),
    [stats],
  );

  if (memories.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          border: "1.5px solid #f1f5f9",
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 6,
          }}
        >
          No analytics yet
        </div>
        <div style={{ fontSize: 14, color: "#94a3b8" }}>
          Add your first memory to see insights here
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Section title */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: LIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          📊
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
            Memory Analytics
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            Your second brain in numbers
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 10,
        }}
      >
        <StatCard
          icon="🧠"
          label="Total memories"
          value={stats.total}
          color={PURPLE}
        />
        <StatCard
          icon="🔥"
          label="Day streak"
          value={stats.streak}
          color="#ef4444"
          sub="consecutive days"
        />
        <StatCard
          icon="💡"
          label="Ideas captured"
          value={stats.ideas}
          color={COLORS.idea}
        />
        <StatCard
          icon="✍️"
          label="Words written"
          value={stats.words.toLocaleString()}
          color={COLORS.doc}
        />
      </div>

      {/* 30-day growth chart */}
      <div
        style={{
          background: "#fff",
          border: "1.5px solid #f1f5f9",
          borderRadius: 20,
          padding: "18px 20px",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 14,
          }}
        >
          Growth over 30 days
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart
            data={monthData}
            margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
          >
            <defs>
              <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PURPLE} stopOpacity={0.25} />
                <stop offset="95%" stopColor={PURPLE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              interval={6}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="cumulative"
              name="Total"
              stroke={PURPLE}
              strokeWidth={2.5}
              fill="url(#colorGrad)"
              dot={false}
              activeDot={{ r: 5, fill: PURPLE, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Last 7 days bar chart */}
      <div
        style={{
          background: "#fff",
          border: "1.5px solid #f1f5f9",
          borderRadius: 20,
          padding: "18px 20px",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 14,
          }}
        >
          Last 7 days by type
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart
            data={weekData}
            margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
            barSize={14}
            barGap={2}
          >
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="note"
              name="Notes"
              fill={COLORS.note}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="idea"
              name="Ideas"
              fill={COLORS.idea}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="doc"
              name="Docs"
              fill={COLORS.doc}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie + top tags row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {/* Type breakdown */}
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #f1f5f9",
            borderRadius: 20,
            padding: "18px 20px",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: 10,
            }}
          >
            Type breakdown
          </div>
          <ResponsiveContainer width="100%" height={110}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value, name]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #ede9fe",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              marginTop: 6,
            }}
          >
            {pieData.map((d) => (
              <div
                key={d.name}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: d.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 11, color: "#64748b", flex: 1 }}>
                  {d.name}
                </span>
                <span
                  style={{ fontSize: 11, fontWeight: 600, color: "#0f172a" }}
                >
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top tags */}
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #f1f5f9",
            borderRadius: 20,
            padding: "18px 20px",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: 10,
            }}
          >
            Top tags
          </div>
          {stats.topTags.length === 0 ? (
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
              No tags yet. Add tags to your memories!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {stats.topTags.map(([tag, count]) => {
                const max = stats.topTags[0][1];
                const pct = Math.round((count / max) * 100);
                return (
                  <div key={tag}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 3,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: "#475569",
                          fontWeight: 500,
                        }}
                      >
                        #{tag}
                      </span>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>
                        {count}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: "#f1f5f9",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: pct + "%",
                          background:
                            "linear-gradient(90deg, #7c3aed, #a78bfa)",
                          borderRadius: 2,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
