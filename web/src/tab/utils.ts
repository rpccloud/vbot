function pad2(num: number): string {
  let norm: number = Math.floor(Math.abs(num));
  return (norm < 10 ? "0" : "") + norm.toString(10);
}

function pad3(num: number): string {
  let norm: number = Math.floor(Math.abs(num));
  if (norm < 10) {
    return "00" + norm.toString(10);
  } else if (norm < 100) {
    return "0" + norm.toString(10);
  } else {
    return "" + norm.toString(10);
  }
}

function pad4(num: number): string {
  let norm: number = Math.floor(Math.abs(num));
  if (norm < 10) {
    return "000" + norm.toString(10);
  } else if (norm < 100) {
    return "00" + norm.toString(10);
  } else if (norm < 1000) {
    return "0" + norm.toString(10);
  } else {
    return "" + norm.toString(10);
  }
}

export function convertToIsoDateString(date: Date): string {
  if (date === null || date === undefined) {
    return "";
  }
  let tzo: number = -date.getTimezoneOffset();
  let dif: string = tzo >= 0 ? "+" : "-";
  let year: number = date.getFullYear();
  if (year > 9999) {
    year = 9999;
  }
  return pad4(year) +
    "-" + pad2(date.getMonth() + 1) +
    "-" + pad2(date.getDate()) +
    "T" + pad2(date.getHours()) +
    ":" + pad2(date.getMinutes()) +
    ":" + pad2(date.getSeconds()) +
    "." + pad3(date.getMilliseconds()) +
    dif + pad2(tzo / 60) +
    ":" + pad2(tzo % 60);
}

export function range(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  } else {
    return value;
  }
}

export function stringColorToRGBA(color: string, alpha: number): string {
  alpha = Math.floor(alpha % 256);
  if (color && color.startsWith("#")) {
    if (color.length === 4) {
      const r = parseInt(color[1], 16);
      const g = parseInt(color[2], 16);
      const b = parseInt(color[3], 16);

      if (r >= 0 && g >= 0 && b >= 0) {
        return "rgba("
          + (r * 16 + r).toString() + ","
          + (g * 16 + g).toString() + ","
          + (b * 16 + b).toString() + ","
          + alpha.toString()
          + ")";
      }
    } else if (color.length === 7) {
      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);
      if (r >= 0 && g >= 0 && b >= 0) {
        return "rgba("
          + r.toString() + ","
          + g.toString() + ","
          + b.toString() + ","
          + alpha.toString() + ")";
      }
    }
  }
  return "rgba(0,0,0,0)";
}

export function getHashParam(): { type: string; params: any } {
  const hash = window.location.hash;
  if (hash.length > 0) {
    try {
      const hashParam = JSON.parse(decodeURIComponent(hash.substr(1)));
      if (hashParam.type) {
        return { type: hashParam.type, params: hashParam.params };
      }
    } catch (e) {
      // pass
    }
  }

  return { type: "error", params: null };
}

export function makeHashString(type: string, params: any): string {
  return encodeURIComponent(JSON.stringify({
    type: type,
    params: params
  }));
}

export function parseURL(url: string): [string, string] {
  const schemeRe = /^([a-zA-Z]*):(\/|\\)*/;
  let rawURL = url.trim();
  const matches = rawURL.match(schemeRe);
  if (matches) {
    rawURL = rawURL.replace(schemeRe, "");
    if (matches.length >= 2 && matches[1]) {
      return [matches[1], rawURL];
    } else {
      return ["", rawURL];
    }
  } else {
    return ["", rawURL];
  }
}

export function parseShowURL(url: string): string {
  let [scheme, raw] = parseURL(url);

  if (raw.endsWith("/")) {
    raw = raw.substr(0, raw.length - 1);
  }

  if (!scheme && !raw) {
    return "";
  } else if (scheme === "http" || scheme === "https") {
    return raw;
  } else {
    return `${scheme}://${raw}`;
  }
}

export function makeTabPath(w: number, h: number, radius: number): Path2D {
  let path = new Path2D();
  let r = Math.min(w / 2, h / 2, radius);

  path.moveTo(0, h);
  path.arc(
    0,
    h - r,
    r,
    Math.PI * 0.5,
    0,
    true,
  );
  path.lineTo(r, r);
  path.arc(
    r * 2,
    r,
    r,
    Math.PI,
    Math.PI * 1.5,
    false,
  );
  path.lineTo(w - r * 2, 0);
  path.arc(
    w - r * 2,
    r,
    r,
    Math.PI * 1.5,
    Math.PI * 2,
    false,
  );
  path.lineTo(w - r, h - r);
  path.arc(
    w,
    h - r,
    r,
    Math.PI,
    Math.PI * 0.5,
    true,
  );

  return path;
}
