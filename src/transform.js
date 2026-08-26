async function run(input) {
  const TONE = "grim";
  const people = {
    donald_trump: { subject: "Donald Trump", entityId: "Q22686", wikiTitle: "Donald_Trump" },
    joe_biden: { subject: "Joe Biden", entityId: "Q6279", wikiTitle: "Joe_Biden" },
    barack_obama: { subject: "Barack Obama", entityId: "Q76", wikiTitle: "Barack_Obama" },
    vladimir_putin: { subject: "Vladimir Putin", entityId: "Q7747", wikiTitle: "Vladimir_Putin" },
    xi_jinping: { subject: "Xi Jinping", entityId: "Q15031", wikiTitle: "Xi_Jinping" },
    kim_jong_un: { subject: "Kim Jong Un", entityId: "Q42313", wikiTitle: "Kim_Jong_Un" },
    elon_musk: { subject: "Elon Musk", entityId: "Q317521", wikiTitle: "Elon_Musk" },
    rupert_murdoch: { subject: "Rupert Murdoch", entityId: "Q53950", wikiTitle: "Rupert_Murdoch" }
  };

  function checkedAt() {
    return new Date().toISOString();
  }

  async function fetchJson(url) {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": "TRMNL Is He Dead Yet status checker"
      }
    });

    if (!response.ok) {
      throw new Error(`${url} returned ${response.status}`);
    }

    return response.json();
  }

  function lineSet() {
    const grimLines = [
      ["Still alive.", "Death remains annoyingly behind schedule.", "No qualifying death signals found."],
      ["Breathing, apparently.", "The reaper appears stuck in administrative review.", "No credible death confirmation detected."],
      ["Not dead yet.", "Public records continue to disappoint the impatient.", "Living-person signals still outweigh the rest."],
      ["Vitals remain inconvenient.", "The official paperwork refuses to cooperate.", "Public death markers remain absent."],
      ["Still among us.", "Mortality has not filed the update.", "No date-of-death claim is present."],
      ["No obituary yet.", "The long goodbye is taking its time.", "Wikidata and Wikipedia still lean alive."],
      ["Alive, regrettably.", "The final notice has not arrived.", "Status check found no fatal paperwork."],
      ["The records say alive.", "Not even Wikidata will call it.", "The public record remains stubbornly alive."],
      ["Death clock still idle.", "The grave can keep waiting.", "No confirmed death signal surfaced."],
      ["No curtain call.", "The exit paperwork remains unsigned.", "Living-person evidence still wins."],
      ["Still dodging the headline.", "The end has not made it into the database.", "No public source has closed the file."],
      ["Not in the ground yet.", "The records remain painfully alive.", "Death confirmation remains missing."]
    ];

    return grimLines[Math.floor(Date.now() / 3600000) % grimLines.length];
  }

  function buildStatus(person, deathDate, extraEvidence) {
    const evidence = [];

    if (deathDate) {
      evidence.push({ source: "wikidata-p570", detail: `Date of death present: ${deathDate}` });
    } else {
      evidence.push({ source: "wikidata-p570", detail: "No date of death claim present" });
    }

    (extraEvidence || []).forEach((item) => evidence.push(item));

    const hasDeathCategory = evidence.some((item) => /death-related category detected/i.test(item.detail || ""));
    const hasLivingSignal = evidence.some((item) => /living people|living biography/i.test(item.detail || ""));
    const isDead = Boolean(deathDate || hasDeathCategory);
    const status = isDead ? "dead" : "alive";
    const confidence = deathDate ? "high" : (hasLivingSignal ? "high" : "medium");

    if (isDead) {
      return {
        subject: person.subject,
        tone: TONE,
        status,
        confidence,
        evidence_count: evidence.length,
        checked_at: checkedAt(),
        headline: "Confirmed dead.",
        subheadline: "The paperwork finally made it through.",
        footer: "Death signal detected from public reference data.",
        evidence
      };
    }

    const selected = lineSet();

    return {
      subject: person.subject,
      tone: TONE,
      status,
      confidence,
      evidence_count: evidence.length,
      checked_at: checkedAt(),
      headline: selected[0],
      subheadline: selected[1],
      footer: selected[2],
      evidence
    };
  }

  function fallback(person, reason) {
    return {
      subject: person.subject,
      tone: TONE,
      status: "unknown",
      confidence: "low",
      evidence_count: 1,
      checked_at: checkedAt(),
      headline: "Unable to confirm.",
      subheadline: "The paperwork is missing from the desk.",
      footer: "Status check failed; keeping this conservative.",
      evidence: [{ source: "serverless-transform", detail: reason }]
    };
  }

  async function fetchDeathDates() {
    const ids = Object.values(people).map((person) => `wd:${person.entityId}`).join(" ");
    const query = `SELECT ?person ?dod WHERE { VALUES ?person { ${ids} } OPTIONAL { ?person wdt:P570 ?dod. } }`;
    const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;
    const data = await fetchJson(url);
    const dates = {};

    ((data.results && data.results.bindings) || []).forEach((row) => {
      if (!row.person || !row.person.value || !row.dod || !row.dod.value) return;
      const entityId = row.person.value.split("/").pop();
      dates[entityId] = row.dod.value;
    });

    return dates;
  }

  async function fetchExtraEvidence(person) {
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${person.wikiTitle}`;
    const categoriesUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=categories&titles=${person.wikiTitle}&cllimit=max&format=json&origin=*`;
    const [summaryResult, categoriesResult] = await Promise.allSettled([
      fetchJson(summaryUrl),
      fetchJson(categoriesUrl)
    ]);

    const summary = summaryResult.status === "fulfilled" ? summaryResult.value : null;
    const pages = categoriesResult.status === "fulfilled" && categoriesResult.value && categoriesResult.value.query
      ? categoriesResult.value.query.pages || {}
      : {};
    const categories = Object.keys(pages).flatMap((pageId) => pages[pageId].categories || []);
    const categoryTitles = categories.map((category) => category.title || "");
    const summaryText = `${summary && summary.description ? summary.description : ""} ${summary && summary.extract ? summary.extract : ""}`.trim();
    const extraEvidence = [];

    if (categoryTitles.includes("Category:Living people")) {
      extraEvidence.push({ source: "wikipedia-categories", detail: "Category: Living people present" });
    }

    if (categoryTitles.some((title) => /deaths|burials|assassinated|murdered/i.test(title))) {
      extraEvidence.push({ source: "wikipedia-categories", detail: "Death-related category detected" });
    }

    if (/\bis\b|current|serves|serving|president|businessman|politician/i.test(summaryText) && !/\bwas\b|died|death|late/i.test(summaryText)) {
      extraEvidence.push({ source: "wikipedia-summary", detail: "Summary wording suggests living biography" });
    }

    if (summaryResult.status === "rejected") {
      extraEvidence.push({ source: "wikipedia-summary", detail: summaryResult.reason.message });
    }

    if (categoriesResult.status === "rejected") {
      extraEvidence.push({ source: "wikipedia-categories", detail: categoriesResult.reason.message });
    }

    return extraEvidence;
  }

  let deathDates = {};
  try {
    deathDates = await fetchDeathDates();
  } catch (error) {
    deathDates = {};
  }

  const entries = await Promise.all(
    Object.keys(people).map(async (key) => {
      const person = people[key];
      try {
        const extraEvidence = await fetchExtraEvidence(person);
        return [key, buildStatus(person, deathDates[person.entityId], extraEvidence)];
      } catch (error) {
        return [key, fallback(person, error && error.message ? error.message : "unknown serverless error")];
      }
    })
  );

  const statuses = {};
  entries.forEach(([key, status]) => {
    statuses[key] = status;
  });

  return {
    people: statuses,
    subject: statuses.donald_trump.subject,
    tone: statuses.donald_trump.tone,
    status: statuses.donald_trump.status,
    confidence: statuses.donald_trump.confidence,
    evidence_count: statuses.donald_trump.evidence_count,
    checked_at: statuses.donald_trump.checked_at,
    headline: statuses.donald_trump.headline,
    subheadline: statuses.donald_trump.subheadline,
    footer: statuses.donald_trump.footer,
    evidence: statuses.donald_trump.evidence
  };
}