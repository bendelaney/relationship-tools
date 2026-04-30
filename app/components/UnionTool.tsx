"use client";

import { useState, useCallback, useRef } from "react";

const STEPS = ["1", "2", "3", "4"] as const;
const STEP_LABELS: Record<string, string> = {
  "1": "Appreciate",
  "2": "What Worked",
  "3": "Concerns",
  "4": "Connect",
};

const STORAGE_KEY = "union_v1";

interface UnionState {
  fields: Record<string, string>;
  step: string;
}

function loadState(): UnionState {
  if (typeof window === "undefined") return { fields: {}, step: "1" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { fields: {}, step: "1" };
}

function saveState(state: UnionState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function buildExportText(state: UnionState): string {
  const f = state.fields;
  const lines: string[] = [];
  lines.push("STATE OF THE UNION");
  lines.push("Date: " + new Date().toLocaleString());
  lines.push("");
  lines.push("PART 1 — FIVE APPRECIATIONS");
  for (let i = 1; i <= 5; i++) {
    lines.push(`${i}. ${f[`a_${i}`] || "—"}`);
  }
  lines.push("");
  lines.push("PART 2 — WHAT WENT RIGHT");
  lines.push(f.went_right || "—");
  lines.push("");
  lines.push("PART 3 — CONCERNS");
  lines.push("I feel: " + (f.c_feel || "—"));
  lines.push("About: " + (f.c_about || "—"));
  lines.push("I need: " + (f.c_need || "—"));
  lines.push("Other concerns: " + (f.c_other || "—"));
  lines.push("");
  lines.push("PART 4 — CONNECTION REQUEST");
  lines.push("One thing that would help me feel loved: " + (f.connect || "—"));
  return lines.join("\n");
}

export default function UnionTool({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<UnionState>(loadState);
  const [toastVisible, setToastVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copy");
  const scrollRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showToast = useCallback(() => {
    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 900);
  }, []);

  const setField = useCallback((key: string, value: string) => {
    setState((prev) => {
      const next = { ...prev, fields: { ...prev.fields, [key]: value } };
      saveState(next);
      return next;
    });
    showToast();
  }, [showToast]);

  const goto = useCallback((step: string) => {
    setState((prev) => {
      const next = { ...prev, step };
      saveState(next);
      return next;
    });
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const stepIdx = STEPS.indexOf(state.step as typeof STEPS[number]);

  const stepHasData = (s: string) => {
    const fieldMap: Record<string, string[]> = {
      "1": ["a_1", "a_2", "a_3", "a_4", "a_5"],
      "2": ["went_right"],
      "3": ["c_feel", "c_about", "c_need", "c_other"],
      "4": ["connect"],
    };
    return (fieldMap[s] || []).some((k) => state.fields[k]);
  };

  const handleReset = () => {
    if (confirm("Clear all responses on this device?")) {
      const fresh: UnionState = { fields: {}, step: "1" };
      setState(fresh);
      saveState(fresh);
      showToast();
    }
  };

  const handleCopy = async () => {
    const text = buildExportText(state);
    try {
      await navigator.clipboard.writeText(text);
      setCopyLabel("Copied ✓");
    } catch {}
    setTimeout(() => setCopyLabel("Copy"), 1400);
  };

  return (
    <>
      <div className="overlay-content" ref={scrollRef}>
        <div className="overlay-bar">
          <button className="close-btn" type="button" onClick={onClose}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 3 5 8l6 5" />
            </svg>
            <span>Tools</span>
          </button>
        </div>

        <div className={`toast${toastVisible ? " on" : ""}`}>Saved</div>

        <div className="app">
          <header className="mast">
            <div className="eye">Gottman Method</div>
            <h1>State of the <em>Union</em></h1>
            <div className="credit">A weekly relationship check-in</div>
          </header>

          <nav className="nav">
            {STEPS.map((s) => (
              <button
                key={s}
                type="button"
                className={`${s === state.step ? "act" : ""}${stepHasData(s) ? " has" : ""}`}
                onClick={() => goto(s)}
              >
                <span className="n">{s}</span> {STEP_LABELS[s]}
              </button>
            ))}
          </nav>

          {/* Part 1: Five Appreciations */}
          <section className={`step${state.step === "1" ? " act" : ""}`} data-step="1">
            <div className="snum">Part One</div>
            <h2 className="stitle">Five Appreciations</h2>
            <p className="sdesc">
              Take turns sharing <em>five things</em> your partner did this past week that you valued.
              Be specific — say what they did <em>and</em> what the positive trait means about them.
            </p>

            <div className="card">
              <div className="hint">
                <strong>Example:</strong> <em>&ldquo;I appreciate how considerate you were when you picked up
                the dry cleaning after I ran out of time. It shows me you pay attention to what I need.&rdquo;</em>
              </div>
            </div>

            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <label className="flabel">Appreciation {i}</label>
                <textarea
                  className="field"
                  placeholder={`I appreciate when you…`}
                  value={state.fields[`a_${i}`] || ""}
                  onChange={(e) => setField(`a_${i}`, e.target.value)}
                  style={{ minHeight: 80 }}
                />
              </div>
            ))}
          </section>

          {/* Part 2: What Went Right */}
          <section className={`step${state.step === "2" ? " act" : ""}`} data-step="2">
            <div className="snum">Part Two</div>
            <h2 className="stitle">What Went Right</h2>
            <p className="sdesc">
              Talk about what&rsquo;s <em>working</em> in your relationship this week.
              What improved? What felt good? What did you handle well as a team?
            </p>

            <div className="card">
              <div className="hint">
                <strong>Examples:</strong> Successfully navigating a stressful week together,
                consistently keeping your date night, communicating calmly about a tough topic,
                or simply enjoying each other&rsquo;s company more.
              </div>
            </div>

            <label className="flabel">What went well this week</label>
            <textarea
              className="field"
              placeholder="This week I noticed that we…"
              value={state.fields.went_right || ""}
              onChange={(e) => setField("went_right", e.target.value)}
              style={{ minHeight: 160 }}
            />
          </section>

          {/* Part 3: Concerns (ATTUNE) */}
          <section className={`step${state.step === "3" ? " act" : ""}`} data-step="3">
            <div className="snum">Part Three</div>
            <h2 className="stitle">Address Concerns</h2>
            <p className="sdesc">
              Take turns sharing concerns from the past week.
              Use the <em>&ldquo;I feel / about / I need&rdquo;</em> framework — express feelings without criticism.
            </p>

            <div className="sub">The ATTUNE Framework</div>
            <div className="card">
              <div className="hint" style={{ fontSize: 15, lineHeight: 1.7 }}>
                <strong>A</strong>wareness — notice your partner&rsquo;s feelings<br />
                <strong>T</strong>olerance — two different viewpoints can both be valid<br />
                <strong>T</strong>urning toward — lean into your partner&rsquo;s needs<br />
                <strong>U</strong>nderstanding — seek their perspective first<br />
                <strong>N</strong>on-defensive listening — don&rsquo;t reverse blame<br />
                <strong>E</strong>mpathy — be sensitive to what they feel
              </div>
            </div>

            <div className="sub">Softened Start-Up</div>
            <div className="card">
              <div className="hint">
                <strong>Example:</strong> <em>&ldquo;I&rsquo;m feeling tired and overwhelmed from
                cooking the past seven nights. I need us to come up with a plan where we share
                cooking or eat out more.&rdquo;</em>
              </div>
            </div>

            <label className="flabel">I feel…</label>
            <textarea
              className="field"
              placeholder="Worried, overwhelmed, lonely, hurt, sad…"
              value={state.fields.c_feel || ""}
              onChange={(e) => setField("c_feel", e.target.value)}
            />

            <label className="flabel">About what…</label>
            <textarea
              className="field"
              placeholder="Describe the situation (not character flaws)…"
              value={state.fields.c_about || ""}
              onChange={(e) => setField("c_about", e.target.value)}
            />

            <label className="flabel">I need…</label>
            <textarea
              className="field"
              placeholder="The positive outcome you'd like…"
              value={state.fields.c_need || ""}
              onChange={(e) => setField("c_need", e.target.value)}
            />

            <label className="flabel">Anything else on your mind? (optional)</label>
            <textarea
              className="field"
              placeholder="Other concerns or thoughts…"
              value={state.fields.c_other || ""}
              onChange={(e) => setField("c_other", e.target.value)}
            />

            <div className="card">
              <div className="hint">
                <strong>Listener:</strong> Your job is to listen non-defensively and help your partner feel
                heard and understood. Summarize what you heard. Ask, <em>&ldquo;Did I get it?&rdquo;</em> and
                <em>&ldquo;Is there more?&rdquo;</em>
              </div>
            </div>
          </section>

          {/* Part 4: Request Connection */}
          <section className={`step${state.step === "4" ? " act" : ""}`} data-step="4">
            <div className="snum">Part Four</div>
            <h2 className="stitle">Request Connection</h2>
            <p className="sdesc">
              Each partner shares <em>one specific thing</em> the other could do this coming week
              to help them feel loved and connected.
            </p>

            <div className="card">
              <div className="hint">
                <strong>Example:</strong> <em>&ldquo;I&rsquo;d love to spend Saturday morning
                cuddling in bed together before we start the day.&rdquo;</em>
              </div>
            </div>

            <label className="flabel">One thing that would help me feel loved this week</label>
            <textarea
              className="field"
              placeholder="It would mean a lot if…"
              value={state.fields.connect || ""}
              onChange={(e) => setField("connect", e.target.value)}
              style={{ minHeight: 140 }}
            />

            <div className="util">
              <button className="lnk" type="button" onClick={() => setModalOpen(true)}>Export &amp; copy</button>
              <button className="lnk w" type="button" onClick={handleReset}>Reset everything</button>
            </div>
          </section>

          <hr className="divider" />
          <p className="hint" style={{ textAlign: "center", fontSize: 12 }}>
            Your responses save automatically on this device. Nothing leaves your device.
          </p>
        </div>
      </div>

      {/* Footer nav */}
      <div className="foot">
        <div className="foot-in">
          <button className="btn" type="button" disabled={stepIdx <= 0} onClick={() => goto(STEPS[stepIdx - 1])}>
            ← Back
          </button>
          <button
            className="btn pri"
            type="button"
            onClick={() => {
              if (stepIdx < STEPS.length - 1) goto(STEPS[stepIdx + 1]);
              else setModalOpen(true);
            }}
          >
            {stepIdx >= STEPS.length - 1 ? "Done" : "Next →"}
          </button>
        </div>
      </div>

      {/* Export modal */}
      <div className={`modal${modalOpen ? " open" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
        <div className="mc">
          <h3>Your responses</h3>
          <p className="hint">Copy the text below to share, journal, or save elsewhere.</p>
          <textarea className="exp" readOnly value={buildExportText(state)} />
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" type="button" onClick={handleCopy}>{copyLabel}</button>
            <button className="btn pri" type="button" onClick={() => setModalOpen(false)}>Done</button>
          </div>
        </div>
      </div>
    </>
  );
}
