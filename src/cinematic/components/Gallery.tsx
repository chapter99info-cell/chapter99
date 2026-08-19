import { useEffect, useRef, useState } from 'react';
import {
  galleryCategoryLabel,
  galleryCopy,
  galleryItems,
  galleryTabs,
  galleryVideoTabs,
} from '../data/gallery';
import { useFadeUp } from '../hooks/useFadeUp';
import { useTranslation } from '../i18n/LanguageContext';

export function Gallery() {
  const { t } = useTranslation();
  const wrapRef = useFadeUp(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(galleryTabs[0].id);
  const [playing, setPlaying] = useState(false);
  const item = galleryItems[activeIndex];
  const showVideo = galleryVideoTabs.has(activeTab) && Boolean(item.videoSrc);

  // Reset playback when changing item or leaving a video tab
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setPlaying(false);
  }, [activeIndex, activeTab]);

  const go = (i: number) => {
    setActiveIndex((i + galleryItems.length) % galleryItems.length);
  };

  async function togglePlay() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      try {
        await el.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  return (
    <section id="gallery">
      <div ref={wrapRef} className="gallery-window fadeup">
        <div className="gallery-top">
          <div>
            <div
              className="gallery-crumb"
              dangerouslySetInnerHTML={{ __html: t(galleryCopy.crumb) }}
            />
            <div className="gallery-title">{t(galleryCopy.title)}</div>
          </div>
          <p className="gallery-desc">{t(galleryCopy.desc)}</p>
        </div>

        <div className="gallery-tabs">
          {galleryTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`gallery-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {t(tab.label)}
            </button>
          ))}
        </div>

        <div className="gallery-app">
          <div className="gallery-side" id="gallerySide">
            {galleryItems.map((g, i) => (
              <button
                key={g.name}
                type="button"
                className={i === activeIndex ? 'active' : undefined}
                onClick={() => setActiveIndex(i)}
              >
                {g.name}
              </button>
            ))}
          </div>
          <div className="gallery-main">
            <div
              className={`gallery-frame${showVideo ? ' has-video' : ''}`}
              id="galleryFrame"
              style={showVideo ? undefined : { background: item.grad }}
            >
              {showVideo && item.videoSrc ? (
                <video
                  key={item.videoSrc + activeIndex}
                  ref={videoRef}
                  className="gallery-video"
                  src={item.videoSrc}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onClick={togglePlay}
                />
              ) : null}

              {showVideo ? (
                <button
                  type="button"
                  className={`gallery-play${playing ? ' is-playing' : ''}`}
                  aria-label={playing ? 'Pause video' : 'Play video'}
                  onClick={togglePlay}
                >
                  {playing ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <rect x="6" y="5" width="4" height="14" rx="1" />
                      <rect x="14" y="5" width="4" height="14" rx="1" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <polygon points="6,4 20,12 6,20" />
                    </svg>
                  )}
                </button>
              ) : (
                <span className="gallery-play" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6,4 20,12 6,20" />
                  </svg>
                </span>
              )}

              <div className="cap">
                {item.category ? (
                  <div className="gallery-cat">{t(galleryCategoryLabel[item.category])}</div>
                ) : null}
                <div className="t">{t(item.title)}</div>
                <div className="s">{t(item.sub)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="gallery-nav">
          <button type="button" aria-label="ก่อนหน้า" onClick={() => go(activeIndex - 1)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button type="button" aria-label="ถัดไป" onClick={() => go(activeIndex + 1)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
