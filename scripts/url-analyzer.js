
const UrlAnalyzer = (() => {
  const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

  function parse(input) {
    if (typeof input !== "string" || !input.trim()) {
      throw new Error("Enter a URL to analyze.");
    }

    const value = input.trim();
    const candidate = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value)
      ? value
      : `https://${value}`;

    let url;

    try {
      url = new URL(candidate);
    } catch {
      throw new Error("Invalid URL format.");
    }

    if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
      throw new Error("Only HTTP and HTTPS URLs are supported.");
    }

    if (!url.hostname || url.username || url.password) {
      throw new Error("Invalid hostname or embedded credentials.");
    }

    if (url.hostname.endsWith(".") || url.hostname.includes("%")) {
      throw new Error("Unusual hostname format; inspect it manually.");
    }

    const hostname = url.hostname.toLowerCase();
    const ipv4Pattern =
      /^(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;

    const isIpv4 = ipv4Pattern.test(hostname);
    const isPunycode = hostname.split(".").some(label =>
      label.startsWith("xn--")
    );

    return {
      href: url.href,
      protocol: url.protocol,
      hostname,
      labels: hostname.split("."),
      pathname: url.pathname,
      search: url.search,
      port: url.port,
      isIpv4,
      isPunycode,
      hasCredentials: Boolean(url.username || url.password)
    };
  }

  return { parse };
})();

if (typeof globalThis !== "undefined") {
  globalThis.UrlAnalyzer = UrlAnalyzer;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = UrlAnalyzer;
}
