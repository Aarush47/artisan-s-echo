import { R as React, r as reactExports } from "./react.mjs";
import { d as dequal } from "./dequal.mjs";
var ClerkError = class ClerkError2 extends Error {
  static kind = "ClerkError";
  clerkError = true;
  code;
  longMessage;
  docsUrl;
  cause;
  get name() {
    return this.constructor.name;
  }
  constructor(opts) {
    super(new.target.formatMessage(new.target.kind, opts.message, opts.code, opts.docsUrl), { cause: opts.cause });
    Object.setPrototypeOf(this, ClerkError2.prototype);
    this.code = opts.code;
    this.docsUrl = opts.docsUrl;
    this.longMessage = opts.longMessage;
    this.cause = opts.cause;
  }
  toString() {
    return `[${this.name}]
Message:${this.message}`;
  }
  static formatMessage(name, msg, code, docsUrl) {
    const prefix = "Clerk:";
    const regex = new RegExp(prefix.replace(" ", "\\s*"), "i");
    msg = msg.replace(regex, "");
    msg = `${prefix} ${msg.trim()}

(code="${code}")

`;
    if (docsUrl) msg += `

Docs: ${docsUrl}`;
    return msg;
  }
};
var ClerkRuntimeError = class ClerkRuntimeError2 extends ClerkError {
  static kind = "ClerkRuntimeError";
  /**
  * @deprecated Use `clerkError` property instead. This property is maintained for backward compatibility.
  */
  clerkRuntimeError = true;
  constructor(message, options) {
    super({
      ...options,
      message
    });
    Object.setPrototypeOf(this, ClerkRuntimeError2.prototype);
  }
};
const DefaultMessages = Object.freeze({
  InvalidProxyUrlErrorMessage: `The proxyUrl passed to Clerk is invalid. The expected value for proxyUrl is an absolute URL or a relative path with a leading '/'. (key={{url}})`,
  InvalidPublishableKeyErrorMessage: `The publishableKey passed to Clerk is invalid. You can get your Publishable key at https://dashboard.clerk.com/last-active?path=api-keys. (key={{key}})`,
  MissingPublishableKeyErrorMessage: `Missing publishableKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.`,
  MissingSecretKeyErrorMessage: `Missing secretKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.`,
  MissingClerkProvider: `{{source}} can only be used within the <ClerkProvider /> component. Learn more: https://clerk.com/docs/components/clerk-provider`
});
function buildErrorThrower({ packageName, customMessages }) {
  let pkg = packageName;
  function buildMessage(rawMessage, replacements) {
    if (!replacements) return `${pkg}: ${rawMessage}`;
    let msg = rawMessage;
    const matches = rawMessage.matchAll(/{{([a-zA-Z0-9-_]+)}}/g);
    for (const match of matches) {
      const replacement = (replacements[match[1]] || "").toString();
      msg = msg.replace(`{{${match[1]}}}`, replacement);
    }
    return `${pkg}: ${msg}`;
  }
  const messages = {
    ...DefaultMessages,
    ...customMessages
  };
  return {
    setPackageName({ packageName: packageName$1 }) {
      if (typeof packageName$1 === "string") pkg = packageName$1;
      return this;
    },
    setMessages({ customMessages: customMessages$1 }) {
      Object.assign(messages, customMessages$1 || {});
      return this;
    },
    throwInvalidPublishableKeyError(params) {
      throw new Error(buildMessage(messages.InvalidPublishableKeyErrorMessage, params));
    },
    throwInvalidProxyUrl(params) {
      throw new Error(buildMessage(messages.InvalidProxyUrlErrorMessage, params));
    },
    throwMissingPublishableKeyError() {
      throw new Error(buildMessage(messages.MissingPublishableKeyErrorMessage));
    },
    throwMissingSecretKeyError() {
      throw new Error(buildMessage(messages.MissingSecretKeyErrorMessage));
    },
    throwMissingClerkProviderError(params) {
      throw new Error(buildMessage(messages.MissingClerkProvider, params));
    },
    throw(message) {
      throw new Error(buildMessage(message));
    }
  };
}
const DEV_OR_STAGING_SUFFIXES = [
  ".lcl.dev",
  ".stg.dev",
  ".lclstage.dev",
  ".stgstage.dev",
  ".dev.lclclerk.com",
  ".stg.lclclerk.com",
  ".accounts.lclclerk.com",
  "accountsstage.dev",
  "accounts.dev"
];
const isomorphicAtob = (data) => {
  if (typeof atob !== "undefined" && typeof atob === "function") return atob(data);
  else if (typeof globalThis.Buffer !== "undefined") return globalThis.Buffer.from(data, "base64").toString();
  return data;
};
const PUBLISHABLE_KEY_LIVE_PREFIX = "pk_live_";
const PUBLISHABLE_KEY_TEST_PREFIX = "pk_test_";
function isValidDecodedPublishableKey(decoded) {
  if (!decoded.endsWith("$")) return false;
  const withoutTrailing = decoded.slice(0, -1);
  if (withoutTrailing.includes("$")) return false;
  return withoutTrailing.includes(".");
}
function parsePublishableKey(key, options = {}) {
  key = key || "";
  if (!key || !isPublishableKey(key)) {
    if (options.fatal && !key) throw new Error("Publishable key is missing. Ensure that your publishable key is correctly configured. Double-check your environment configuration for your keys, or access them here: https://dashboard.clerk.com/last-active?path=api-keys");
    if (options.fatal && !isPublishableKey(key)) throw new Error("Publishable key not valid.");
    return null;
  }
  const instanceType = key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX) ? "production" : "development";
  let decodedFrontendApi;
  try {
    decodedFrontendApi = isomorphicAtob(key.split("_")[2]);
  } catch {
    if (options.fatal) throw new Error("Publishable key not valid: Failed to decode key.");
    return null;
  }
  if (!isValidDecodedPublishableKey(decodedFrontendApi)) {
    if (options.fatal) throw new Error("Publishable key not valid: Decoded key has invalid format.");
    return null;
  }
  let frontendApi = decodedFrontendApi.slice(0, -1);
  if (options.proxyUrl) frontendApi = options.proxyUrl;
  else if (instanceType !== "development" && options.domain && options.isSatellite) frontendApi = `clerk.${options.domain}`;
  return {
    instanceType,
    frontendApi
  };
}
function isPublishableKey(key = "") {
  try {
    if (!(key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX) || key.startsWith(PUBLISHABLE_KEY_TEST_PREFIX))) return false;
    const parts = key.split("_");
    if (parts.length !== 3) return false;
    const encodedPart = parts[2];
    if (!encodedPart) return false;
    return isValidDecodedPublishableKey(isomorphicAtob(encodedPart));
  } catch {
    return false;
  }
}
function createDevOrStagingUrlCache() {
  const devOrStagingUrlCache = /* @__PURE__ */ new Map();
  return { isDevOrStagingUrl: (url) => {
    if (!url) return false;
    const hostname = typeof url === "string" ? url : url.hostname;
    let res = devOrStagingUrlCache.get(hostname);
    if (res === void 0) {
      res = DEV_OR_STAGING_SUFFIXES.some((s) => hostname.endsWith(s));
      devOrStagingUrlCache.set(hostname, res);
    }
    return res;
  } };
}
const EVENT_METHOD_CALLED = "METHOD_CALLED";
const EVENT_SAMPLING_RATE$2 = 0.1;
function eventMethodCalled(method, payload) {
  return {
    event: EVENT_METHOD_CALLED,
    eventSamplingRate: EVENT_SAMPLING_RATE$2,
    payload: {
      method,
      ...payload
    }
  };
}
const errorPrefix = "ClerkJS:";
function clerkCoreErrorNoClerkSingleton() {
  throw new Error(`${errorPrefix} Clerk instance not found. Make sure Clerk is initialized before using any Clerk components.`);
}
function assertContextExists(contextVal, msgOrCtx) {
  if (!contextVal) throw typeof msgOrCtx === "string" ? new Error(msgOrCtx) : /* @__PURE__ */ new Error(`${msgOrCtx.displayName} not found`);
}
const createContextAndHook = (displayName, options) => {
  const { assertCtxFn = assertContextExists } = {};
  const Ctx = React.createContext(void 0);
  Ctx.displayName = displayName;
  const useCtx = () => {
    const ctx = React.useContext(Ctx);
    assertCtxFn(ctx, `${displayName} not found`);
    return ctx.value;
  };
  const useCtxWithoutGuarantee = () => {
    const ctx = React.useContext(Ctx);
    return ctx ? ctx.value : {};
  };
  return [
    Ctx,
    useCtx,
    useCtxWithoutGuarantee
  ];
};
const [ClerkInstanceContext, useClerkInstanceContext] = createContextAndHook("ClerkInstanceContext");
const [InitialStateContext, _useInitialStateContext] = createContextAndHook("InitialStateContext");
function InitialStateProvider({ children, initialState }) {
  const [initialStateSnapshot] = reactExports.useState(initialState);
  const initialStateCtx = React.useMemo(() => ({ value: initialStateSnapshot }), [initialStateSnapshot]);
  return /* @__PURE__ */ React.createElement(InitialStateContext.Provider, { value: initialStateCtx }, children);
}
function useInitialStateContext() {
  const initialState = _useInitialStateContext();
  if (initialState instanceof Promise) if ("use" in React && typeof React.use === "function") return React.use(initialState);
  else throw new Error("initialState cannot be a promise if React version is less than 19");
  return initialState;
}
React.createContext({});
const [CheckoutContext] = createContextAndHook("CheckoutContext");
const __experimental_CheckoutProvider = ({ children, ...rest }) => {
  return /* @__PURE__ */ React.createElement(CheckoutContext.Provider, { value: { value: rest } }, children);
};
function useAssertWrappedByClerkProvider(displayNameOrFn) {
  if (!React.useContext(ClerkInstanceContext)) {
    if (typeof displayNameOrFn === "function") {
      displayNameOrFn();
      return;
    }
    throw new Error(`${displayNameOrFn} can only be used within the <ClerkProvider /> component.

Possible fixes:
1. Ensure that the <ClerkProvider /> is correctly wrapping your application where this component is used.
2. Check for multiple versions of the \`@clerk/shared\` package in your project. Use a tool like \`npm ls @clerk/shared\` to identify multiple versions, and update your dependencies to only rely on one.

Learn more: https://clerk.com/docs/components/clerk-provider`.trim());
  }
}
function createRecursiveProxy(label) {
  const callableTarget = function noop$1() {
  };
  let self;
  self = new Proxy(callableTarget, {
    get(_target, prop) {
      if (prop === "then") return;
      if (prop === "toString") return () => `[${label}]`;
      if (prop === Symbol.toPrimitive) return () => 0;
      return self;
    },
    apply() {
      return self;
    },
    construct() {
      return self;
    },
    has() {
      return false;
    },
    set() {
      return false;
    }
  });
  return self;
}
createRecursiveProxy("ClerkMockQueryClient");
function useUserBase() {
  const clerk = useClerkInstanceContext();
  const initialState = useInitialStateContext();
  const getInitialState = reactExports.useCallback(() => initialState?.user, [initialState?.user]);
  return reactExports.useSyncExternalStore(reactExports.useCallback((callback) => {
    return clerk.addListener(callback, { skipInitialEmit: true });
  }, [clerk]), reactExports.useCallback(() => {
    if (!clerk.loaded || !clerk.__internal_lastEmittedResources) return getInitialState();
    return clerk.__internal_lastEmittedResources.user;
  }, [clerk, getInitialState]), getInitialState);
}
const useClerk = () => {
  useAssertWrappedByClerkProvider("useClerk");
  return useClerkInstanceContext();
};
typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
const hookName = "useUser";
function useUser() {
  useAssertWrappedByClerkProvider(hookName);
  const user = useUserBase();
  useClerkInstanceContext().telemetry?.record(eventMethodCalled(hookName));
  if (user === void 0) return {
    isLoaded: false,
    isSignedIn: void 0,
    user: void 0
  };
  if (user === null) return {
    isLoaded: true,
    isSignedIn: false,
    user: null
  };
  return {
    isLoaded: true,
    isSignedIn: true,
    user
  };
}
const isDeeplyEqual = dequal;
function assertClerkSingletonExists(clerk) {
  if (!clerk) clerkCoreErrorNoClerkSingleton();
}
function ClerkContextProvider(props) {
  const clerk = props.clerk;
  assertClerkSingletonExists(clerk);
  if (props.initialState instanceof Promise && !("use" in React && typeof React.use === "function")) throw new Error("initialState cannot be a promise if React version is less than 19");
  const clerkCtx = React.useMemo(() => ({ value: clerk }), [props.clerkStatus]);
  return /* @__PURE__ */ React.createElement(InitialStateProvider, { initialState: props.initialState }, /* @__PURE__ */ React.createElement(ClerkInstanceContext.Provider, { value: clerkCtx }, /* @__PURE__ */ React.createElement(__experimental_CheckoutProvider, { value: void 0 }, props.children)));
}
const usePrevious = (value) => {
  const ref = reactExports.useRef(value);
  reactExports.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};
const useAttachEvent = (element, event, cb) => {
  const cbDefined = !!cb;
  const cbRef = reactExports.useRef(cb);
  reactExports.useEffect(() => {
    cbRef.current = cb;
  }, [cb]);
  reactExports.useEffect(() => {
    if (!cbDefined || !element) return () => {
    };
    const decoratedCb = (...args) => {
      if (cbRef.current) cbRef.current(...args);
    };
    element.on(event, decoratedCb);
    return () => {
      element.off(event, decoratedCb);
    };
  }, [
    cbDefined,
    event,
    element,
    cbRef
  ]);
};
const ElementsContext = React.createContext(null);
ElementsContext.displayName = "ElementsContext";
const parseElementsContext = (ctx, useCase) => {
  if (!ctx) throw new Error(`Could not find Elements context; You need to wrap the part of your app that ${useCase} in an <Elements> provider.`);
  return ctx;
};
const isUnknownObject = (raw) => {
  return raw !== null && typeof raw === "object";
};
const extractAllowedOptionsUpdates = (options, prevOptions, immutableKeys) => {
  if (!isUnknownObject(options)) return null;
  return Object.keys(options).reduce((newOptions, key) => {
    const isUpdated = !isUnknownObject(prevOptions) || !isEqual(options[key], prevOptions[key]);
    if (immutableKeys.includes(key)) {
      if (isUpdated) console.warn(`Unsupported prop change: options.${key} is not a mutable property.`);
      return newOptions;
    }
    if (!isUpdated) return newOptions;
    return {
      ...newOptions || {},
      [key]: options[key]
    };
  }, null);
};
const PLAIN_OBJECT_STR = "[object Object]";
const isEqual = (left, right) => {
  if (!isUnknownObject(left) || !isUnknownObject(right)) return left === right;
  const leftArray = Array.isArray(left);
  if (leftArray !== Array.isArray(right)) return false;
  const leftPlainObject = Object.prototype.toString.call(left) === PLAIN_OBJECT_STR;
  if (leftPlainObject !== (Object.prototype.toString.call(right) === PLAIN_OBJECT_STR)) return false;
  if (!leftPlainObject && !leftArray) return left === right;
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) return false;
  const keySet = {};
  for (let i = 0; i < leftKeys.length; i += 1) keySet[leftKeys[i]] = true;
  for (let i = 0; i < rightKeys.length; i += 1) keySet[rightKeys[i]] = true;
  const allKeys = Object.keys(keySet);
  if (allKeys.length !== leftKeys.length) return false;
  const l = left;
  const r = right;
  const pred = (key) => {
    return isEqual(l[key], r[key]);
  };
  return allKeys.every(pred);
};
const useElementsOrCheckoutSdkContextWithUseCase = (useCaseString) => {
  return parseElementsContext(React.useContext(ElementsContext), useCaseString);
};
const capitalized = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const createElementComponent = (type, isServer) => {
  const displayName = `${capitalized(type)}Element`;
  const ClientElement = ({ id, className, fallback, options = {}, onBlur, onFocus, onReady, onChange, onEscape, onClick, onLoadError, onLoaderStart, onNetworksChange, onConfirm, onCancel, onShippingAddressChange, onShippingRateChange }) => {
    const ctx = useElementsOrCheckoutSdkContextWithUseCase(`mounts <${displayName}>`);
    const elements = "elements" in ctx ? ctx.elements : null;
    const [element, setElement] = React.useState(null);
    const elementRef = React.useRef(null);
    const domNode = React.useRef(null);
    const [isReady, setReady] = reactExports.useState(false);
    useAttachEvent(element, "blur", onBlur);
    useAttachEvent(element, "focus", onFocus);
    useAttachEvent(element, "escape", onEscape);
    useAttachEvent(element, "click", onClick);
    useAttachEvent(element, "loaderror", onLoadError);
    useAttachEvent(element, "loaderstart", onLoaderStart);
    useAttachEvent(element, "networkschange", onNetworksChange);
    useAttachEvent(element, "confirm", onConfirm);
    useAttachEvent(element, "cancel", onCancel);
    useAttachEvent(element, "shippingaddresschange", onShippingAddressChange);
    useAttachEvent(element, "shippingratechange", onShippingRateChange);
    useAttachEvent(element, "change", onChange);
    let readyCallback;
    if (onReady) readyCallback = () => {
      setReady(true);
      onReady(element);
    };
    useAttachEvent(element, "ready", readyCallback);
    React.useLayoutEffect(() => {
      if (elementRef.current === null && domNode.current !== null && elements) {
        let newElement = null;
        if (elements) newElement = elements.create(type, options);
        elementRef.current = newElement;
        setElement(newElement);
        if (newElement) newElement.mount(domNode.current);
      }
    }, [elements, options]);
    const prevOptions = usePrevious(options);
    React.useEffect(() => {
      if (!elementRef.current) return;
      const updates = extractAllowedOptionsUpdates(options, prevOptions, ["paymentRequest"]);
      if (updates && "update" in elementRef.current) elementRef.current.update(updates);
    }, [options, prevOptions]);
    React.useLayoutEffect(() => {
      return () => {
        if (elementRef.current && typeof elementRef.current.destroy === "function") try {
          elementRef.current.destroy();
          elementRef.current = null;
        } catch {
        }
      };
    }, []);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, !isReady && fallback, /* @__PURE__ */ React.createElement("div", {
      id,
      style: {
        height: isReady ? "unset" : "0px",
        visibility: isReady ? "visible" : "hidden"
      },
      className,
      ref: domNode
    }));
  };
  const ServerElement = (props) => {
    useElementsOrCheckoutSdkContextWithUseCase(`mounts <${displayName}>`);
    const { id, className } = props;
    return /* @__PURE__ */ React.createElement("div", {
      id,
      className
    });
  };
  const Element = isServer ? ServerElement : ClientElement;
  Element.displayName = displayName;
  Element.__elementType = type;
  return Element;
};
createElementComponent("payment", typeof window === "undefined");
createContextAndHook("PaymentElementContext");
createContextAndHook("StripeUtilsContext");
const [PortalContext, , usePortalContextWithoutGuarantee] = createContextAndHook("PortalProvider");
const usePortalRoot = () => {
  const contextValue = usePortalContextWithoutGuarantee();
  if (contextValue && "getContainer" in contextValue && contextValue.getContainer) return contextValue.getContainer;
  return () => null;
};
const isDevelopmentEnvironment = () => {
  try {
    return false;
  } catch {
  }
  return false;
};
const isTestEnvironment = () => {
  try {
    return false;
  } catch {
  }
  return false;
};
const isProductionEnvironment = () => {
  try {
    return true;
  } catch {
  }
  return false;
};
function handleValueOrFn(value, url, defaultValue) {
  if (typeof value === "function") return value(url);
  if (typeof value !== "undefined") return value;
  if (typeof defaultValue !== "undefined") return defaultValue;
}
const logErrorInDevMode = (message) => {
  if (isDevelopmentEnvironment()) console.error(`Clerk: ${message}`);
};
const __vite_import_meta_env__ = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": true, "TSS_DEV_SERVER": "false", "TSS_DEV_SSR_STYLES_BASEPATH": "/", "TSS_DEV_SSR_STYLES_ENABLED": "true", "TSS_ROUTER_BASEPATH": "", "TSS_SERVER_FN_BASE": "/_serverFn/", "VITE_CLERK_PUBLISHABLE_KEY": "pk_test_ZW5hYmxlZC1nbmF0LTcyLmNsZXJrLmFjY291bnRzLmRldiQ", "VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiYWhwa3d5emRpcmlpbmJ5bmNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDc5NzQsImV4cCI6MjA5MjI4Mzk3NH0.GfvfHNGILYPNDATtItxDtFAk8LL7tRiGAyBHcXs2ToY", "VITE_SUPABASE_URL": "https://jbahpkwyzdiriinbynck.supabase.co" };
const getEnvVariable = (name, context) => {
  if (typeof process !== "undefined" && process.env && typeof process.env[name] === "string") return process.env[name];
  if (typeof import.meta !== "undefined" && __vite_import_meta_env__ && typeof __vite_import_meta_env__[name] === "string") return __vite_import_meta_env__[name];
  try {
    return globalThis[name];
  } catch {
  }
  return "";
};
const without = (obj, ...props) => {
  const copy = { ...obj };
  for (const prop of props) delete copy[prop];
  return copy;
};
function inBrowser() {
  return typeof window !== "undefined";
}
const displayedWarnings = /* @__PURE__ */ new Set();
const deprecated = (fnName, warning, key) => {
  const hideWarning = isTestEnvironment() || isProductionEnvironment();
  const messageId = fnName;
  if (displayedWarnings.has(messageId) || hideWarning) return;
  displayedWarnings.add(messageId);
  console.warn(`Clerk - DEPRECATION WARNING: "${fnName}" is deprecated and will be removed in the next major release.
${warning}`);
};
function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  const [, majorStr, minorStr, patchStr] = match;
  return {
    major: parseInt(majorStr, 10),
    minor: parseInt(minorStr, 10),
    patch: parseInt(patchStr, 10)
  };
}
function checkVersionAgainstBounds(version, bounds) {
  const { major, minor, patch } = version;
  return bounds.some(([bMajor, minMinor, maxMinor, minPatch]) => {
    if (major !== bMajor) return false;
    if (maxMinor === -1) return minor > minMinor || minor === minMinor && patch >= minPatch;
    return minor === maxMinor && patch >= minPatch;
  });
}
function isVersionCompatible(version, bounds) {
  const parsed = parseVersion(version);
  if (!parsed) return false;
  return checkVersionAgainstBounds(parsed, bounds);
}
const _on = (eventToHandlersMap, latestPayloadMap, event, handler, opts) => {
  const { notify } = opts || {};
  let handlers = eventToHandlersMap.get(event);
  if (!handlers) {
    handlers = [];
    eventToHandlersMap.set(event, handlers);
  }
  handlers.push(handler);
  if (notify && latestPayloadMap.has(event)) handler(latestPayloadMap.get(event));
};
const _dispatch = (eventToHandlersMap, event, payload) => (eventToHandlersMap.get(event) || []).map((h) => h(payload));
const _off = (eventToHandlersMap, event, handler) => {
  const handlers = eventToHandlersMap.get(event);
  if (handlers) if (handler) handlers.splice(handlers.indexOf(handler) >>> 0, 1);
  else eventToHandlersMap.set(event, []);
};
const createEventBus = () => {
  const eventToHandlersMap = /* @__PURE__ */ new Map();
  const latestPayloadMap = /* @__PURE__ */ new Map();
  const eventToPredispatchHandlersMap = /* @__PURE__ */ new Map();
  const emit = (event, payload) => {
    latestPayloadMap.set(event, payload);
    _dispatch(eventToPredispatchHandlersMap, event, payload);
    _dispatch(eventToHandlersMap, event, payload);
  };
  return {
    on: (...args) => _on(eventToHandlersMap, latestPayloadMap, ...args),
    prioritizedOn: (...args) => _on(eventToPredispatchHandlersMap, latestPayloadMap, ...args),
    emit,
    off: (...args) => _off(eventToHandlersMap, ...args),
    prioritizedOff: (...args) => _off(eventToPredispatchHandlersMap, ...args),
    internal: { retrieveListeners: (event) => eventToHandlersMap.get(event) || [] }
  };
};
const clerkEvents = { Status: "status" };
const createClerkEventBus = () => {
  return createEventBus();
};
const defaultOptions = {
  initialDelay: 125,
  maxDelayBetweenRetries: 0,
  factor: 2,
  shouldRetry: (_, iteration) => iteration < 5,
  retryImmediately: false,
  jitter: true
};
const RETRY_IMMEDIATELY_DELAY = 100;
const sleep = async (ms) => new Promise((s) => setTimeout(s, ms));
const applyJitter = (delay, jitter) => {
  return jitter ? delay * (1 + Math.random()) : delay;
};
const createExponentialDelayAsyncFn = (opts) => {
  let timesCalled = 0;
  const calculateDelayInMs = () => {
    const constant = opts.initialDelay;
    const base = opts.factor;
    let delay = constant * Math.pow(base, timesCalled);
    delay = applyJitter(delay, opts.jitter);
    return Math.min(opts.maxDelayBetweenRetries || delay, delay);
  };
  return async () => {
    await sleep(calculateDelayInMs());
    timesCalled++;
  };
};
const retry = async (callback, options = {}) => {
  let iterations = 0;
  const { shouldRetry, initialDelay, maxDelayBetweenRetries, factor, retryImmediately, jitter, onBeforeRetry } = {
    ...defaultOptions,
    ...options
  };
  const delay = createExponentialDelayAsyncFn({
    initialDelay,
    maxDelayBetweenRetries,
    factor,
    jitter
  });
  while (true) try {
    return await callback();
  } catch (e) {
    iterations++;
    if (!shouldRetry(e, iterations)) throw e;
    if (onBeforeRetry) await onBeforeRetry(iterations);
    if (retryImmediately && iterations === 1) await sleep(applyJitter(RETRY_IMMEDIATELY_DELAY, jitter));
    else await delay();
  }
};
const NO_DOCUMENT_ERROR = "loadScript cannot be called when document does not exist";
const NO_SRC_ERROR = "loadScript cannot be called without a src";
async function loadScript(src = "", opts) {
  const { async, defer, beforeLoad, crossOrigin, nonce } = opts || {};
  const load = () => {
    return new Promise((resolve, reject) => {
      if (!src) reject(new Error(NO_SRC_ERROR));
      if (!document || !document.body) reject(new Error(NO_DOCUMENT_ERROR));
      const script = document.createElement("script");
      if (crossOrigin) script.setAttribute("crossorigin", crossOrigin);
      script.async = async || false;
      script.defer = defer || false;
      script.addEventListener("load", () => {
        script.remove();
        resolve(script);
      });
      script.addEventListener("error", (event) => {
        script.remove();
        reject(event.error ?? /* @__PURE__ */ new Error(`failed to load script: ${src}`));
      });
      script.src = src;
      script.nonce = nonce;
      beforeLoad?.(script);
      document.body.appendChild(script);
    });
  };
  return retry(load, { shouldRetry: (_, iterations) => {
    return iterations <= 5;
  } });
}
function isValidProxyUrl(key) {
  if (!key) return true;
  return isHttpOrHttps(key) || isProxyUrlRelative(key);
}
function isHttpOrHttps(key) {
  return /^http(s)?:\/\//.test(key || "");
}
function isProxyUrlRelative(key) {
  return key.startsWith("/");
}
function proxyUrlToAbsoluteURL(url) {
  if (!url) return "";
  return isProxyUrlRelative(url) ? new URL(url, window.location.origin).toString() : url;
}
function addClerkPrefix(str) {
  if (!str) return "";
  let regex;
  if (str.match(/^(clerk\.)+\w*$/)) regex = /(clerk\.)*(?=clerk\.)/;
  else if (str.match(/\.clerk.accounts/)) return str;
  else regex = /^(clerk\.)*/gi;
  return `clerk.${str.replace(regex, "")}`;
}
const versionSelector = (clerkJSVersion, packageVersion = "6.7.3") => {
  if (clerkJSVersion) return clerkJSVersion;
  const prereleaseTag = getPrereleaseTag(packageVersion);
  if (prereleaseTag) {
    if (prereleaseTag === "snapshot") return packageVersion;
    return prereleaseTag;
  }
  return getMajorVersion(packageVersion);
};
const getPrereleaseTag = (packageVersion) => packageVersion.trim().replace(/^v/, "").match(/-(.+?)(\.|$)/)?.[1];
const getMajorVersion = (packageVersion) => packageVersion.trim().replace(/^v/, "").split(".")[0];
const { isDevOrStagingUrl } = createDevOrStagingUrlCache();
const errorThrower = buildErrorThrower({ packageName: "@clerk/shared" });
function isClerkGlobalProperlyLoaded(prop) {
  if (typeof window === "undefined" || !window[prop]) return false;
  return !!window[prop];
}
const isClerkProperlyLoaded = () => isClerkGlobalProperlyLoaded("Clerk");
const isClerkUIProperlyLoaded = () => isClerkGlobalProperlyLoaded("__internal_ClerkUICtor");
function hasScriptRequestError(scriptUrl) {
  if (typeof window === "undefined" || !window.performance) return false;
  const entries = performance.getEntriesByName(scriptUrl, "resource");
  if (entries.length === 0) return false;
  const scriptEntry = entries[entries.length - 1];
  if (scriptEntry.transferSize === 0 && scriptEntry.decodedBodySize === 0) {
    if (scriptEntry.responseEnd === 0) return true;
    if (scriptEntry.responseEnd > 0 && scriptEntry.responseStart > 0) return true;
    if ("responseStatus" in scriptEntry) {
      if (scriptEntry.responseStatus >= 400) return true;
      if (scriptEntry.responseStatus === 0) return true;
    }
  }
  return false;
}
const loadClerkJSScript = async (opts) => {
  const timeout = opts?.scriptLoadTimeout ?? 15e3;
  const rejectWith = (error) => new ClerkRuntimeError("Failed to load Clerk JS" + (error?.message ? `, ${error.message}` : ""), {
    code: "failed_to_load_clerk_js",
    cause: error
  });
  if (isClerkProperlyLoaded()) return null;
  if (!opts?.publishableKey) {
    errorThrower.throwMissingPublishableKeyError();
    return null;
  }
  const scriptUrl = clerkJSScriptUrl(opts);
  const existingScript = document.querySelector("script[data-clerk-js-script]");
  if (existingScript) if (hasScriptRequestError(scriptUrl)) existingScript.remove();
  else try {
    await waitForPredicateWithTimeout(timeout, isClerkProperlyLoaded, rejectWith(), existingScript);
    return null;
  } catch {
    existingScript.remove();
  }
  const loadPromise = waitForPredicateWithTimeout(timeout, isClerkProperlyLoaded, rejectWith());
  loadScript(scriptUrl, {
    async: true,
    crossOrigin: "anonymous",
    nonce: opts.nonce,
    beforeLoad: applyAttributesToScript(buildClerkJSScriptAttributes(opts))
  }).catch((error) => {
    throw rejectWith(error);
  });
  return loadPromise;
};
const loadClerkUIScript = async (opts) => {
  const timeout = opts?.scriptLoadTimeout ?? 15e3;
  const rejectWith = (error) => new ClerkRuntimeError("Failed to load Clerk UI" + (error?.message ? `, ${error.message}` : ""), {
    code: "failed_to_load_clerk_ui",
    cause: error
  });
  if (isClerkUIProperlyLoaded()) return null;
  if (!opts?.publishableKey) {
    errorThrower.throwMissingPublishableKeyError();
    return null;
  }
  const scriptUrl = clerkUIScriptUrl(opts);
  const existingScript = document.querySelector("script[data-clerk-ui-script]");
  if (existingScript) if (hasScriptRequestError(scriptUrl)) existingScript.remove();
  else try {
    await waitForPredicateWithTimeout(timeout, isClerkUIProperlyLoaded, rejectWith(), existingScript);
    return null;
  } catch {
    existingScript.remove();
  }
  const loadPromise = waitForPredicateWithTimeout(timeout, isClerkUIProperlyLoaded, rejectWith());
  loadScript(scriptUrl, {
    async: true,
    crossOrigin: "anonymous",
    nonce: opts.nonce,
    beforeLoad: applyAttributesToScript(buildClerkUIScriptAttributes(opts))
  }).catch((error) => {
    throw rejectWith(error);
  });
  return loadPromise;
};
const clerkJSScriptUrl = (opts) => {
  const { __internal_clerkJSUrl, __internal_clerkJSVersion, proxyUrl, domain, publishableKey } = opts;
  if (__internal_clerkJSUrl) return __internal_clerkJSUrl;
  return `https://${buildScriptHost({
    publishableKey,
    proxyUrl,
    domain
  })}/npm/@clerk/clerk-js@${versionSelector(__internal_clerkJSVersion)}/dist/clerk.browser.js`;
};
const clerkUIScriptUrl = (opts) => {
  const { __internal_clerkUIUrl, __internal_clerkUIVersion, proxyUrl, domain, publishableKey } = opts;
  if (__internal_clerkUIUrl) return __internal_clerkUIUrl;
  return `https://${buildScriptHost({
    publishableKey,
    proxyUrl,
    domain
  })}/npm/@clerk/ui@${versionSelector(__internal_clerkUIVersion, "1.6.2")}/dist/ui.browser.js`;
};
const buildClerkJSScriptAttributes = (options) => {
  const obj = {};
  if (options.publishableKey) obj["data-clerk-publishable-key"] = options.publishableKey;
  if (options.proxyUrl) obj["data-clerk-proxy-url"] = options.proxyUrl;
  if (options.domain) obj["data-clerk-domain"] = options.domain;
  if (options.nonce) obj.nonce = options.nonce;
  return obj;
};
const buildClerkUIScriptAttributes = (options) => {
  return buildClerkJSScriptAttributes(options);
};
const applyAttributesToScript = (attributes) => (script) => {
  for (const attribute in attributes) script.setAttribute(attribute, attributes[attribute]);
};
const buildScriptHost = (opts) => {
  const { proxyUrl, domain, publishableKey } = opts;
  if (!!proxyUrl && isValidProxyUrl(proxyUrl)) return proxyUrlToAbsoluteURL(proxyUrl).replace(/http(s)?:\/\//, "");
  else if (domain && !isDevOrStagingUrl(parsePublishableKey(publishableKey)?.frontendApi || "")) return addClerkPrefix(domain);
  else return parsePublishableKey(publishableKey)?.frontendApi || "";
};
function waitForPredicateWithTimeout(timeoutMs, predicate, rejectWith, existingScript) {
  return new Promise((resolve, reject) => {
    let resolved = false;
    const cleanup = (timeoutId$1, pollInterval$1) => {
      clearTimeout(timeoutId$1);
      clearInterval(pollInterval$1);
    };
    existingScript?.addEventListener("error", () => {
      cleanup(timeoutId, pollInterval);
      reject(rejectWith);
    });
    const checkAndResolve = () => {
      if (resolved) return;
      if (predicate()) {
        resolved = true;
        cleanup(timeoutId, pollInterval);
        resolve(null);
      }
    };
    const handleTimeout = () => {
      if (resolved) return;
      resolved = true;
      cleanup(timeoutId, pollInterval);
      if (!predicate()) reject(rejectWith);
      else resolve(null);
    };
    const timeoutId = setTimeout(handleTimeout, timeoutMs);
    checkAndResolve();
    const pollInterval = setInterval(() => {
      if (resolved) {
        clearInterval(pollInterval);
        return;
      }
      checkAndResolve();
    }, 100);
  });
}
function setClerkJSLoadingErrorPackageName(packageName) {
  errorThrower.setPackageName({ packageName });
}
export {
  ClerkContextProvider as C,
  useClerkInstanceContext as a,
  buildErrorThrower as b,
  usePortalRoot as c,
  deprecated as d,
  isVersionCompatible as e,
  createClerkEventBus as f,
  getEnvVariable as g,
  clerkEvents as h,
  isDeeplyEqual as i,
  inBrowser as j,
  handleValueOrFn as k,
  logErrorInDevMode as l,
  loadClerkJSScript as m,
  loadClerkUIScript as n,
  useUser as o,
  useClerk as p,
  setClerkJSLoadingErrorPackageName as s,
  useAssertWrappedByClerkProvider as u,
  without as w
};
