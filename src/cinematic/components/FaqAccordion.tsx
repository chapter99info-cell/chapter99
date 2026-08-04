import { useState } from 'react';
import type { FaqSection } from '../data/faq';
import { useTranslation } from '../i18n/LanguageContext';
import { useFadeUp } from '../hooks/useFadeUp';

type FaqAccordionProps = {
  section: FaqSection;
};

export function FaqAccordion({ section }: FaqAccordionProps) {
  const { t } = useTranslation();
  const wrapRef = useFadeUp(0);
  const [activeCat, setActiveCat] = useState(section.tabs[0]?.cat ?? '');
  const [openId, setOpenId] = useState<string | null>(null);

  const decode = (html: string) =>
    html.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

  return (
    <div ref={wrapRef} className="faq-wrap fadeup">
      <div className="faq-tabs">
        {section.tabs.map((tab) => (
          <button
            key={tab.cat}
            type="button"
            className={`faq-tab${activeCat === tab.cat ? ' active' : ''}`}
            onClick={() => {
              setActiveCat(tab.cat);
              setOpenId(null);
            }}
          >
            {decode(t(tab.label))}
          </button>
        ))}
      </div>
      <div className="faq-list">
        {section.items.map((item) => {
          const shown = item.cat === activeCat;
          const open = openId === item.id;
          return (
            <div
              key={item.id}
              className={`faq-item${shown ? ' shown' : ''}${open ? ' open' : ''}`}
            >
              <button
                type="button"
                className="faq-q"
                onClick={() => setOpenId(open ? null : item.id)}
              >
                <span>{decode(t(item.question))}</span>
                <svg
                  className="chev"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className="faq-a">
                <div className="faq-a-inner">
                  <ul>
                    {item.answers.map((answer, i) => (
                      <li key={i}>{t(answer)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
