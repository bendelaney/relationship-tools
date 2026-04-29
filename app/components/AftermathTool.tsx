"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  FEELINGS, TRIGGERS, SETUP, APOLOGY, STEPS, STEP_LABELS, HORSEMEN,
  type AftermathState, loadState, saveState, buildExportText,
} from "@/lib/data";
import ChipGroup from "./ChipGroup";

export default function AftermathTool({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<AftermathState>(loadState);
  const [toastVisible, setToastVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copy");
  const overlayRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const persist = useCallback((next: AftermathState) => {
    setState(next);
    saveState(next);
    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 900);
  }, []);

  const toggleChip = useCallback((group: string, label: string) => {
    setState((prev) => {
      const arr = [...(prev.chips[group] || [])];
      const idx = arr.indexOf(label);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(label);
      const next = { ...prev, chips: { ...prev.chips, [group]: arr } };
      saveState(next);
      setToastVisible(true);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToastVisible(false), 900);
      return next;
    });
  }, []);

  const setField = useCallback((key: string, value: string) => {
    setState((prev) => {
      const next = { ...prev, fields: { ...prev.fields, [key]: value } };
      saveState(next);
      return next;
    });
  }, []);

  const goto = useCallback((step: string) => {
    setState((prev) => {
      const next = { ...prev, step };
      saveState(next);
      return next;
    });
    overlayRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const stepIdx = STEPS.indexOf(state.step as typeof STEPS[number]);

  const stepHasData = (s: string) => {
    const chipMap: Record<string, string[]> = {
      "1": ["feelings"], "3": ["triggers"], "4": ["setup", "apology"],
    };
    const keys = chipMap[s] || [];
    if (keys.some((k) => (state.chips[k] || []).length > 0)) return true;
    const fieldMap: Record<string, string[]> = {
      "1": ["f_other"],
      "3": ["t_story", "t_vuln"],
      "4": ["re_regret", "re_apology", "re_still_need"],
      "5": ["p_partner", "p_me", "p_move_on"],
    };
    return (fieldMap[s] || []).some((k) => state.fields[k]);
  };

  const handleReset = () => {
    if (confirm("Clear all responses on this device?")) {
      const fresh: AftermathState = { chips: {}, fields: {}, step: "1" };
      persist(fresh);
    }
  };

  const handleCopy = async () => {
    const text = buildExportText(state);
    try {
      await navigator.clipboard.writeText(text);
      setCopyLabel("Copied ✓");
    } catch {
      // fallback
    }
    setTimeout(() => setCopyLabel("Copy"), 1400);
  };

  return (
    <>
      <div className={`toast${toastVisible ? " on" : ""}`}>Saved</div>

      <div className="app">
        <header className="mast">
          <div className="eye">Gottman Method</div>
          <h1>Aftermath of <em>a Fight</em></h1>
          <div className="credit">A guided repair conversation</div>
        </header>

        <nav className="nav">
          {STEPS.map((s) => (
            <button
              key={s}
              type="button"
              className={`${s === state.step ? "act" : ""}${stepHasData(s) ? " has" : ""}`}
              onClick={() => goto(s)}
            >
              <span className="n">{s === "H" ? "★" : s}</span> {STEP_LABELS[s]}
            </button>
          ))}
        </nav>

        {/* Step 1: Feelings */}
        <section className={`step${state.step === "1" ? " act" : ""}`} data-step="1">
          <div className="snum">Step One</div>
          <h2 className="stitle">Feelings</h2>
          <p className="sdesc">Share <em>how</em> you felt. Don&rsquo;t say <em>why</em>. Don&rsquo;t comment on your partner&rsquo;s feelings.</p>
          <div className="lead">I felt&hellip;</div>
          <ChipGroup items={FEELINGS} selected={state.chips.feelings || []} onToggle={(l) => toggleChip("feelings", l)} />
          <label className="flabel">Anything else? (optional)</label>
          <textarea
            className="field"
            placeholder="Other feelings…"
            value={state.fields.f_other || ""}
            onChange={(e) => setField("f_other", e.target.value)}
          />
        </section>

        {/* Step 2: Realities */}
        <section className={`step${state.step === "2" ? " act" : ""}`} data-step="2">
          <div className="snum">Step Two</div>
          <h2 className="stitle">Realities</h2>
          <p className="sdesc">Describe your &ldquo;reality.&rdquo; Take turns. Summarize and validate at least <em>a part</em> of your partner&rsquo;s reality.</p>
          <div className="lead">Subjective Reality &amp; Validation</div>
          <div className="card">
            <div className="hint"><strong>a.</strong> Take turns describing your perceptions, your own reality of what happened during the regrettable incident. Describe <em>yourself</em> and your perception. Don&rsquo;t describe your partner. Avoid attack and blame. Talk about what you might have needed from your partner. Describe your perceptions like a reporter, giving an objective blow-by-blow description. Say <em>&ldquo;I heard you saying,&rdquo;</em> rather than <em>&ldquo;You said.&rdquo;</em></div>
          </div>
          <div className="card">
            <div className="hint"><strong>b.</strong> Summarize and then validate your partner&rsquo;s reality by saying something like, <em>&ldquo;It makes sense to me how you saw this and what your perceptions and needs were. I get it.&rdquo;</em> Use empathy by saying something like, <em>&ldquo;I can see why this upset you.&rdquo;</em> Validation doesn&rsquo;t mean you agree, but that you can understand even a part of your partner&rsquo;s experience of the incident.</div>
          </div>
          <div className="card">
            <div className="hint"><strong>c.</strong> Do both partners feel understood? If yes, move on. If no, ask, <em>&ldquo;What do I need to know to understand your perspective better?&rdquo;</em> After summarizing and validating, ask your partner, <em>&ldquo;Did I get it?&rdquo;</em> and <em>&ldquo;Is there anything else?&rdquo;</em></div>
          </div>
        </section>

        {/* Step 3: Triggers */}
        <section className={`step${state.step === "3" ? " act" : ""}`} data-step="3">
          <div className="snum">Step Three</div>
          <h2 className="stitle">Triggers</h2>
          <p className="sdesc">Share past experiences or memories that may have escalated this. Help your partner know <em>why</em> these are triggers for you.</p>
          <div className="lead">What got triggered&hellip;</div>
          <ChipGroup items={TRIGGERS} selected={state.chips.triggers || []} onToggle={(l) => toggleChip("triggers", l)} />
          <label className="flabel">My story — an earlier moment with similar feelings</label>
          <textarea
            className="field"
            placeholder="When I was younger / earlier in my life…"
            value={state.fields.t_story || ""}
            onChange={(e) => setField("t_story", e.target.value)}
            style={{ minHeight: 140 }}
          />
          <label className="flabel">My enduring vulnerabilities (what my partner needs to know about me)</label>
          <textarea
            className="field"
            placeholder="I'm sensitive to…"
            value={state.fields.t_vuln || ""}
            onChange={(e) => setField("t_vuln", e.target.value)}
          />
          <div className="card hint">
            <strong>Validation:</strong> Does any part of your partner&rsquo;s triggers and story make sense to you? Tell them which part.
          </div>
        </section>

        {/* Step 4: Responsibility */}
        <section className={`step${state.step === "4" ? " act" : ""}`} data-step="4">
          <div className="snum">Step Four</div>
          <h2 className="stitle">Responsibility</h2>
          <p className="sdesc">Acknowledge your <em>own</em> role in contributing to the regrettable incident.</p>
          <div className="sub">What set me up</div>
          <ChipGroup items={SETUP} selected={state.chips.setup || []} onToggle={(l) => toggleChip("setup", l)} />
          <label className="flabel">Specifically, what do I regret? What was my contribution?</label>
          <textarea
            className="field"
            placeholder="My part in this was…"
            value={state.fields.re_regret || ""}
            onChange={(e) => setField("re_regret", e.target.value)}
          />
          <div className="sub">I&rsquo;m sorry that&hellip;</div>
          <ChipGroup items={APOLOGY} selected={state.chips.apology || []} onToggle={(l) => toggleChip("apology", l)} />
          <label className="flabel">Other things I want to apologize for</label>
          <textarea
            className="field"
            placeholder="I'm also sorry for…"
            value={state.fields.re_apology || ""}
            onChange={(e) => setField("re_apology", e.target.value)}
          />
          <label className="flabel">If I accept my partner&rsquo;s apology, I&rsquo;ll say so. If not, what do I still need?</label>
          <textarea
            className="field"
            placeholder="What I still need is…"
            value={state.fields.re_still_need || ""}
            onChange={(e) => setField("re_still_need", e.target.value)}
          />
        </section>

        {/* Step 5: Plans */}
        <section className={`step${state.step === "5" ? " act" : ""}`} data-step="5">
          <div className="snum">Step Five</div>
          <h2 className="stitle">Constructive Plans</h2>
          <p className="sdesc">Plan together <em>one way</em> each of you can make it better next time. Stay calm. Be as agreeable as possible.</p>
          <label className="flabel">One thing my partner can do next time to help</label>
          <textarea
            className="field"
            placeholder="It would help if you…"
            value={state.fields.p_partner || ""}
            onChange={(e) => setField("p_partner", e.target.value)}
          />
          <label className="flabel">One thing I can do next time to make it better</label>
          <textarea
            className="field"
            placeholder="Next time, I'll…"
            value={state.fields.p_me || ""}
            onChange={(e) => setField("p_me", e.target.value)}
          />
          <label className="flabel">What I need to put this behind me and move on</label>
          <textarea
            className="field"
            placeholder="To let this go I need…"
            value={state.fields.p_move_on || ""}
            onChange={(e) => setField("p_move_on", e.target.value)}
          />
          <div className="util">
            <button className="lnk" type="button" onClick={() => setModalOpen(true)}>Export &amp; copy</button>
            <button className="lnk w" type="button" onClick={handleReset}>Reset everything</button>
          </div>
        </section>

        {/* Horsemen Reference */}
        <section className={`step${state.step === "H" ? " act" : ""}`} data-step="H">
          <div className="snum">Reference</div>
          <h2 className="stitle">The Four Horsemen &amp; Their Antidotes</h2>
          <p className="sdesc">Strong indicators that a fight is going off the rails — and what to do instead.</p>
          {HORSEMEN.map((h) => (
            <div className="h-row" key={h.name}>
              <div className="hm">{h.name}</div>
              <div className="d">{h.description}</div>
              <div className="arr">↓</div>
              <div className="anti">{h.antidote}</div>
              <div className="ad">{h.antidoteDesc}</div>
            </div>
          ))}
          <p className="hint" style={{ marginTop: 18, textAlign: "center" }}>
            Adapted from Dr. John Gottman / The Gottman Institute &amp; The Couples College.
          </p>
        </section>

        <hr className="divider" />
        <p className="hint" style={{ textAlign: "center", fontSize: 12 }}>
          Your responses save automatically on this device. Nothing leaves your phone.
        </p>
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
