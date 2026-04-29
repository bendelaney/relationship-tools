"use client";

interface ChipGroupProps {
  items: string[];
  selected: string[];
  onToggle: (label: string) => void;
}

export default function ChipGroup({ items, selected, onToggle }: ChipGroupProps) {
  return (
    <div className="chips">
      {items.map((label) => (
        <button
          key={label}
          type="button"
          className={`chip${selected.includes(label) ? " on" : ""}`}
          onClick={() => onToggle(label)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
