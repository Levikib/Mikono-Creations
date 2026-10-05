import { Character } from "./Character";

/**
 * The lane under the hero buttons on the home page. On every full load a rabbit rises out of the grass under a stitched arrow and a
 * "Start here" pill that point up at Shop, then it stays and performs on a 9 s loop (a hop, a wave, an ear flick, a blink) for as long as the
 * page is open. It is server rendered and pure CSS (components/fx/fx.css): it starts the frame the intro splash leaves (held paused while
 * html[data-splash=on], see public/splash-gate.js) and needs no engine. A tap does not end it. Reduced motion shows the rabbit, arrow and pill
 * standing still; the Animals switch off hides all of it. The lane has a fixed height, so the page never shifts. Decorative parts are aria-hidden.
 */
export function WelcomeLane() {
  return (
    <div className="fx-lane" aria-hidden="true">
      <Character sprite="rabbit" inline role="rise" prio={5} size={62} at={10} seed="welcome" />
      <span className="fx-lane-grass" />
      <svg className="fx-lane-arrow" viewBox="0 0 54 36" aria-hidden="true" focusable="false">
        <path d="M50 33C38 31 20 26 9 8" fill="none" stroke="#b0654a" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />
        <path d="M9 8l-1.5 9M9 8l8.5 3.5" fill="none" stroke="#b0654a" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="fx-lane-pill">Start here</span>
    </div>
  );
}
