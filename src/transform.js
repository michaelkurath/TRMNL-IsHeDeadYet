function run(input) {
  const ROTATION_HOUR_MS = 60 * 60 * 1000;
  const people = {
    donald_trump: { subject: "Donald Trump", entityId: "Q22686" },
    joe_biden: { subject: "Joe Biden", entityId: "Q6279" },
    barack_obama: { subject: "Barack Obama", entityId: "Q76" },
    vladimir_putin: { subject: "Vladimir Putin", entityId: "Q7747" },
    xi_jinping: { subject: "Xi Jinping", entityId: "Q15031" },
    kim_jong_un: { subject: "Kim Jong Un", entityId: "Q42313" },
    elon_musk: { subject: "Elon Musk", entityId: "Q317521" },
    rupert_murdoch: { subject: "Rupert Murdoch", entityId: "Q53950" },
    mitch_mcconnell: { subject: "Mitch McConnell", entityId: "Q355522" }
  };

  const aliveLines = {
    dry: [
      ["No death record found.", "The public record contains no confirmed date of death.", "Wikidata P570 · no claim present"],
      ["Status: living.", "No public date-of-death signal is currently recorded.", "Wikidata P570 · no claim present"],
      ["Still alive.", "The available structured record shows no confirmed death.", "Wikidata P570 · no claim present"],
      ["No fatal update.", "Public structured data remains unchanged.", "Wikidata P570 · no claim present"],
      ["Record remains open.", "No date of death has been entered in the public record.", "Wikidata P570 · no claim present"],
      ["No obituary signal.", "The current data contains no confirmed death marker.", "Wikidata P570 · no claim present"]
    ],
    grim: [
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
      ["Not in the ground yet.", "The records remain painfully alive.", "Death confirmation remains missing."],
      ["Still ruining the suspense.", "The anticipated plot twist has been postponed.", "No public date-of-death claim was found."],
      ["Alive and kicking.", "Mostly at the patience of everyone watching.", "Wikidata reports no fatal update."],
      ["The bell has not tolled.", "Apparently it lost the address.", "No confirmed death marker is present."],
      ["Still on this side.", "The other side has not accepted the booking.", "Public records show no date of death."],
      ["The reaper missed again.", "Scheduling remains an issue in the afterlife.", "No Wikidata death claim was detected."],
      ["No final checkout.", "The room remains inconveniently occupied.", "The public record is still open."],
      ["Still consuming oxygen.", "The supply chain remains uninterrupted.", "No confirmed death signal was found."],
      ["The coffin remains empty.", "Its reservation has not been confirmed.", "Wikidata lists no date of death."],
      ["Still evading eternity.", "The deadline has slipped once more.", "No public death record is available."],
      ["Alive by database standards.", "Reality has filed no contradictory paperwork.", "No date-of-death claim is recorded."],
      ["No meeting with the maker.", "The appointment appears to have been rescheduled.", "Public death markers remain absent."],
      ["Still above ground.", "Gravity has yet to finish the job.", "Wikidata has no confirmed death date."],
      ["The obituary can wait.", "Its editor has nothing official to print.", "No public date-of-death signal surfaced."],
      ["Still in circulation.", "The recall notice has not been issued.", "No confirmed death record was found."],
      ["The end credits can wait.", "This episode keeps getting renewed.", "Wikidata still shows no death claim."],
      ["No skeletal promotion yet.", "Management has delayed the transfer indefinitely.", "The public record remains unchanged."],
      ["Still haunting the living.", "Without the courtesy of becoming a ghost first.", "No date-of-death claim is present."],
      ["The exit remains closed.", "Someone misplaced the final key.", "No confirmed fatal update was detected."]
    ],
    pitch_black: [
      ["Still alive.", "Hell has standards.", "Death certificate · not filed"],
      ["Death requested more time.", "The case has been returned for further suffering.", "Final departure · postponed"],
      ["The grave remains optimistic.", "It continues to hold the reservation.", "Burial status · pending"],
      ["Left on read by the reaper.", "Even death is avoiding this conversation.", "Soul collection · unanswered"],
      ["Mortal coil: occupied.", "The tenant has ignored the eviction notice.", "Vacancy underground · none"],
      ["Eternity declined to comment.", "Its legal department recommends patience.", "Afterlife intake · delayed"],
      ["Coffin still unassigned.", "Inventory exists, but no allocation was approved.", "Coffin registry · open"],
      ["Obituary desk idle.", "The headline writers have nothing official.", "Obituary status · pending"],
      ["Application returned.", "The afterlife says several fields were incomplete.", "Departure request · rejected"],
      ["Death avoids responsibility.", "The matter has been referred back to the living.", "Case ownership · disputed"],
      ["Infernal intake delayed.", "The queue downstairs is apparently enormous.", "Admission status · waiting"],
      ["No vacancy underground.", "The graveyard claims it is fully booked.", "Plot allocation · unavailable"],
      ["Departure postponed.", "The final transport failed to arrive.", "Last journey · rescheduled"],
      ["Damnation remains pending.", "Approval from upper management never arrived.", "Eternal status · unresolved"],
      ["Burial request denied.", "Reason given: applicant remains inconveniently alive.", "Grave access · refused"],
      ["The bell refuses to toll.", "Even the bell wants no part of this.", "Final notice · withheld"],
      ["Reaper called in sick.", "There is no replacement on the rota.", "Collection service · suspended"],
      ["Exit interview rescheduled.", "Human Resources says the position is still occupied.", "Case file · remains open"],
      ["Soul on backorder.", "The supply chain to eternity has collapsed.", "Collection ETA · unknown"],
      ["Engraver still waiting.", "The tombstone remains offensively blank.", "Inscription status · empty"],
      ["Last rites premature.", "The ceremony has been asked to stand down.", "Ritual status · cancelled"],
      ["The abyss says not today.", "It has enough problems already.", "Void response · negative"],
      ["Death certificate: draft.", "Nobody has been willing to sign it.", "Official record · incomplete"],
      ["Failing to be deceased.", "Another deadline has passed without results.", "Mortality review · failed"],
      ["No skeletal promotion.", "Management sees no opening in the department.", "Career status · still fleshy"],
      ["Reaper lost the paperwork.", "The filing system has claimed another victim.", "Fatal paperwork · missing"],
      ["Coffin warranty unused.", "The product remains in suspiciously new condition.", "Interment equipment · idle"],
      ["The void has no comment.", "Silence is being interpreted as a refusal.", "Void liaison · unavailable"],
      ["Expiration date withheld.", "The manufacturer refuses to publish it.", "Shelf life · regrettably active"],
      ["Still haunting us alive.", "They skipped the usual requirement of dying first.", "Paranormal status · premature"]
    ]
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
    const match = raw.match(/[+-]?(\d{4,})-(\d{2})-(\d{2})/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : raw;
  }

  function choose(lines) {
    return lines[Math.floor(Date.now() / ROTATION_HOUR_MS) % lines.length];
  }

  function aliveMessages() {
    return Object.fromEntries(Object.entries(aliveLines).map(([tone, lines]) => {
      const selected = choose(lines);
      return [tone, {
        headline: selected[0],
        subheadline: selected[1],
        footer: selected[2]
      }];
    }));
  }

  function deadMessages(date) {
    return {
      dry: {
        headline: "Confirmed deceased.",
        subheadline: "A public date-of-death claim is present.",
        footer: `Wikidata date of death · ${date}`
      },
      grim: {
        headline: "Confirmed dead.",
        subheadline: "The paperwork finally made it through.",
        footer: `Wikidata date of death · ${date}`
      },
      pitch_black: {
        headline: "Case closed.",
        subheadline: "The reaper has finally completed the assignment.",
        footer: `Final departure · ${date}`
      }
    };
  }

  function unknownMessages() {
    return {
      dry: {
        headline: "Unable to confirm.",
        subheadline: "The public status check returned no reliable result.",
        footer: "Verification status · unavailable"
      },
      grim: {
        headline: "Unable to confirm.",
        subheadline: "The paperwork is missing from the desk.",
        footer: "Status check failed · no conclusion drawn"
      },
      pitch_black: {
        headline: "Lost between worlds.",
        subheadline: "Neither the living nor the dead filed the paperwork.",
        footer: "Mortality status · indeterminate"
      }
    };
  }

  function statusRecord(person, status, confidence, messages, evidence) {
    return {
      subject: person.subject,
      status,
      confidence,
      evidence_count: 1,
      checked_at: checkedAt(),
      messages,
      headline: messages.grim.headline,
      subheadline: messages.grim.subheadline,
      footer: messages.grim.footer,
      evidence: [evidence]
    };
  }

  function unknown(person, reason) {
    return statusRecord(
      person,
      "unknown",
      "low",
      unknownMessages(),
      { source: "wikidata-p570", detail: reason }
    );
  }

  function buildStatus(person, entity) {
    if (!entity || entity.missing !== undefined) {
      return unknown(person, "Wikidata entity data was not returned");
    }

    const date = deathDate(entity);
    if (date) {
      return statusRecord(
        person,
        "dead",
        "high",
        deadMessages(date),
        { source: "wikidata-p570", detail: `Date of death present: ${date}` }
      );
    }

    return statusRecord(
      person,
      "alive",
      "medium",
      aliveMessages(),
      { source: "wikidata-p570", detail: "No date of death claim present" }
    );
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
    status: statuses.donald_trump.status,
    confidence: statuses.donald_trump.confidence,
    evidence_count: statuses.donald_trump.evidence_count,
    checked_at: statuses.donald_trump.checked_at,
    messages: statuses.donald_trump.messages,
    headline: statuses.donald_trump.headline,
    subheadline: statuses.donald_trump.subheadline,
    footer: statuses.donald_trump.footer,
    evidence: statuses.donald_trump.evidence
  };
}
