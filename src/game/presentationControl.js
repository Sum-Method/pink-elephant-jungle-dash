const TRANSITION_DURATION_SECONDS = 1.1;
const AUTOPLAY_HOLD_SECONDS = 4.5;
const COMMAND_EVENT = "devhut:presentation-command";

export const PRESENTATION_STOPS = Object.freeze([
  Object.freeze({ id: "jungle-overview", title: "Jungle overview", caption: "A winding trail crosses the jungle.", cameraZ: 15, targetZ: -28, height: 17, xOffset: 0, annotationIds: ["trail-direction"] }),
  Object.freeze({ id: "trail-bend", title: "Trail bend", caption: "The path curves between the trees.", cameraZ: -57, targetZ: -82, height: 10, xOffset: -13, annotationIds: ["curving-trail"] }),
  Object.freeze({ id: "river-crossing", title: "River crossing", caption: "The river interrupts the running lane.", cameraZ: -173, targetZ: -202, height: 12, xOffset: 14, annotationIds: ["river-hazard"] }),
  Object.freeze({ id: "forest-canopy", title: "Forest canopy", caption: "The canopy frames the open trail.", cameraZ: -292, targetZ: -326, height: 21, xOffset: -7, annotationIds: ["canopy-layer"] }),
  Object.freeze({ id: "trail-horizon", title: "Trail horizon", caption: "The trail continues into the distance.", cameraZ: -411, targetZ: -450, height: 12, xOffset: 11, annotationIds: ["trail-horizon-label"] }),
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

export function getPresentationStopPose(stop, getTrackCenter = () => 0) {
  return {
    position: [getTrackCenter(stop.cameraZ) + stop.xOffset, stop.height, stop.cameraZ],
    target: [getTrackCenter(stop.targetZ), 1.5, stop.targetZ],
  };
}

export function getPresentationKeyboardCommand(key) {
  if (key === "ArrowLeft") return { command: "previous" };
  if (key === "ArrowRight") return { command: "next" };
  if (key === "Home") return { command: "goto", stopId: PRESENTATION_STOPS[0].id };
  if (key === "End") return { command: "goto", stopId: PRESENTATION_STOPS[PRESENTATION_STOPS.length - 1].id };
  return null;
}

function setStateAttributes(root, state) {
  root.dataset.presentationCurrentStop = state.currentStop;
  root.dataset.presentationTransition = state.transition;
  root.dataset.presentationPlayback = state.playback;
  root.dataset.presentationActiveAnnotations = JSON.stringify([...state.activeAnnotations]);
}

export function createPresentationControl({ root, camera, reducedMotion, getTrackCenter } = {}) {
  if (!root || !camera) throw new TypeError("Presentation control requires a root element and Three.js camera.");

  const prefersReducedMotion = Boolean(reducedMotion);
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
  root.tabIndex = 0;
  const caption = document.createElement("div");
  caption.setAttribute("aria-live", "polite");
  caption.setAttribute("aria-atomic", "true");
  caption.setAttribute("data-presentation-caption", "");
  Object.assign(caption.style, {
    position: "absolute", left: "16px", bottom: "16px", zIndex: "20", maxWidth: "min(640px, calc(100% - 32px))",
    padding: "12px 16px", borderRadius: "10px", color: "#fff", background: "rgba(4, 20, 10, .88)",
    border: "1px solid rgba(255,255,255,.55)", font: "600 16px/1.4 system-ui, sans-serif", pointerEvents: "none",
  });
  caption.textContent = "";

  const controls = document.createElement("nav");
  controls.setAttribute("aria-label", "Presentation controls");
  controls.setAttribute("data-presentation-controls", "");
  Object.assign(controls.style, {
    position: "absolute", top: "16px", right: "16px", zIndex: "20", display: "flex", flexWrap: "wrap",
    gap: "8px", padding: "10px", borderRadius: "10px", background: "rgba(4, 20, 10, .88)",
    border: "1px solid rgba(255,255,255,.55)",
  });
  const makeButton = (label, command) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-label", label);
    button.setAttribute("data-presentation-control", command);
    Object.assign(button.style, {
      minHeight: "42px", padding: "8px 12px", border: "2px solid #fff", borderRadius: "7px",
      color: "#07180d", background: "#f1f5f9", font: "700 14px system-ui, sans-serif", cursor: "pointer",
    });
    button.addEventListener("focus", () => { button.style.outline = "3px solid #facc15"; button.style.outlineOffset = "2px"; });
    button.addEventListener("blur", () => { button.style.outline = ""; });
    button.addEventListener("click", () => dispatchCommand({ command }));
    controls.appendChild(button);
    return button;
  };
  const previousButton = makeButton("Previous", "previous");
  const nextButton = makeButton("Next", "next");
  makeButton("Play", "play");
  makeButton("Pause", "pause");
  const annotationButton = document.createElement("button");
  annotationButton.type = "button";
  annotationButton.textContent = "Show annotation";
  annotationButton.setAttribute("aria-label", "Show current annotation");
  annotationButton.setAttribute("data-presentation-control", "annotation");
  Object.assign(annotationButton.style, {
    minHeight: "42px", padding: "8px 12px", border: "2px solid #fff", borderRadius: "7px",
    color: "#07180d", background: "#f1f5f9", font: "700 14px system-ui, sans-serif", cursor: "pointer",
  });
  annotationButton.addEventListener("click", () => {
    const annotationId = currentStop().annotationIds[0];
    dispatchCommand({ command: state.activeAnnotations.has(annotationId) ? "closeAnnotation" : "openAnnotation", annotationId });
  });
  controls.appendChild(annotationButton);
  root.append(caption, controls);

  const currentStop = () => PRESENTATION_STOPS[state.currentIndex];
  const updateCaption = () => {
    const stop = currentStop();
    const annotationText = [...state.activeAnnotations]
      .map((id) => ANNOTATION_BY_ID.get(id)?.label)
      .filter(Boolean);
    const activeAnnotation = annotationText.length ? `Annotation: ${annotationText.join(". ")}` : "Use Show annotation for a scene label.";
    caption.textContent = `${stop.title} — ${stop.caption} ${activeAnnotation}`;
    annotationButton.textContent = state.activeAnnotations.has(stop.annotationIds[0]) ? "Hide annotation" : "Show annotation";
    annotationButton.setAttribute("aria-label", `${state.activeAnnotations.has(stop.annotationIds[0]) ? "Hide" : "Show"} annotation for ${stop.title}`);
    previousButton.disabled = state.currentIndex === 0;
    nextButton.disabled = state.currentIndex === PRESENTATION_STOPS.length - 1;
    for (const button of [previousButton, nextButton]) {
      button.style.opacity = button.disabled ? "0.5" : "1";
      button.style.cursor = button.disabled ? "not-allowed" : "pointer";
    }
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
    state.activeAnnotations.clear();
    state.fromPosition = camera.position.clone();
    state.fromTarget = camera.getWorldDirection ? camera.position.clone().add(camera.getWorldDirection(camera.position.clone()).multiplyScalar(10)) : camera.position.clone();
    const pose = getPresentationStopPose(stop, getTrackCenter);
    state.toPosition = pose.position;
    state.toTarget = pose.target;
    state.transition = prefersReducedMotion ? "complete" : "animating";
    if (prefersReducedMotion) {
      camera.position.set(...pose.position);
      camera.lookAt(...pose.target);
    }
    publishState();
  };
  const dispatchCommand = (detail) => {
    root.dispatchEvent(new CustomEvent(COMMAND_EVENT, { detail }));
  };

  // Establish a deterministic opening view only in the explicitly enabled presentation route.
  const openingPose = getPresentationStopPose(PRESENTATION_STOPS[0], getTrackCenter);
  camera.position.set(...openingPose.position);
  camera.lookAt(...openingPose.target);
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
  const onKeyDown = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName)) return;
    const command = getPresentationKeyboardCommand(event.key);
    if (!command) return;
    event.preventDefault();
    dispatchCommand(command);
  };
  window.addEventListener("keydown", onKeyDown);

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
      window.removeEventListener("keydown", onKeyDown);
      caption.remove();
      controls.remove();
      delete root.dataset.presentationCurrentStop;
      delete root.dataset.presentationTransition;
      delete root.dataset.presentationPlayback;
      delete root.dataset.presentationActiveAnnotations;
      root.removeAttribute("tabindex");
    },
  };
}
