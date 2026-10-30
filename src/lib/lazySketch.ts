import { lazy } from "react";
import { SketchMeta } from "../types/Sketch";

const RELOADED_FLAG = "sketches:reloaded-for-chunk";

const getStorage = () => {
  try {
    return window.sessionStorage;
  } catch {
    return null; // blocked by privacy settings
  }
};

/**
 * React.lazy for a sketch, surviving redeploys: chunk names are hashed, so a tab opened before a deploy can ask for
 * files that are gone (vercel.json then answers with index.html, which the browser refuses to run as a module).
 * Reloading picks up the new names. The flag stops a chunk that's really broken from reloading forever; that error
 * reaches SketchErrorBoundary instead.
 */
export const lazySketch = (load: SketchMeta["load"]) =>
  lazy(() =>
    load().then(
      (module) => {
        getStorage()?.removeItem(RELOADED_FLAG);
        return module;
      },
      (error) => {
        const storage = getStorage();
        if (!storage || storage.getItem(RELOADED_FLAG)) throw error;
        storage.setItem(RELOADED_FLAG, "1");
        window.location.reload();
        return new Promise<never>(() => {}); // stay on the loader until the page is replaced
      },
    ),
  );
