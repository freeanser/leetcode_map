import { useEffect, useState } from "react";

/** 小工具：難度顏色 */
const DifficultyBadge = ({ level }) => {
  const color =
    level === "Easy" ? "#16a34a" : level === "Medium" ? "#ca8a04" : "#dc2626";
  const bg =
    level === "Easy" ? "#052e17" : level === "Medium" ? "#2a2206" : "#3b0a0a";
  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
        color,
        background: bg,
        border: `1px solid ${color}`,
      }}
      aria-label={`Difficulty: ${level}`}
      title={`Difficulty: ${level}`}
    >
      {level}
    </span>
  );
};

/** 問題表格 */
const ProblemTable = ({ problems = [] }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
      <thead>
        <tr style={{ background: "#111827", color: "#9ca3af" }}>
          <th style={thStyle}>Problem</th>
          <th style={thStyle}>Difficulty</th>
          <th style={thStyle}>Link</th>
        </tr>
      </thead>
      <tbody>
        {problems.map((p, idx) => (
          <tr
            key={p.id}
            style={{
              background: idx % 2 ? "#0b2530" : "#0a1f2a",
              color: "#e5e7eb",
            }}
          >
            <td style={tdStyle}>{p.title}</td>
            <td style={tdStyle}>
              <DifficultyBadge level={p.difficulty} />
            </td>
            <td style={tdStyle}>
              <a href={p.url} target="_blank" rel="noreferrer" style={{ color: "#f59e0b" }}>
                Open ↗
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const thStyle = {
  textAlign: "left",
  padding: "12px 16px",
  borderBottom: "1px solid #1f2937",
  position: "sticky",
  top: 0,
  zIndex: 1,
};

const tdStyle = {
  padding: "12px 16px",
  borderBottom: "1px solid #1f2937",
};

/** 類別卡片（可折疊） */
const CategoryCard = ({ category }) => {
  const [open, setOpen] = useState(false);
  const total = category.problems.length;

  return (
    <section
      style={{
        border: "1px solid #374151",
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        background: "#0b1220",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          all: "unset",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "16px 20px",
          cursor: "pointer",
          background: "#111827",
          color: "#e5e7eb",
        }}
        aria-expanded={open}
      >
        <div style={{ fontSize: 18, fontWeight: 600 }}>{category.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* 進度條（示意：純顯示 total） */}
          <div
            style={{
              width: 160,
              height: 8,
              background: "#374151",
              borderRadius: 999,
              overflow: "hidden",
            }}
            aria-hidden="true"
          >
            <div
              style={{
                width: "0%", // 最簡版：尚未計算完成度，先固定 0%
                height: "100%",
                background: "#22c55e",
              }}
            />
          </div>
          <span style={{ color: "#9ca3af", fontSize: 13 }}>0 / {total}</span>
          <span style={{ transform: `rotate(${open ? 180 : 0}deg)`, transition: "200ms" }}>
            ▼
          </span>
        </div>
      </button>

      {open && (
        <div style={{ padding: 16 }}>
          <ProblemTable problems={category.problems} />
        </div>
      )}
    </section>
  );
};

/** App：載入 problems.json → 列出類別卡片 */
export default function App() {
  const [data, setData] = useState({ categories: [] });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/problems.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((json) => setData(json))
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={pageShell}>Loading…</div>;
  }
  if (err) {
    return (
      <div style={pageShell}>
        <p style={{ color: "#fca5a5" }}>Failed to load problems.json</p>
        <code style={{ color: "#9ca3af" }}>{err}</code>
      </div>
    );
  }

  const categories = [...(data.categories || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div style={pageShell}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ color: "white", fontSize: 24, fontWeight: 700, margin: 0 }}>
          Yen's LeetCode Roadmap — Minimal UI
        </h1>
        <p style={{ color: "#9ca3af", marginTop: 6, marginBottom: 0 }}>
          展開類別以查看 ProblemTable（最小可用版本，尚未包含完成度/收藏/同步）
        </p>
      </header>

      {categories.map((c) => (
        <CategoryCard key={c.id} category={c} />
      ))}
    </div>
  );
}

const pageShell = {
  minHeight: "100vh",
  background: "#0b1020",
  padding: "24px 20px",
  fontFamily:
    "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial",
};
