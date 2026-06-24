// src/components/OrderTracker.jsx
import React, { useEffect, useState, useRef } from "react";

const STAGES = [
  { id: "placed",   label: "Order Placed",     icon: "✅", threshold: 1.0 },
  { id: "progress", label: "In Progress",       icon: "👨‍🍳", threshold: 0.75 },
  { id: "delivery", label: "Out for Delivery",  icon: "🛵", threshold: 0.30 },
  { id: "done",     label: "Delivered",         icon: "🎉", threshold: 0    },
];

function getStageIndex(remaining, total) {
  if (total <= 0) return 3;
  const ratio = remaining / total;
  if (ratio > 0.75) return 0;
  if (ratio > 0.30) return 1;
  if (ratio > 0)    return 2;
  return 3;
}

function formatTime(secs) {
  if (secs <= 0) return "00:00";
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function OrderTracker({
  orderNumber,
  totalSeconds,
  remainingSeconds: initialRemaining,
  onDismiss,
  compact = false,
}) {
  // Seed from prop on first render; the interval drives it down from there
  const [remaining, setRemaining] = useState(
    initialRemaining !== undefined ? initialRemaining : totalSeconds
  );

  // If the parent passes a fresh remainingSeconds (e.g. on page navigate),
  // resync only if the new value is meaningfully different (avoids flicker)
  const prevInitialRef = useRef(initialRemaining);
  useEffect(() => {
    if (
      initialRemaining !== undefined &&
      initialRemaining !== prevInitialRef.current
    ) {
      prevInitialRef.current = initialRemaining;
      setRemaining(initialRemaining);
    }
  }, [initialRemaining]);

  // Single interval that always ticks — no dependency on remaining value
  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []); // runs once on mount

  const stageIndex  = getStageIndex(remaining, totalSeconds);
  const progress    = totalSeconds > 0
    ? Math.min(100, Math.round(((totalSeconds - remaining) / totalSeconds) * 100))
    : 100;
  const isDelivered = remaining <= 0;

  /* ── Compact floating banner ── */
  if (compact) {
    return (
      <div className="order-tracker-banner" role="status" aria-live="polite">
        <div className="tracker-banner-inner">
          <span className="tracker-banner-icon">{STAGES[stageIndex].icon}</span>
          <div className="tracker-banner-text">
            <strong>Order #{orderNumber}</strong>
            <span>{STAGES[stageIndex].label}</span>
          </div>
          {!isDelivered && (
            <span className="tracker-banner-time">{formatTime(remaining)}</span>
          )}
          <button
            className="tracker-banner-close"
            onClick={onDismiss}
            aria-label="Dismiss order tracker"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  /* ── Full card (bill page) ── */
  return (
    <div className="order-tracker-card" role="status" aria-live="polite">
      <div className="tracker-header">
        <h3>🚀 Live Order Tracking</h3>
        <span className="tracker-order-num">Order #{orderNumber}</span>
      </div>

      {/* Progress bar */}
      <div className="tracker-progress-wrap">
        <div
          className="tracker-progress-bar"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Stage steps */}
      <div className="tracker-stages">
        {STAGES.map((stage, idx) => {
          const isDone   = idx < stageIndex;
          const isActive = idx === stageIndex;
          return (
            <div
              key={stage.id}
              className={`tracker-stage${isDone ? " done" : ""}${isActive ? " active" : ""}`}
            >
              <div className="tracker-stage-icon">{stage.icon}</div>
              <div className="tracker-stage-label">{stage.label}</div>
            </div>
          );
        })}
      </div>

      {/* Countdown */}
      <div className="tracker-eta">
        {isDelivered ? (
          <p className="tracker-delivered">🎉 Your order has been delivered! Enjoy!</p>
        ) : (
          <>
            <span className="tracker-eta-label">Estimated time remaining</span>
            <span className="tracker-eta-time">{formatTime(remaining)}</span>
          </>
        )}
      </div>

      {onDismiss && (
        <button className="tracker-dismiss" onClick={onDismiss}>
          ✕ Dismiss
        </button>
      )}
    </div>
  );
}
