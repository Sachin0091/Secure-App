// services/apiService.js
import axios from "axios";
import config from "../config";

const IPQS_KEY = config.IPQS_KEY || "";

// ------------- Email breach (primary: leakcheck, fallback: breachdirectory) --------------
export async function checkEmailBreach(email) {
  try {
    const url = `https://leakcheck.io/api/public?check=${encodeURIComponent(email)}`;
    const r = await axios.get(url, { timeout: 15000 });
    if (r.data) {
      return { ok: true, provider: "leakcheck", breached: !!r.data.found, sources: r.data.sources || [], raw: r.data };
    }
  } catch (e) {
    // ignore and try fallback
  }

  try {
    const url2 = `https://breachdirectory.org/api/?func=auto&term=${encodeURIComponent(email)}`;
    const r2 = await axios.get(url2, { timeout: 15000 });
    if (r2.data && r2.data.success) {
      return { ok: true, provider: "breachdirectory", breached: true, sources: r2.data.result || [], raw: r2.data };
    } else {
      return { ok: true, provider: "breachdirectory", breached: false, sources: [], raw: r2.data };
    }
  } catch (err) {
    return { ok: false, error: "No breach provider responded" };
  }
}

// ------------- URL scan via IPQualityScore -------------
export async function scanUrlIPQS(url) {
  if (!IPQS_KEY) return { ok: false, error: "No IPQS key configured" };
  try {
    const api = `https://ipqualityscore.com/api/json/url/${IPQS_KEY}/${encodeURIComponent(url)}`;
    const r = await axios.get(api, { timeout: 20000 });
    return { ok: true, raw: r.data };
  } catch (err) {
    return { ok: false, error: err.message || "IPQS error" };
  }
}

// ------------- RDAP WHOIS lookup -------------
export async function whoisLookup(domainOrUrl) {
  try {
    const domain = domainOrUrl.replace(/^https?:\/\//i, "").split("/")[0];
    const rdap = `https://rdap.org/domain/${encodeURIComponent(domain)}`;
    const r = await axios.get(rdap, { timeout: 15000 });
    // return parsed useful fields
    const json = r.data;
    const nameservers = (json.nameservers || []).map(ns => (typeof ns === "object" ? ns.ldhName || ns.handle : ns));
    const created = json.events?.find(e => e.eventAction === "registration")?.eventDate || json.created || null;
    const expires = json.events?.find(e => e.eventAction === "expiration")?.eventDate || json.expires || null;
    return { ok: true, raw: json, registrar: json.registrar || null, created, expires, nameservers, country: json.country || null };
  } catch (err) {
    return { ok: false, error: err.message || "RDAP error" };
  }
}
