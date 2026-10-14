import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SOURCE_PARAM,
  SITE_ORIGIN,
  normalizeSource,
  safeTarget,
  buildDestination,
  goUrl,
  runGo,
  attachSourceToClicks,
  waitForUmami,
  APP_STORE_ORIGINS,
  APP_STORE_URL,
  appStoreTarget,
} from "./sourceAttribution.mjs";

test("SOURCE_PARAM and SITE_ORIGIN", () => {
  assert.equal(SOURCE_PARAM, "src");
  assert.equal(SITE_ORIGIN, "https://event-stories.12f.dk");
});

test("normalizeSource", () => {
  assert.equal(normalizeSource("instagram"), "instagram");
  assert.equal(normalizeSource(" Instagram "), "instagram");
  assert.equal(normalizeSource("x"), "x");
  assert.equal(normalizeSource(""), null);
  assert.equal(normalizeSource(null), null);
  assert.equal(normalizeSource("a b"), null);
  assert.equal(normalizeSource("<script>"), null);
  assert.equal(normalizeSource("-lead"), null);
  assert.equal(normalizeSource("a".repeat(41)), null);
  assert.equal(normalizeSource("12345"), "12345");
  assert.equal(normalizeSource("instagram-story"), "instagram-story");
  assert.equal(normalizeSource("ig_story_x"), "ig_story_x");
});

test("safeTarget", () => {
  assert.equal(safeTarget(null), "/");
  assert.equal(safeTarget("/da/"), "/da/");
  assert.equal(safeTarget("/packing-list/?a=1#x"), "/packing-list/?a=1#x");
  assert.equal(safeTarget("https://evil.com"), "/");
  assert.equal(safeTarget("//evil.com"), "/");
  assert.equal(safeTarget("/\\evil.com"), "/");
  assert.equal(safeTarget("javascript:alert(1)"), "/");
  assert.equal(safeTarget("da/"), "/");
  assert.equal(safeTarget("/go/"), "/");
  assert.equal(safeTarget("/go/?src=x"), "/");
  assert.equal(safeTarget("/"), "/");
  assert.equal(safeTarget("/blog/slug/"), "/blog/slug/");
});

test("buildDestination", () => {
  assert.deepEqual(buildDestination("?src=instagram"), {
    src: "instagram",
    path: "/?src=instagram",
  });
  assert.deepEqual(buildDestination("?src=facebook&to=/da/"), {
    src: "facebook",
    path: "/da/?src=facebook",
  });
  // evil to target falls back to /
  assert.deepEqual(buildDestination("?to=//evil.com&src=tiktok"), {
    src: "tiktok",
    path: "/?src=tiktok",
  });
  assert.deepEqual(buildDestination(""), { src: null, path: "/" });
  assert.deepEqual(buildDestination("?src=bad value"), { src: null, path: "/" });
  // src is set (not appended twice)
  const d = buildDestination("?to=/da/?src=evil&src=x");
  assert.equal(d.src, "x");
  assert.ok(d.path.endsWith("src=x"));
  assert.equal((d.path.match(/src=/g) || []).length, 1);
  // case normalized in path
  assert.deepEqual(buildDestination("?src=INSTAGRAM"), {
    src: "instagram",
    path: "/?src=instagram",
  });
});

test("goUrl", () => {
  assert.equal(
    goUrl("instagram"),
    "https://event-stories.12f.dk/go/?src=instagram"
  );
  assert.equal(
    goUrl("instagram", "/da/"),
    "https://event-stories.12f.dk/go/?src=instagram&to=%2Fda%2F"
  );
  assert.throws(() => goUrl("Bad Slug"));
  assert.throws(() => goUrl(""));
});

test("runGo: track before redirect, redirect exactly once", async () => {
  const calls = [];
  const redirect = (p) => calls.push("redirect:" + p);
  const track = (n, d) => calls.push(`track:${n}:${d.src}`);
  runGo({
    search: "?src=instagram",
    loadTracker: async () => track,
    redirect,
    setTimer: () => {},
  });
  await new Promise((r) => setImmediate(r));
  await new Promise((r) => setImmediate(r));
  assert.deepEqual(calls, [
    "track:social-landing:instagram",
    "redirect:/?src=instagram",
  ]);
  assert.equal(calls.filter((c) => c.startsWith("redirect:")).length, 1);
});

test("runGo: no tracker, still redirects once", async () => {
  const calls = [];
  const redirect = (p) => calls.push("redirect:" + p);
  runGo({
    search: "?src=facebook&to=/da/",
    loadTracker: async () => null,
    redirect,
    setTimer: () => {},
  });
  await new Promise((r) => setImmediate(r));
  assert.deepEqual(calls, ["redirect:/da/?src=facebook"]);
});

test("runGo: tracker resolves late, after timeout — still one redirect", async () => {
  const calls = [];
  const redirect = (p) => calls.push("redirect:" + p);
  let timeoutCb = null;
  const setTimer = (fn) => {
    timeoutCb = fn;
    return 0;
  };
  let resolveTracker;
  runGo({
    search: "?src=x",
    // deferred: stays pending until we resolve it below
    loadTracker: () => new Promise((r) => (resolveTracker = r)),
    redirect,
    setTimer,
  });
  // the tracker is still pending
  await new Promise((r) => setImmediate(r));
  assert.equal(calls.length, 0);
  timeoutCb();
  await new Promise((r) => setImmediate(r));
  assert.deepEqual(calls, ["redirect:/?src=x"]);
  // now the tracker resolves LATE, after the redirect already happened:
  // the .then(finish, finish) chain must NOT redirect a second time.
  const track = (n) => calls.push("track:" + n);
  resolveTracker(track);
  await new Promise((r) => setImmediate(r));
  await new Promise((r) => setImmediate(r));
  // the tracker fires exactly once, and there is STILL exactly one redirect.
  const redirects = calls.filter((c) => c.startsWith("redirect:"));
  assert.deepEqual(redirects, ["redirect:/?src=x"]);
  assert.equal(
    calls.filter((c) => c.startsWith("track:")).length,
    1
  );
});

test("runGo: track throws, still redirects once", async () => {
  const calls = [];
  const redirect = (p) => calls.push("redirect:" + p);
  const track = () => {
    throw new Error("track failed");
  };
  runGo({
    search: "?src=instagram",
    loadTracker: async () => track,
    redirect,
    setTimer: () => {},
  });
  await new Promise((r) => setImmediate(r));
  await new Promise((r) => setImmediate(r));
  assert.deepEqual(calls, ["redirect:/?src=instagram"]);
});

test("runGo: track rejects, still redirects once", async () => {
  const calls = [];
  const redirect = (p) => calls.push("redirect:" + p);
  const track = () => Promise.reject(new Error("track rejected"));
  runGo({
    search: "?src=instagram",
    loadTracker: async () => track,
    redirect,
    setTimer: () => {},
  });
  await new Promise((r) => setImmediate(r));
  await new Promise((r) => setImmediate(r));
  assert.deepEqual(calls, ["redirect:/?src=instagram"]);
});

test("attachSourceToClicks", () => {
  let handler = null;
  let captured = null;
  const target = {
    addEventListener: (type, fn, cap) => {
      handler = fn;
      captured = cap;
    },
  };
  attachSourceToClicks(target, "instagram");
  assert.equal(typeof handler, "function");
  assert.equal(captured, true);

  const attrs = new Map();
  const el = {
    hasAttribute: (k) => attrs.has(k),
    setAttribute: (k, v) => {
      attrs.set(k, v);
    },
  };
  handler({ target: { closest: () => el } });
  assert.equal(attrs.get("data-umami-event-src"), "instagram");

  // does not overwrite existing
  const el2 = {
    hasAttribute: (k) => attrs.has(k) || (k === "data-umami-event-src" && true),
    setAttribute: () => {},
  };
  // simulate an element that already has the attribute
  const attrs2 = new Set(["data-umami-event-src"]);
  const elPre = {
    hasAttribute: (k) => attrs2.has(k),
    setAttribute: () => {
      throw new Error("should not set");
    },
  };
  handler({ target: { closest: () => elPre } });

  // null-safe: closest returns null
  handler({ target: { closest: () => null } });
  // and a target without closest
  handler({ target: {} });
});

test("waitForUmami resolves when ready", async () => {
  const win = {};
  setTimeout(() => {
    win.umami = { track: (n, d) => [n, d] };
  }, 30);
  const track = await waitForUmami(win, 5000, 10);
  assert.equal(typeof track, "function");
  assert.deepEqual(track("x", { a: 1 }), ["x", { a: 1 }]);
});

test("waitForUmami resolves null on timeout", async () => {
  const win = {};
  const track = await waitForUmami(win, 50, 10);
  assert.equal(track, null);
});

test("waitForUmami resolves immediately when already ready", async () => {
  const win = { umami: { track: (n, d) => [n, d] } };
  const track = await waitForUmami(win, 5000, 10);
  assert.equal(typeof track, "function");
});

test("appStoreTarget accepts exact Apple origins", () => {
  assert.equal(appStoreTarget(APP_STORE_URL), APP_STORE_URL);
  assert.equal(
    appStoreTarget("https://itunes.apple.com/app/id6756801168"),
    "https://itunes.apple.com/app/id6756801168"
  );
  assert.equal(
    appStoreTarget("https://apps.apple.com/app/id6756801168?l=da"),
    "https://apps.apple.com/app/id6756801168?l=da"
  );
  assert.deepEqual([...APP_STORE_ORIGINS], [
    "https://apps.apple.com",
    "https://itunes.apple.com",
  ]);
});

test("appStoreTarget rejects everything else", () => {
  for (const bad of [
    "http://apps.apple.com/app/id6756801168",
    "https://not-apple.com/app/id1",
    "//apps.apple.com/app/id1",
    "https://apps.apple.com.evil.com/app/id1",
    "https://evilapps.apple.com/",
    "https://apple.com/",
    "https://apps.apple.com@evil.com/",
    "https://apps.apple.com\\evil.com",
    "https://user@apps.apple.com/",
    "https://apps.apple.com:8443/",
    "https://apps.apple.com./",
    "javascript:alert(1)",
    "HTTPS://apps.apple.com/",
    " https://apps.apple.com/",
    "https://evil.com/?u=https://apps.apple.com",
    "/da/",
    "",
  ]) {
    assert.equal(appStoreTarget(bad), null, `should reject: ${bad}`);
  }
  assert.equal(appStoreTarget(null), null);
  assert.equal(appStoreTarget(123), null);
});

test("buildDestination: App Store to passes through intact", () => {
  const enc = encodeURIComponent(APP_STORE_URL);
  const d = buildDestination(`?src=instagram&to=${enc}`);
  assert.deepEqual(d, { src: "instagram", path: APP_STORE_URL });
  assert.ok(!d.path.includes("src="));
  assert.deepEqual(buildDestination(`?src=instagram&to=${APP_STORE_URL}`), d);
  assert.deepEqual(buildDestination(`?to=${enc}`), { src: null, path: APP_STORE_URL });
});

test("buildDestination: rejected external to falls back to / with src", () => {
  for (const bad of [
    "http://apps.apple.com/app/id1",
    "https://not-apple.com/",
    "//apps.apple.com/app/id1",
    "https://apps.apple.com.evil.com/app/id1",
    "https://apps.apple.com@evil.com/",
  ]) {
    assert.deepEqual(
      buildDestination(`?src=instagram&to=${encodeURIComponent(bad)}`),
      { src: "instagram", path: "/?src=instagram" },
      `should fall back for: ${bad}`
    );
  }
});

test("goUrl: App Store to", () => {
  const ok = goUrl("instagram", APP_STORE_URL);
  assert.equal(
    ok,
    `https://event-stories.12f.dk/go/?src=instagram&to=${encodeURIComponent(APP_STORE_URL)}`
  );
  assert.equal(goUrl("instagram", "https://apps.apple.com.evil.com/x"), "https://event-stories.12f.dk/go/?src=instagram");
  assert.equal(goUrl("instagram", "http://apps.apple.com/x"), "https://event-stories.12f.dk/go/?src=instagram");
  assert.equal(buildDestination(new URL(ok).search).path, APP_STORE_URL);
});

test("runGo: App Store to — track then redirect to absolute URL once", async () => {
  const calls = [];
  const track = (n, d) => calls.push(`track:${n}:${d.src}`);
  const redirect = (t) => calls.push(`redirect:${t}`);
  let pendingTimer;
  const setTimer = (fn) => { pendingTimer = fn; return 0; };
  runGo({
    search: `?src=instagram&to=${encodeURIComponent(APP_STORE_URL)}`,
    loadTracker: () => Promise.resolve(track),
    redirect,
    setTimer,
  });
  // let the loadTracker promise resolve, then fire the timer (redirect path)
  await new Promise((r) => setImmediate(r));
  await new Promise((r) => setImmediate(r));
  if (pendingTimer) pendingTimer();
  await new Promise((r) => setImmediate(r));
  assert.deepEqual(calls, [`track:social-landing:instagram`, `redirect:${APP_STORE_URL}`]);
});

test("safeTarget still rejects App Store URLs", () => {
  assert.equal(safeTarget(APP_STORE_URL), "/");
});
