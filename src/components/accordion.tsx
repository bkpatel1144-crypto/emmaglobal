import { Plus } from "lucide-react";
import { useId, useState } from "react";

export function Accordion({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const base = useId();

  return (
    <div className="accordion">
      {items.map((item, index) => {
        const id = `${base}-${index}`;
        const isOpen = open === id;
        return (
          <div className={`accordion-item${isOpen ? " open" : ""}`} key={item.q}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                className="accordion-trigger"
                aria-expanded={isOpen}
                aria-controls={`${id}-panel`}
                onClick={() => setOpen(isOpen ? null : id)}
              >
                <span>{item.q}</span>
                <Plus aria-hidden="true" />
              </button>
            </h3>
            <div className="accordion-panel" id={`${id}-panel`} role="region">
              <div>
                <div className="accordion-body">
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
