/**
 * Route order is linear: 11 = Documents, 12 = Preferences.
 * Backend uses 11 = Preferences, 12 = Documents; these helpers map between them.
 */
export function getDisplayStep(step: number): number {
  return step;
}

/** Route step → backend currentStep (for saveStep / API). */
export function routeToBackendStep(route: number): number {
  if (route === 11) return 12;
  if (route === 12) return 11;
  return route;
}

/** Backend currentStep → route step (when opening FormStep). */
export function backendStepToRoute(backend: number): number {
  if (backend === 11) return 12;
  if (backend === 12) return 11;
  return backend;
}
