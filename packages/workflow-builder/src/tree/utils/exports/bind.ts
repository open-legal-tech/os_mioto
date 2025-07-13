import deepEqual from "fast-deep-equal";
import { mapValues } from "remeda";
import { getVersion, ref, subscribe } from "valtio/vanilla";
import { prosemirrorToYXmlFragment } from "y-prosemirror";
import * as Y from "yjs";
import { createYRichTextFragment } from "../../../rich-text-editor/exports/RichText/transformers/yFragment";
import { parseProxyOps } from "../parseProxyOps";

const isProxyObject = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" &&
  x !== null &&
  getVersion(x) !== undefined &&
  !(x instanceof Y.XmlFragment);

const isProxyArray = (x: unknown): x is unknown[] =>
  Array.isArray(x) && getVersion(x) !== undefined;

const isXMLFragment = (x: unknown): x is Y.XmlFragment =>
  x instanceof Y.XmlFragment;

const isPrimitiveMapValue = (v: unknown) =>
  v === null ||
  typeof v === "string" ||
  typeof v === "number" ||
  typeof v === "boolean";

type Options = {
  transactionOrigin?: any;
};

const transact = (doc: Y.Doc | null, opts: Options, fn: () => void) => {
  if (doc) {
    doc.transact(fn, opts.transactionOrigin);
  } else {
    fn();
  }
};

const toYValue = (val: any) => {
  if (isXMLFragment(val)) {
    return val;
  }

  if (isProxyArray(val)) {
    const arr = new Y.Array();
    arr.insert(
      0,
      val.map(toYValue).filter((v) => v !== undefined && v !== null),
    );
    return arr;
  }

  if (isProxyObject(val)) {
    const map = new Y.Map();
    Object.entries(val).forEach(([key, value]) => {
      const v = toYValue(value);
      if (v !== undefined) {
        map.set(key, v);
      }
    });
    return map;
  }

  if (isPrimitiveMapValue(val)) {
    return val;
  }

  return undefined;
};

const yToJSON = (yv: unknown): any => {
  if (yv instanceof Y.XmlFragment) {
    return ref(yv);
  }

  if (yv instanceof Y.Map) {
    const map = {} as any;

    yv._map.forEach((item, key) => {
      if (!item.deleted) {
        const v = item.content.getContent()[item.length - 1];

        map[key] = yToJSON(v);
      }
    });

    return map;
  }

  if (yv instanceof Y.Array) {
    return yv.map((c) => yToJSON(c));
  }

  if (yv instanceof Y.AbstractType) {
    return yv.toJSON();
  }

  return yv;
};

const toJSON = (yv: unknown) => {
  if (yv instanceof Y.AbstractType) {
    return yv.toJSON();
  }

  return yv;
};

const proxyToJSON = (pv: unknown): any => {
  if (pv instanceof Y.AbstractType) {
    return pv.toJSON();
  }

  if (isProxyArray(pv)) {
    return pv.map(proxyToJSON);
  }

  if (isProxyObject(pv)) {
    return mapValues(pv, proxyToJSON);
  }

  return pv;
};

const getNestedValues = <T>(
  p: Record<string, T> | T[],
  y: Y.Map<T> | Y.Array<T>,
  path: (string | number)[],
) => {
  let pv: any = p;
  let yv: any = y;
  for (let i = 0; i < path.length; i += 1) {
    const k = path[i];
    if (k && yv instanceof Y.Map) {
      pv = pv[k];
      yv = yv.get(k as string);
    } else if (k && yv instanceof Y.Array) {
      const index = Number(k);
      pv = pv[k];
      yv = yv.get(index);
    } else {
      pv = null;
      yv = null;
    }
  }

  return { p: pv, y: yv };
};

export function bind<T>(
  p: Record<string, T> | T[],
  y: Y.Map<T> | Y.Array<T>,
  opts: Options = {},
): () => void {
  if (isProxyArray(p) && !(y instanceof Y.Array)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("proxy not same type");
    }
  }

  if (isProxyObject(p) && !isProxyArray(p) && !(y instanceof Y.Map)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("proxy not same type");
    }
  }

  // initialize from y
  initializeFromY(p, y);

  // initialize from p
  initializeFromP(p, y, opts);

  if (isProxyArray(p) && y instanceof Y.Array) {
    p.splice(y.length);
  }

  // subscribe p
  const unsubscribeP = subscribeP(p, y, opts);

  // subscribe y
  const unsubscribeY = subscribeY(y, p);

  return () => {
    unsubscribeP();
    unsubscribeY();
  };
}

function initializeFromP<T>(
  p: Record<string, T> | T[],
  y: Y.Map<T> | Y.Array<T>,
  opts: Options,
) {
  transact(y.doc, opts, () => {
    if (isProxyObject(p) && y instanceof Y.Map) {
      Object.entries(p).forEach(([k, pv]) => {
        const yv = y.get(k);
        const pvJSON = proxyToJSON(pv);
        const yvJSON = toJSON(yv);

        if (!deepEqual(pvJSON, yvJSON)) {
          insertPValueToY(pv, y, k);
        }
      });
    }

    if (isProxyArray(p) && y instanceof Y.Array) {
      p.forEach((pv, i) => {
        const yv = y.get(i);
        const pvJSON = proxyToJSON(pv);
        const yvJSON = toJSON(yv);

        if (!deepEqual(pvJSON, yvJSON)) {
          insertPValueToY(pv, y, i);
        }
      });
    }
  });
}

function initializeFromY<T>(
  p: Record<string, T> | T[],
  y: Y.Map<T> | Y.Array<T>,
) {
  if (isProxyObject(p) && y instanceof Y.Map) {
    y.forEach((yv, k) => {
      const pvJSON = proxyToJSON(p[k]);
      const yvJSON = toJSON(yv);

      if (!deepEqual(pvJSON, yvJSON)) {
        p[k] = yToJSON(yv);
      }
    });
  }

  if (isProxyArray(p) && y instanceof Y.Array) {
    y.forEach((yv, i) => {
      const pvJSON = proxyToJSON(p[i]);
      const yvJSON = toJSON(yv);

      if (!deepEqual(pvJSON, yvJSON)) {
        insertYValueToP(yv, p, i);
      }
    });
  }
}

function insertPValueToY<T>(
  pv: T,
  y: Y.Map<T> | Y.Array<T>,
  k: number | string,
) {
  try {
    const yv = toYValue(pv) as T;

    if (yv === undefined && process.env.NODE_ENV !== "production") {
      console.warn("unsupported p type", pv);
      return;
    }

    if (y instanceof Y.Map && typeof k === "string") {
      y.set(k, yv);
    } else if (y instanceof Y.Array && typeof k === "number") {
      y.insert(k, [yv]);
    }
  } catch (error) {
    console.error(error);
    throw new Error(
      `Failed to insert ${JSON.stringify(pv)} at ${k} into ${JSON.stringify(
        y.toJSON(),
      )}`,
    );
  }
}

function insertYValueToP<T>(
  yv: T,
  p: Record<string, T> | T[],
  k: number | string,
) {
  try {
    const pv = yToJSON(yv);

    if (isProxyObject(p) && typeof k === "string") {
      p[k] = pv;
    } else if (isProxyArray(p) && typeof k === "number") {
      p.splice(k, 0, pv);
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to insert ${yv} at ${k} into ${p}`);
  }
}

function subscribeP<T>(
  p: Record<string, T> | T[],
  y: Y.Map<T> | Y.Array<T>,
  opts: Options,
) {
  return subscribe(p, (ops) => {
    transact(y.doc, opts, () => {
      ops.forEach((op) => {
        const path = op[1].slice(0, -1) as string[];
        const k = op[1][op[1].length - 1] as string;
        const parent = getNestedValues(p, y, path);

        if (!parent.p || !parent.y) {
          return;
        }

        if (parent.y instanceof Y.Map) {
          if (op[0] === "delete") {
            parent.y.delete(k);
          } else if (op[0] === "set") {
            const pv = parent.p[k];
            const yv = parent.y.get(k);

            const pvJSON = proxyToJSON(pv);
            const yvJSON = toJSON(yv);

            if (!deepEqual(pvJSON, yvJSON)) {
              insertPValueToY(pv, parent.y, k);
            }
          }
        } else if (parent.y instanceof Y.Array) {
          const pvJSON = proxyToJSON(parent.p);
          const yvJSON = toJSON(parent.y);

          if (deepEqual(yvJSON, pvJSON)) {
            return;
          }

          const arrayOps = parseProxyOps(ops);

          arrayOps.forEach((aOp) => {
            const i = aOp[1];
            if (aOp[0] === "delete") {
              if (parent.y.length > i) {
                parent.y.delete(i, 1);
              }
              return;
            }
            const pv = parent.p[i];
            if (pv === undefined) {
              return;
            }
            if (aOp[0] === "set") {
              if (parent.y.length > i) {
                parent.y.delete(i, 1);
              }
              insertPValueToY(pv, parent.y, i);
            } else if (aOp[0] === "insert") {
              insertPValueToY(pv, parent.y, i);
            }
          });
        }
      });
    });
  });
}

function subscribeY<T>(y: Y.Map<T> | Y.Array<T>, p: Record<string, T> | T[]) {
  const observer = (events: Y.YEvent<any>[]) => {
    events.forEach((event) => {
      const path = event.path;
      const parent = getNestedValues(p, y, path);

      if (parent.y instanceof Y.Map) {
        event.changes.keys.forEach((item, k) => {
          if (item.action === "delete") {
            delete parent.p[k];
          } else {
            const yv = parent.y.get(k);
            insertYValueToP(yv, parent.p, k);
          }
        });
      } else if (parent.y instanceof Y.Array) {
        if (deepEqual(proxyToJSON(parent.p), toJSON(parent.y))) {
          return;
        }

        let retain = 0;
        event.changes.delta.forEach((item) => {
          if (item.retain) {
            retain += item.retain;
          }
          if (item.delete) {
            parent.p.splice(retain, item.delete);
          }
          if (item.insert) {
            if (Array.isArray(item.insert)) {
              item.insert.forEach((yv, i) => {
                insertYValueToP(yv, parent.p, retain + i);
              });
            } else {
              insertYValueToP(item.insert as unknown as T, parent.p, retain);
            }
            retain += item.insert.length;
          }
        });
      }
    });
  };

  y.observeDeep(observer);
  return () => {
    y.unobserveDeep(observer);
  };
}
