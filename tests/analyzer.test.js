
const test = require("node:test");
const assert = require("node:assert/strict");

const UrlAnalyzer = require("../scripts/url-analyzer.js");
const RiskEngine = require("../scripts/risk-engine.js");

test("accepts a normal HTTPS URL", () => {
  const parsed = UrlAnalyzer.parse("https://example.com");
  const report = RiskEngine.analyze(parsed);

  assert.equal(parsed.hostname, "example.com");
  assert.equal(report.score, 0);
});

test("flags an HTTP URL", () => {
  const parsed = UrlAnalyzer.parse("http://example.com");
  const report = RiskEngine.analyze(parsed);

  assert.equal(report.score, 15);
});

test("flags an IPv4 URL", () => {
  const parsed = UrlAnalyzer.parse("http://192.0.2.1");
  const report = RiskEngine.analyze(parsed);

  assert.equal(parsed.isIpv4, true);
  assert.equal(report.score, 40);
});

test("rejects unsupported URL schemes", () => {
  assert.throws(
    () => UrlAnalyzer.parse("ftp://example.com"),
    /Only HTTP and HTTPS/
  );
});

test("rejects empty input", () => {
  assert.throws(
    () => UrlAnalyzer.parse(""),
    /Enter a URL/
  );
});

test("caps the risk score at 100", () => {
  const parsed = UrlAnalyzer.parse(
    "http://192.0.2.1:8080/login/verify/account/password"
  );
  const report = RiskEngine.analyze(parsed);

  assert.ok(report.score <= 100);
});
