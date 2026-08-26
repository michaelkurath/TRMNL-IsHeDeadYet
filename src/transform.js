function run(input) {
  const TONE = "grim";
  const people = {
    donald_trump: { subject: "Donald Trump", entityId: "Q22686" },
    joe_biden: { subject: "Joe Biden", entityId: "Q6279" },
    barack_obama: { subject: "Barack Obama", entityId: "Q76" },
    vladimir_putin: { subject: "Vladimir Putin", entityId: "Q7747" },
    xi_jinping: { subject: "Xi Jinping", entityId: "Q15031" },
    kim_jong_un: { subject: "Kim Jong Un", entityId: "Q42313" },
    elon_musk: { subject: "Elon Musk", entityId: "Q317521" },
    rupert_murdoch: { subject: "Rupert Murdoch", entityId: "Q53950" }
  };

  function checkedAt() {
    return new Date().toISOString();
  }

  function payload(value) {
    if (value && value.entities) return value;
    if (value && value.data && value.data.entities) return value.data;
    if (value && value.response && value.response.entities) return value.response;

    if (Array.isArray(value)) {
      for (const item of value) {
        const found = payload(item);
        if (found) return found;
      }
    }

    return null;
  }

  function deathDate(entity) {
    const claims = entity && entity.claims && Array.isArray(entity.claims.P570)
      ? entity.claims.P570
      : [];

    const claim = claims.find((item) => (
      item &&
      item.rank !== "deprecated" &&
      item.mainsnak &&
      item.mainsnak.snaktype === "value" &&
      item.mainsnak.datavalue &&
      item.mainsnak.datavalue.value &&
      item.mainsnak.datavalue.value.time
    ));

    if (!claim) return null;

    const raw = claim.mainsnak.datavalue.value.time;
    const match = raw.match(/[+-]?(\\d{4,})-(\\d{2})-(\\d{2})/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : raw;
  }

  function lineSet() {
    const grimLines = [
      ["Still alive.", "Death remains annoyingly behind schedule.", "No date-of-death claim found in Wikidata."],
      ["Breathing, apparently.", "The reaper appears stuck in administrative review.", "No public death record detected."],
      ["Not dead yet.", "Public records continue to disappoint the impatient.", "Wikidata has not filed a date of death."],
      ["Vitals remain inconvenient.", "The official paperwork refuses to cooperate.", "Public death markers remain absent."],
      ["Still among us.", "Mortality has not filed the update.", "No date-of-death claim is present."],
      ["No obituary yet.", "The long goodbye is taking its time.", "Wikidata still has no death record."],
      ["Alive, regrettably.", "The final notice has not arrived.", "Status check found no fatal paperwork."],
      ["The records say alive.", "Not even Wikidata will call it.", "The public record remains stubbornly unchanged."],
      ["Death clock still idle.", "The grave can keep waiting.", "No confirmed death signal surfaced."],
      ["No curtain call.", "The exit paperwork remains unsigned.", "No Wikidata death date was found."],
      ["Still dodging the headline.", "The end has not made it into the database.", "The public record has not closed the file."],
      ["Not in the ground yet.", "The records remain painfully alive.", "Death confirmation remains missing."]
    ];

    return grimLines[Math.floor(Date.now() / 3600000) % grimLines.length];
  }

  function unknown(person, reason) {
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
      evidence: [{ source: "wikidata-p570", detail: reason }]
    };
  }

  function buildStatus(person, entity) {
    if (!entity || entity.missing !== undefined) {
      return unknown(person, "Wikidata entity data was not returned");
    }

    const date = deathDate(entity);
    if (date) {
      return {
        subject: person.subject,
        tone: TONE,
        status: "dead",
        confidence: "high",
        evidence_count: 1,
        checked_at: checkedAt(),
        headline: "Confirmed dead.",
        subheadline: "The paperwork finally made it through.",
        footer: `Wikidata date of death: ${date}`,
        evidence: [{ source: "wikidata-p570", detail: `Date of death present: ${date}` }]
      };
    }

    const selected = lineSet();
    return {
      subject: person.subject,
      tone: TONE,
      status: "alive",
      confidence: "medium",
      evidence_count: 1,
      checked_at: checkedAt(),
      headline: selected[0],
      subheadline: selected[1],
      footer: selected[2],
      evidence: [{ source: "wikidata-p570", detail: "No date of death claim present" }]
    };
  }

  const source = payload(input);
  const statuses = {};

  Object.keys(people).forEach((key) => {
    const person = people[key];
    const entity = source && source.entities ? source.entities[person.entityId] : null;
    statuses[key] = source
      ? buildStatus(person, entity)
      : unknown(person, "Wikidata polling payload was unavailable");
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
