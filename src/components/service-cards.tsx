import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Play, Video, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import type { Service, ServiceItem } from "../lib/site-data";

/**
 * The four service cards on the home page.
 *
 * Only items that have a real clip are expandable — the rest are plain list
 * rows. There is no "video coming soon" placeholder, and no clip is reused
 * across items. At most one video is open at a time across all four cards.
 */
export function ServiceCards({ services }: { services: Service[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const videos = useRef(new Map<string, HTMLVideoElement | null>());
  const rows = useRef(new Map<string, HTMLLIElement | null>());

  const toggle = useCallback((key: string) => {
    setOpenKey((current) => {
      if (current) videos.current.get(current)?.pause();
      if (current === key) return null;

      const video = videos.current.get(key);
      if (video) {
        video.currentTime = 0;
        void video.play().catch(() => {
          /* autoplay can be refused; the controls still work */
        });
      }
      // Let the panel finish expanding before pulling it into view.
      window.setTimeout(() => {
        rows.current.get(key)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 220);
      return key;
    });
  }, []);

  return (
    <div className="services-grid">
      {services.map((service) => {
        const Icon = service.icon;
        return (
          <article className={`svc-card ${service.dot}`} key={service.slug}>
            <div className="svc-header">
              <span className={`svc-icon-wrap ${service.tone}`}>
                <Icon aria-hidden="true" />
              </span>
              <div className="svc-title-wrap">
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
              </div>
            </div>
            <div className="svc-divider" />
            <div className="svc-features">
              <ul>
                {service.items.map((item) => {
                  const key = `${service.slug}::${item.label}`;
                  return item.video ? (
                    <VideoRow
                      key={key}
                      item={item}
                      open={openKey === key}
                      onToggle={() => toggle(key)}
                      registerVideo={(el) => videos.current.set(key, el)}
                      registerRow={(el) => rows.current.set(key, el)}
                    />
                  ) : (
                    <li className="svc-item-static" key={key}>
                      <Check aria-hidden="true" />
                      <span>{item.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="svc-footer">
              <Link to="/services/$service" params={{ service: service.slug }}>
                Explore {service.shortTitle}
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function VideoRow({
  item,
  open,
  onToggle,
  registerVideo,
  registerRow,
}: {
  item: ServiceItem;
  open: boolean;
  onToggle: () => void;
  registerVideo: (el: HTMLVideoElement | null) => void;
  registerRow: (el: HTMLLIElement | null) => void;
}) {
  return (
    <li className={`svc-item${open ? " open" : ""}`} ref={registerRow}>
      <button type="button" className="svc-item-row" onClick={onToggle} aria-expanded={open}>
        <span className="svc-item-dot">
          <Video aria-hidden="true" />
        </span>
        <span className="svc-item-text">{item.label}</span>
        <span className="svc-item-icon">
          {open ? <X aria-hidden="true" /> : <Play aria-hidden="true" />}
        </span>
      </button>
      <div className="svc-video-panel">
        <div className="svc-video-panel-inner">
          <div className="svc-video-box">
            <video ref={registerVideo} controls playsInline preload="none" src={item.video} />
          </div>
          <p className="svc-video-caption">{item.detail}</p>
        </div>
      </div>
    </li>
  );
}
