const TRANSITION_DURATION_SECONDS = 1.1;
const AUTOPLAY_HOLD_SECONDS = 4.5;
const COMMAND_EVENT = "devhut:presentation-command";

export const PRESENTATION_STOPS = Object.freeze([
  Object.freeze({ id: "jungle-overview", title: "Jungle overview", caption: "A winding trail crosses the jungle.", position: [0, 17, 25], target: [0, 1, -38], annotationIds: ["trail-direction"] }),
  Object.freeze({ id: "trail-bend", title: "Trail bend", caption: "The path curves between the trees.", position: [-13, 8, 2], target: [-4, 1, -50], annotationIds: ["curving-trail"] }),
  Object.freeze({ id: "river-crossing", title: "River crossing", caption: "The river interrupts the running lane.", position: [13, 9, -36], target: [0, 1, -83], annotationIds: ["river-hazard"] }),
  Object.freeze({ id: "forest-canopy", title: "Forest canopy", caption: "The canopy frames the open trail.", position: [-2, 19, -74], target: [0, 2, -124], annotationIds: ["canopy-layer"] }),
  Object.freeze({ id: "trail-horizon", title: "Trail horizon", caption: "The trail continues into the distance.", position: [12, 11, -135], target: [0, 1, -190], annotationIds: ["trail-horizon-label"] }),
]);

export const PRESENTATION_ANNOTATIONS = Object.freeze([
  Object.freeze({ id: "trail-direction", label: "Trail direction: follow the path through the jungle." }),
  Object.freeze({ id: "curving-trail", label: "Trail bend: the route changes direction here." }),
  Object.freeze({ id: "river-hazard", label: "River crossing: a water hazard crosses the path." }),
  Object.freeze({ id: "canopy-layer", label: "Canopy: the trees frame the route from above." }),
  Object.freeze({ id: "trail-horizon-label", label: "Trail horizon: the route continues ahead." }),
]);

const STOP_BY_ID = new Map(PRESENTATION_STOPS.map((stop) => [stop.id, stop]));
const ANNOTATION_BY_ID = new Map(PRESENTATION_ANNOTATIONS.map((annotation) => [annotation.id, annotation]));
const ALLOWED_COMMANDS = new Set(["goto", "next", "previous", "play", "pause", "getState", "openAnnotation", "closeAnnotation"]);

export function resolvePresentationStopIndex(currentIndex, command) {
  if (!Number.isInteger(currentIndex) || currentIndex < 0 || currentIndex >= PRESENTATION_STOPS.length) return -1;
  if (command === "next") return Math.min(currentIndex + 1, PRESENTATION_STOPS.length - 1);
  if (command === "previous") return Math.max(currentIndex - 1, 0);
  return currentIndex;
}

export function isPresentationCommandDetail(detail) {
  if (!detail || typeof detail !== "object" || Array.isArray(detail) || !ALLOWED_COMMANDS.has(detail.command)) return false;
  const allowedKeys = detail.command === "goto" ? ["command", "stopId"]
    : detail.command === "openAnnotation" || detail.command === "closeAnnotation" ? ["command", "annotationId"]
      : ["command"];
  if (Object.keys(detail).some((key) => !allowedKeys.includes(key))) return false;
  if (detail.command === "goto") return typeof detail.stopId === "string" && STOP_BY_ID.has(detail.stopId);
  if (detail.command === "openAnnotation" || detail.command === "closeAnnotation") {
    return typeof detail.annotationId === "string" && ANNOTATION_BY_ID.has(detail.annotationId);
  }
  return true;
}

function setStateAttributes(root, state) {
  root.dataset.presentationCurrentStop = state.currentStop;
  root.dataset.presentationTransition = state.transition;
  root.dataset.presentationPlayback = state.playback;
  root.dataset.presentationActiveAnnotations = JSON.stringify([...state.activeAnnotations]);
}

export function createPresentationControl({ root, camera, reducedMotion } = {}) {
  if (!root || !camera) throw new TypeError("Presentation control requires a root element and Three.js camera.");

  const prefersReducedMotion = reducedMotion ?? (typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const state = {
    currentIndex: 0,
    transition: "complete",
    playback: "stopped",
    activeAnnotations: new Set(),
    elapsed: 0,
    autoplayElapsed: 0,
    fromPosition: null,
    fromTarget: null,
    toPosition: null,
    toTarget: null,
  };
  const caption = document.createElement("div");
  caption.setAttribute("aria-live", "polite");
  caption.setAttribute("aria-atomic", "true");
  caption.setAttribute("data-presentation-caption", "");
  Object.assign(caption.style, {
    position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px",
    overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: "0",
  });
  root.appendChild(caption);

  const currentStop = () => PRESENTATION_STOPS[state.currentIndex];
  const updateCaption = () => {
    const stop = currentStop();
    const annotationText = [...state.activeAnnotations]
      .map((id) => ANNOTATION_BY_ID.get(id)?.label)
      .filter(Boolean);
    caption.textContent = [stop.title, stop.caption, ...annotationText].join(". ");
  };
  const publishState = () => {
    setStateAttributes(root, {
      currentStop: currentStop().id,
      transition: state.transition,
      playback: state.playback,
      activeAnnotations: state.activeAnnotations,
    });
    updateCaption();
  };
  const moveTo = (index) => {
    if (index < 0 || index >= PRESENTATION_STOPS.length || index === state.currentIndex) return;
    const stop = PRESENTATION_STOPS[index];
    state.currentIndex = index;
    state.elapsed = 0;
    state.autoplayElapsed = 0;
    state.fromPosition = camera.position.clone();
    state.fromTarget = camera.getWorldDirection ? camera.position.clone().add(camera.getWorldDirection(camera.position.clone()).multiplyScalar(10)) : camera.position.clone();
    state.toPosition = stop.position;
    state.toTarget = stop.target;
    state.transition = prefersReducedMotion ? "complete" : "animating";
    if (prefersReducedMotion) {
      camera.position.set(...stop.position);
      camera.lookAt(...stop.target);
    }
    publishState();
  };

  // Establish a deterministic opening view only in the explicitly enabled presentation route.
  camera.position.set(...PRESENTATION_STOPS[0].position);
  camera.lookAt(...PRESENTATION_STOPS[0].target);
  publishState();

  const onCommand = (event) => {
    const detail = event?.detail;
    if (!isPresentationCommandDetail(detail)) return;
    switch (detail.command) {
      case "goto": moveTo(PRESENTATION_STOPS.findIndex((stop) => stop.id === detail.stopId)); break;
      case "next": moveTo(resolvePresentationStopIndex(state.currentIndex, "next")); break;
      case "previous": moveTo(resolvePresentationStopIndex(state.currentIndex, "previous")); break;
      case "play": state.playback = "playing"; state.autoplayElapsed = 0; publishState(); break;
      case "pause": state.playback = "paused"; publishState(); break;
      case "openAnnotation": state.activeAnnotations.add(detail.annotationId); publishState(); break;
      case "closeAnnotation": state.activeAnnotations.delete(detail.annotationId); publishState(); break;
      case "getState": publishState(); break;
      default: break;
    }
  };
  root.addEventListener(COMMAND_EVENT, onCommand);

  return {
    update(dt) {
      if (state.transition === "animating") {
        state.elapsed = Math.min(state.elapsed + Math.max(0, dt), TRANSITION_DURATION_SECONDS);
        const progress = state.elapsed / TRANSITION_DURATION_SECONDS;
        const eased = progress * progress * (3 - 2 * progress);
        camera.position.set(
          state.fromPosition.x + (state.toPosition[0] - state.fromPosition.x) * eased,
          state.fromPosition.y + (state.toPosition[1] - state.fromPosition.y) * eased,
          state.fromPosition.z + (state.toPosition[2] - state.fromPosition.z) * eased,
        );
        const targetX = state.fromTarget.x + (state.toTarget[0] - state.fromTarget.x) * eased;
        const targetY = state.fromTarget.y + (state.toTarget[1] - state.fromTarget.y) * eased;
        const targetZ = state.fromTarget.z + (state.toTarget[2] - state.fromTarget.z) * eased;
        camera.lookAt(targetX, targetY, targetZ);
        if (progress >= 1) {
          state.transition = "complete";
          publishState();
        } else {
          root.dataset.presentationTransition = "animating";
        }
      }
      if (state.playback === "playing" && state.transition !== "animating") {
        state.autoplayElapsed += Math.max(0, dt);
        if (state.autoplayElapsed >= AUTOPLAY_HOLD_SECONDS) {
          const next = resolvePresentationStopIndex(state.currentIndex, "next");
          if (next === state.currentIndex) state.playback = "stopped";
          else moveTo(next);
          publishState();
        }
      }
    },
    getState() {
      return {
        currentStop: currentStop().id,
        transition: state.transition,
        playback: state.playback,
        activeAnnotations: [...state.activeAnnotations],
      };
    },
    dispose() {
      root.removeEventListener(COMMAND_EVENT, onCommand);
      caption.remove();
      delete root.dataset.presentationCurrentStop;
      delete root.dataset.presentationTransition;
      delete root.dataset.presentationPlayback;
      delete root.dataset.presentationActiveAnnotations;
    },
  };
}
