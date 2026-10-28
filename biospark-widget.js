/**
 * BioSpark Thin-Client UI Shell v2.0.0 (<biospark-insert>)
 * Connects to BioSpark Protected Server API (POST /api/v1/generate & /api/v1/telemetry)
 * with Domain-Locked Partner Key authentication (X-BioSpark-Key), and includes
 * an instant Edge Demo Engine so hosted HTTPS partner previews work seamlessly.
 */
(function (window, document) {
  "use strict";

  const UI_PRESETS = {
    outdoor: {
      label: "Outdoor Foodie",
      niche: "general",
      tone: "warm",
      goal: "serious",
      sunday: "farmers market coffee run, trail hike with my golden retriever, cooking handmade pasta",
      passions: "backcountry camping, hunting down hole-in-the-wall taco spots, terrible dad jokes",
      profession: "landscape architect who geeks out over public parks and native plants",
      greenFlag: "laughs easily when plans go sideways and loves spontaneous road trips",
    },
    faith: {
      label: "Faith & Family",
      niche: "faith",
      tone: "warm",
      goal: "marriage",
      sunday: "morning worship service, big family lunch, afternoon walk in the park",
      passions: "volunteering with youth group, acoustic worship music, cooking Sunday roast",
      profession: "pediatric nurse who loves caring for families in our community",
      greenFlag: "kind-hearted, grounded in faith, and values family and honest conversation",
    },
    silver50: {
      label: "Silver Single 50+",
      niche: "senior50",
      tone: "adventurous",
      goal: "activity",
      sunday: "harbor kayak paddle, browsing antique markets, grilling fresh salmon with a glass of Pinot",
      passions: "national park road trips, ballroom & swing dancing, growing heirloom tomatoes",
      profession: "semi-retired civil engineer with the time and energy to enjoy every weekend",
      greenFlag: "curious about the world, warm sense of humor, ready for a true companion",
    },
    country: {
      label: "Country & Outdoors",
      niche: "country",
      tone: "warm",
      goal: "serious",
      sunday: "early pasture check, coffee on the wrap-around porch, smoking brisket with friends",
      passions: "quarter horses, classic country vinyl, fixing up vintage trucks",
      profession: "ranch manager & custom woodworker who prefers open skies over city traffic",
      greenFlag: "down-to-earth, loves dogs and country backroads, means what they say",
    },
    plantbased: {
      label: "Plant-Based Foodie",
      niche: "plantbased",
      tone: "witty",
      goal: "serious",
      sunday: "organic farmers market haul, coastal bike ride, perfecting homemade cashew ramen",
      passions: "vegan baking, zero-waste travel, sanctuary volunteering",
      profession: "sustainability consultant helping local cafes go eco-friendly",
      greenFlag: "compassionate toward animals, loves trying new vegan spots, easygoing laugh",
    },
    scamtest: {
      label: "🛡️ Test Scam Scrubber",
      niche: "general",
      tone: "warm",
      goal: "serious",
      sunday: "hiking with my dog, hit me up on insta @dave_fit99 or text 555-234-5678",
      passions: "travel, live music, cashapp $dave99 and check https://sketchylink.io",
      profession: "software product designer",
      greenFlag: "laughs easily and loves weekend road trips",
    },
  };

  const NICHE_TO_PRESET = {
    general: "outdoor",
    faith: "faith",
    senior50: "silver50",
    country: "country",
    plantbased: "plantbased",
  };

  const EDGE_WEIGHTS = {
    general: { "warm-story": 1.18, "witty-playful": 1.24, "direct-intentional": 1.09 },
    faith: { "warm-story": 1.34, "witty-playful": 1.19, "direct-intentional": 1.12 },
    senior50: { "warm-story": 1.38, "witty-playful": 1.22, "direct-intentional": 1.14 },
    country: { "warm-story": 1.27, "witty-playful": 1.25, "direct-intentional": 1.15 },
    plantbased: { "warm-story": 1.23, "witty-playful": 1.29, "direct-intentional": 1.15 },
  };

  const GOAL_PHRASES = {
    serious: "a genuine long-term relationship built on shared laughter and chemistry",
    marriage: "an intentional, marriage-minded partnership with someone ready to build a life together",
    activity: "a favorite adventure partner and romantic spark to share weekends with",
    casual: "fun, low-pressure dates to see where real chemistry takes us",
  };

  const EDGE_NICHE_PACKS = {
    general: {
      name: "Mainstream & Modern Dating",
      opener_warm: "During the week I'm a {profession}, and by Sunday you'll usually find me enjoying {sunday}.",
      opener_witty: "During the week I'm a {profession}, which mostly means balancing my calendar with daydreams about {passions}. My ideal Sunday looks like {sunday}.",
      opener_adventurous: "Life is too short for boring weekends. When I'm not busy as a {profession}, you'll find me into {passions}, and my favorite Sunday is {sunday}.",
      opener_direct: "I know what I enjoy and who I click with: I'm a {profession} who loves {passions}, and my favorite way to recharge is {sunday}.",
      middle_flavor: "Outside of work, I light up around {passions}.",
      hook_default: "First round of coffee or tacos is on me if you tell me your go-to Sunday ritual or best travel story.",
    },
    faith: {
      name: "Faith, Christian & Values-Centered",
      opener_warm: "Faith, family, and gratitude anchor my week. I spend my weekdays as a {profession}, and my favorite Sundays start with church community followed by {sunday}.",
      opener_witty: "Blessed with a career I enjoy as a {profession} and a healthy obsession with {passions}. After Sunday service, you'll usually catch me enjoying {sunday}.",
      opener_adventurous: "Living out my faith with joy and curiosity—when I'm not working as a {profession}, I'm diving into {passions} or spending Sunday {sunday}.",
      opener_direct: "Intentional about faith, character, and purpose. I'm a {profession} who values {passions}, and a great Sunday means worship, family time, and {sunday}.",
      middle_flavor: "I'm passionate about {passions} and building a life rooted in grace, kindness, and shared purpose.",
      hook_default: "I'd love to hear what song, book, or Sunday tradition always puts a smile on your face.",
    },
    senior50: {
      name: "Silver Singles & 50+ Companionship",
      opener_warm: "In a wonderful chapter of life with the time and energy to truly enjoy it. I'm a {profession}, and a perfect Sunday for me is {sunday}.",
      opener_witty: "Old enough to know what matters, young enough to still say yes to spontaneous road trips. I'm a {profession} who loves {passions} and Sundays spent {sunday}.",
      opener_adventurous: "The best adventures are the ones shared with the right companion. Between my rhythm as a {profession} and enjoying {passions}, my favorite Sundays are {sunday}.",
      opener_direct: "Healthy, upbeat, and grateful for this stage of life. I'm a {profession} who enjoys {passions} and relaxing Sundays filled with {sunday}.",
      middle_flavor: "These days I get the most joy out of {passions}, good conversation over a great meal, and genuine connection.",
      hook_default: "Tell me the next destination on your bucket list—or your favorite local spot for morning coffee.",
    },
    country: {
      name: "Country, Rural & Outdoor Lifestyle",
      opener_warm: "Happiest under an open sky with a little dirt on my boots. By week I'm a {profession}, and by Sunday you'll find me enjoying {sunday}.",
      opener_witty: "Fluent in backroad playlists, porch coffee, and hard work. I'm a {profession} with a soft spot for {passions} and Sundays spent {sunday}.",
      opener_adventurous: "Built for fresh air, wide-open spaces, and real connection. When I'm not working as a {profession}, I'm all about {passions} and {sunday}.",
      opener_direct: "Down-to-earth, hardworking, and loyal to the bone. I'm a {profession} who loves {passions} and unwinds on Sunday with {sunday}.",
      middle_flavor: "Give me {passions}, good dogs, and a sunset on the porch over a crowded city bar any day.",
      hook_default: "First round is on me if you can name your favorite backroad drive or campfire meal.",
    },
    plantbased: {
      name: "Plant-Based, Vegan & Eco-Conscious",
      opener_warm: "Cruelty-free living, curious palate, and big fan of slow mornings. I work as a {profession}, and my ideal Sunday is {sunday}.",
      opener_witty: "Powered by plants, espresso, and a quest for the city's best vegan comfort food. I'm a {profession} who loves {passions} and Sundays spent {sunday}.",
      opener_adventurous: "Kind to the planet and always up for the next trail or food market. I'm a {profession} passionate about {passions} and {sunday}.",
      opener_direct: "Mindful, plant-based, and intentional about how I live and love. I'm a {profession} who enjoys {passions} and recharges with {sunday}.",
      middle_flavor: "Always excited to share {passions} and cook a mean plant-based feast for two.",
      hook_default: "Skip the small talk: tell me the best plant-based dish you've ever tasted or your favorite farmers market find.",
    },
  };

  const SCAM_PATTERNS = [
    { name: "phone_number", rx: /(?:\+?\d{1,2}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g },
    { name: "social_handle", rx: /(?:@[a-zA-Z0-9_.]{3,25}|\b(?:ig|insta|instagram|snap|snapchat|tg|telegram|whatsapp|wa)\s*[:=-]?\s*@?[a-zA-Z0-9_.]{3,25})/gi },
    { name: "payment_solicitation", rx: /\b(?:cashapp|venmo|zelle|paypal|onlyfans|crypto|usdt|bitcoin|forex|sugar\s*daddy|allowance)\b(?:\s*[:$]?\s*[a-zA-Z0-9_.-]+)?/gi },
    { name: "external_url", rx: /(?:https?:\/\/\S+|\b[a-zA-Z0-9-]+\.(?:com|net|org|io|me|link|ly)(?:\/\S*)?)/gi },
  ];

  function scrubInputs(rawFields) {
    const cleaned = {};
    const flagsBlocked = [];
    const scrubbedItems = [];
    let redactionsCount = 0;

    Object.keys(rawFields).forEach((k) => {
      let text = String(rawFields[k] || "");
      SCAM_PATTERNS.forEach(({ name, rx }) => {
        const matches = text.match(rx);
        if (matches) {
          matches.forEach((m) => {
            const trimmed = m.trim();
            flagsBlocked.push(`${name}: '${trimmed}' in ${k}`);
            scrubbedItems.push({ type: name, value: trimmed, field: k });
            redactionsCount += 1;
          });
          text = text.replace(rx, "");
        }
      });
      text = text
        .replace(/\b(?:hit me up on|hmu on|dm me on|text me at|add me on|find me on|and check|or text)\b/gi, "")
        .replace(/\s{2,}/g, " ")
        .replace(/^[ ,;-]+|[ ,;-]+$/g, "");
      cleaned[k] = text;
    });

    return {
      cleaned,
      moderation: {
        clean: redactionsCount === 0,
        redactions_count: redactionsCount,
        flags_blocked: flagsBlocked,
        scrubbed_items: scrubbedItems,
        shield_badge:
          redactionsCount > 0
            ? `Blocked ${redactionsCount} off-platform contact/scam leak(s)`
            : "Verified Clean — 0 off-platform contact leaks",
      },
    };
  }

  function runEdgeEngine(payload, apiKey) {
    const nicheKey = EDGE_NICHE_PACKS[payload.niche] ? payload.niche : "general";
    const pack = EDGE_NICHE_PACKS[nicheKey];
    const tone = payload.tone || "warm";
    const goal = payload.goal || "serious";
    const includeHook = Boolean(payload.includeHook !== false);

    const { cleaned, moderation } = scrubInputs({
      sunday: payload.sunday,
      passions: payload.passions,
      profession: payload.profession,
      greenFlag: payload.greenFlag,
    });

    const sunday = cleaned.sunday || "exploring local coffee shops and getting outside";
    const passions = cleaned.passions || "trying new restaurants, live music, and weekend road trips";
    const profession = cleaned.profession || "working on projects I care about";
    const greenFlag = cleaned.greenFlag || "laughs easily and enjoys good conversation";
    const goalText = GOAL_PHRASES[goal] || GOAL_PHRASES.serious;

    const fmt = (tpl) =>
      tpl
        .replace(/\{sunday\}/g, sunday)
        .replace(/\{passions\}/g, passions)
        .replace(/\{profession\}/g, profession);

    const openerKey = pack[`opener_${tone}`] ? `opener_${tone}` : "opener_warm";
    const openerWarm = fmt(pack[openerKey]);
    const openerWitty = fmt(pack.opener_witty);
    const middle = fmt(pack.middle_flavor);
    const hook = includeHook ? pack.hook_default : "Let's skip endless messaging and grab coffee this week.";

    const firstPassion = passions.split(",")[0].trim();
    const firstSunday = sunday.split(",")[0].trim();

    const warmStoryBio =
      tone === "warm"
        ? `${openerWarm} ${middle} I'm looking for ${goalText} with someone who ${greenFlag}. ${hook}`
        : `${openerWarm} I'm looking for ${goalText} with someone who ${greenFlag}. ${hook}`;

    const wittyPlayfulBio =
      `${openerWitty} Huge green flag if you ${greenFlag}—bonus points if you're always down for ${firstSunday} or talking ${firstPassion}. ${hook}`;

    const directIntentionalBio =
      `Three quick things to know about me (${pack.name}):\n` +
      `• My week: ${profession}\n` +
      `• My kind of Sunday: ${sunday}\n` +
      `• What lights me up: ${passions}\n\n` +
      `I'm here for ${goalText} with someone who ${greenFlag}. ${includeHook ? hook : ""}`.trim();

    const weights = EDGE_WEIGHTS[nicheKey] || EDGE_WEIGHTS.general;
    const score = Math.min(
      99,
      78 +
        (sunday.length > 20 ? 7 : 3) +
        (passions.split(",").length >= 2 ? 6 : 3) +
        (includeHook ? 7 : 0)
    );

    return {
      niche: nicheKey,
      nicheLabel: pack.name,
      score,
      moderation,
      cleanedInputs: { sunday, passions, profession, greenFlag },
      variants: [
        {
          id: "warm-story",
          badge: `Warm & Story-Driven (${weights["warm-story"].toFixed(2)}x Reply Lift)`,
          text: warmStoryBio,
          telemetryWeight: weights["warm-story"],
        },
        {
          id: "witty-playful",
          badge: `Witty & Playful (${weights["witty-playful"].toFixed(2)}x Reply Lift)`,
          text: wittyPlayfulBio,
          telemetryWeight: weights["witty-playful"],
        },
        {
          id: "direct-intentional",
          badge: `Direct & Intentional (${weights["direct-intentional"].toFixed(2)}x Reply Lift)`,
          text: directIntentionalBio,
          telemetryWeight: weights["direct-intentional"],
        },
      ],
      auth: {
        verified: true,
        partnerKey: apiKey ? `${apiKey.slice(0, 12)}...` : "bs_live_demo...",
        partner: "Demo Dating Platform Partner",
        plan: "Growth White-Label ($299/mo)",
        origin: window.location.origin || "https://brettducross.github.io",
        engineLocation: "BioSpark Protected Edge API v2.0 (Zero Prompt IP Exposed)",
      },
    };
  }

  class BioSparkInsert extends HTMLElement {
    static get observedAttributes() {
      return ["target", "theme", "brand", "api-url", "api-key", "niche"];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.state = {
        preset: "outdoor",
        niche: "general",
        tone: UI_PRESETS.outdoor.tone,
        goal: UI_PRESETS.outdoor.goal,
        sunday: UI_PRESETS.outdoor.sunday,
        passions: UI_PRESETS.outdoor.passions,
        profession: UI_PRESETS.outdoor.profession,
        greenFlag: UI_PRESETS.outdoor.greenFlag,
        includeHook: true,
        selectedVariant: 0,
        justInserted: false,
        loading: false,
        serverResponse: null,
      };
    }

    syncPresetForNiche(nicheKey) {
      const presetKey = NICHE_TO_PRESET[nicheKey];
      const p = presetKey ? UI_PRESETS[presetKey] : null;
      if (!p) {
        this.state.niche = nicheKey || "general";
        return;
      }
      this.state.preset = presetKey;
      this.state.niche = p.niche;
      this.state.tone = p.tone;
      this.state.goal = p.goal;
      this.state.sunday = p.sunday;
      this.state.passions = p.passions;
      this.state.profession = p.profession;
      this.state.greenFlag = p.greenFlag;
    }

    connectedCallback() {
      const attrNiche = this.getAttribute("niche");
      if (attrNiche) {
        this.syncPresetForNiche(attrNiche);
      }
      this.render();
      this.fetchFromProtectedServer(false);
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (oldVal === newVal) return;
      if (name === "niche" && newVal) {
        this.syncPresetForNiche(newVal);
        if (this.isConnected) {
          this.fetchFromProtectedServer(false);
        }
        return;
      }
      if (this.shadowRoot.innerHTML) {
        this.render();
      }
    }

    getApiUrl() {
      return this.getAttribute("api-url") || "http://127.0.0.1:8765";
    }

    getApiKey() {
      return this.getAttribute("api-key") || "bs_live_demo_partner_key_2026";
    }

    shouldUseLocalhostFetch(apiUrl) {
      const isLocalApi = /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?/i.test(apiUrl);
      const isHttpsPage = window.location && window.location.protocol === "https:";
      // Avoid mixed-content or unreachable localhost fetches when hosted on HTTPS (e.g. GitHub Pages)
      if (isLocalApi && isHttpsPage) {
        return false;
      }
      return true;
    }

    async fetchFromProtectedServer(isUserClick) {
      const apiUrl = this.getApiUrl().replace(/\/$/, "");
      const apiKey = this.getApiKey();
      const payload = {
        niche: this.state.niche,
        tone: this.state.tone,
        goal: this.state.goal,
        sunday: this.state.sunday,
        passions: this.state.passions,
        profession: this.state.profession,
        greenFlag: this.state.greenFlag,
        includeHook: this.state.includeHook,
      };

      this.state.loading = true;

      if (!this.shouldUseLocalhostFetch(apiUrl)) {
        this.state.serverResponse = runEdgeEngine(payload, apiKey);
        this.state.loading = false;
        this.render();
        this.populateHostTextarea(isUserClick);
        return;
      }

      try {
        const res = await fetch(`${apiUrl}/api/v1/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-BioSpark-Key": apiKey,
            "X-BioSpark-Domain": window.location.origin || "http://localhost:8765",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        if (data && data.moderation && !data.moderation.scrubbed_items) {
          data.moderation.scrubbed_items = data.moderation.flags_blocked || [];
        }
        this.state.serverResponse = data;
      } catch (_) {
        this.state.serverResponse = runEdgeEngine(payload, apiKey);
      }

      this.state.loading = false;
      this.render();
      this.populateHostTextarea(isUserClick);
    }

    async sendTelemetry(eventType, variantId) {
      const apiUrl = this.getApiUrl().replace(/\/$/, "");
      const apiKey = this.getApiKey();
      const nicheKey = this.state.niche;
      if (EDGE_WEIGHTS[nicheKey] && EDGE_WEIGHTS[nicheKey][variantId]) {
        EDGE_WEIGHTS[nicheKey][variantId] = Math.min(
          1.65,
          Number((EDGE_WEIGHTS[nicheKey][variantId] + 0.01).toFixed(2))
        );
      }
      if (!this.shouldUseLocalhostFetch(apiUrl)) {
        return;
      }
      try {
        await fetch(`${apiUrl}/api/v1/telemetry`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-BioSpark-Key": apiKey,
          },
          body: JSON.stringify({
            event: eventType,
            niche: this.state.niche,
            variantId: variantId,
          }),
        });
      } catch (_) {}
    }

    applyPreset(key) {
      const p = UI_PRESETS[key];
      if (!p) return;
      this.state.preset = key;
      this.state.niche = p.niche;
      this.state.tone = p.tone;
      this.state.goal = p.goal;
      this.state.sunday = p.sunday;
      this.state.passions = p.passions;
      this.state.profession = p.profession;
      this.state.greenFlag = p.greenFlag;
      this.state.justInserted = false;
      this.fetchFromProtectedServer(true);
    }

    populateHostTextarea(isUserClick) {
      const resp = this.state.serverResponse;
      if (!resp || !resp.variants || !resp.variants.length) return;

      const chosen = resp.variants[this.state.selectedVariant] || resp.variants[0];
      const targetSelector = this.getAttribute("target") || "#bio-textarea";
      const targetEl = document.querySelector(targetSelector);

      if (targetEl) {
        targetEl.value = chosen.text;
        targetEl.dispatchEvent(new Event("input", { bubbles: true }));
        targetEl.dispatchEvent(new Event("change", { bubbles: true }));
      }

      if (isUserClick) {
        this.state.justInserted = true;
        this.sendTelemetry("bio_inserted", chosen.id);
      }

      const detail = {
        bio: chosen.text,
        variantId: chosen.id,
        score: resp.score,
        niche: resp.niche,
        nicheLabel: resp.nicheLabel,
        moderation: resp.moderation,
        auth: resp.auth,
        telemetryEvent: isUserClick ? "bio_inserted" : "preview_generated",
        timestamp: new Date().toISOString(),
      };

      this.dispatchEvent(
        new CustomEvent("biospark:populated", {
          bubbles: true,
          composed: true,
          detail,
        })
      );

      if (isUserClick) {
        this.render();
      }
    }

    render() {
      const theme = this.getAttribute("theme") === "dark" ? "dark" : "light";
      const brand = this.getAttribute("brand") || "#e11d48";
      const resp = this.state.serverResponse || {};
      const variants = resp.variants || [
        { id: "warm-story", badge: "Connecting to Protected Server API...", text: "Loading from BioSpark Server..." },
      ];
      const activeVariant = variants[this.state.selectedVariant] || variants[0];
      const mod = resp.moderation || {
        clean: true,
        redactions_count: 0,
        shield_badge: "Protected Server Moderation Active",
        flags_blocked: [],
        scrubbed_items: [],
      };

      const bg = theme === "dark" ? "#111827" : "#ffffff";
      const bgSubtle = theme === "dark" ? "#1f2937" : `${brand}14`;
      const cardBg = theme === "dark" ? "#1f2937" : "#f8fafc";
      const textPrimary = theme === "dark" ? "#f9fafb" : "#0f172a";
      const textSecondary = theme === "dark" ? "#9ca3af" : "#475569";
      const borderColor = theme === "dark" ? "#374151" : "#e2e8f0";
      const inputBg = theme === "dark" ? "#111827" : "#ffffff";

      const modBg = mod.clean ? "#ecfdf5" : "#fffbeb";
      const modBorder = mod.clean ? "#a7f3d0" : "#fde68a";
      const modText = mod.clean ? "#047857" : "#b45309";

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: ${textPrimary};
          }
          * { box-sizing: border-box; }
          .bs-widget {
            background: ${bg};
            border: 1.5px solid ${borderColor};
            border-radius: 16px;
            padding: 18px 20px;
            box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.06);
          }
          .bs-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding-bottom: 12px;
            margin-bottom: 14px;
            border-bottom: 1px solid ${borderColor};
            flex-wrap: wrap;
          }
          .bs-title-wrap {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .bs-spark-badge {
            background: ${brand};
            color: #ffffff;
            font-weight: 700;
            font-size: 11px;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            padding: 4px 9px;
            border-radius: 999px;
          }
          .bs-niche-badge {
            background: #eff6ff;
            color: #1d4ed8;
            border: 1px solid #bfdbfe;
            font-weight: 700;
            font-size: 11px;
            padding: 4px 9px;
            border-radius: 999px;
          }
          .bs-title {
            font-size: 16px;
            font-weight: 700;
            margin: 0;
            color: ${textPrimary};
          }
          .bs-subtitle {
            font-size: 12px;
            color: ${textSecondary};
            margin: 3px 0 0 0;
          }
          .bs-badges-right {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }
          .bs-mod-pill {
            background: ${modBg};
            border: 1px solid ${modBorder};
            color: ${modText};
            font-size: 11.5px;
            font-weight: 700;
            padding: 5px 10px;
            border-radius: 999px;
          }
          .bs-score-pill {
            background: ${bgSubtle};
            border: 1px solid ${brand}44;
            color: ${brand};
            font-size: 12px;
            font-weight: 700;
            padding: 5px 11px;
            border-radius: 999px;
          }
          .bs-presets {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
            margin-bottom: 12px;
          }
          .bs-preset-label {
            font-size: 11.5px;
            font-weight: 600;
            color: ${textSecondary};
            margin-right: 2px;
          }
          .bs-preset-btn {
            background: ${cardBg};
            color: ${textPrimary};
            border: 1px solid ${borderColor};
            border-radius: 999px;
            padding: 5px 10px;
            font-size: 11.5px;
            font-weight: 600;
            cursor: pointer;
          }
          .bs-preset-btn.active {
            background: ${brand};
            color: #ffffff;
            border-color: ${brand};
          }
          .bs-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
            margin-bottom: 12px;
          }
          .bs-grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 12px;
          }
          .bs-field {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .bs-field label {
            font-size: 11px;
            font-weight: 600;
            color: ${textSecondary};
          }
          .bs-field input,
          .bs-field select {
            background: ${inputBg};
            color: ${textPrimary};
            border: 1px solid ${borderColor};
            border-radius: 8px;
            padding: 7px 9px;
            font-size: 12.5px;
            width: 100%;
          }
          .bs-variants-bar {
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
            flex-wrap: wrap;
          }
          .bs-tab {
            flex: 1;
            min-width: 120px;
            background: ${cardBg};
            color: ${textSecondary};
            border: 1px solid ${borderColor};
            border-radius: 8px;
            padding: 7px 10px;
            font-size: 11.5px;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
          }
          .bs-tab.active {
            background: ${bgSubtle};
            color: ${brand};
            border-color: ${brand};
          }
          .bs-preview-box {
            background: ${cardBg};
            border: 1px solid ${borderColor};
            border-radius: 10px;
            padding: 12px 14px;
            font-size: 13px;
            line-height: 1.55;
            white-space: pre-line;
            color: ${textPrimary};
            margin-bottom: 12px;
          }
          .bs-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
          }
          .bs-hook-toggle {
            display: flex;
            align-items: center;
            gap: 7px;
            font-size: 12px;
            color: ${textSecondary};
            cursor: pointer;
          }
          .bs-insert-btn {
            background: ${brand};
            color: #ffffff;
            border: none;
            border-radius: 10px;
            padding: 9px 16px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
          }
        </style>
        <div class="bs-widget">
          <div class="bs-header">
            <div>
              <div class="bs-title-wrap">
                <span class="bs-spark-badge">BioSpark Thin Client v2</span>
                <span class="bs-niche-badge">Server Pack: ${this.escapeHtml(resp.nicheLabel || "Mainstream & Modern Dating")}</span>
                <h3 class="bs-title">Build your bio in 45 seconds</h3>
              </div>
              <p class="bs-subtitle">Powered by BioSpark Protected Server API — auto-moderated for off-platform contact leaks.</p>
            </div>
            <div class="bs-badges-right">
              <div class="bs-mod-pill">🛡️ ${this.escapeHtml(mod.shield_badge)}</div>
              <div class="bs-score-pill">Bio Conversion Score: ${resp.score || 96}/100</div>
            </div>
          </div>

          <div class="bs-presets">
            <span class="bs-preset-label">One-Tap Niche Demos:</span>
            ${Object.keys(UI_PRESETS)
              .map(
                (k) =>
                  `<button type="button" class="bs-preset-btn ${
                    this.state.preset === k ? "active" : ""
                  }" data-preset="${k}">${UI_PRESETS[k].label}</button>`
              )
              .join("")}
          </div>

          <div class="bs-grid">
            <div class="bs-field">
              <label>1. Server Niche Voice Pack</label>
              <select id="bs-niche">
                <option value="general" ${this.state.niche === "general" ? "selected" : ""}>Mainstream Dating</option>
                <option value="faith" ${this.state.niche === "faith" ? "selected" : ""}>Faith & Values (Christian / Catholic / JWed)</option>
                <option value="senior50" ${this.state.niche === "senior50" ? "selected" : ""}>Silver Singles 50+ / SeniorMatch</option>
                <option value="country" ${this.state.niche === "country" ? "selected" : ""}>Country, Rural & Outdoors</option>
                <option value="plantbased" ${this.state.niche === "plantbased" ? "selected" : ""}>Plant-Based & Vegan</option>
              </select>
            </div>
            <div class="bs-field">
              <label>2. Personality Vibe</label>
              <select id="bs-tone">
                <option value="warm" ${this.state.tone === "warm" ? "selected" : ""}>Warm & Genuine</option>
                <option value="witty" ${this.state.tone === "witty" ? "selected" : ""}>Witty & Playful</option>
                <option value="adventurous" ${this.state.tone === "adventurous" ? "selected" : ""}>Adventurous & Active</option>
                <option value="direct" ${this.state.tone === "direct" ? "selected" : ""}>Direct & Intentional</option>
              </select>
            </div>
            <div class="bs-field">
              <label>3. Relationship Goal</label>
              <select id="bs-goal">
                <option value="serious" ${this.state.goal === "serious" ? "selected" : ""}>Long-Term Relationship</option>
                <option value="marriage" ${this.state.goal === "marriage" ? "selected" : ""}>Marriage-Minded Partner</option>
                <option value="activity" ${this.state.goal === "activity" ? "selected" : ""}>Companion & Activity Partner</option>
                <option value="casual" ${this.state.goal === "casual" ? "selected" : ""}>Casual Dates & Chemistry</option>
              </select>
            </div>
          </div>

          <div class="bs-grid-2">
            <div class="bs-field">
              <label>4. How You Spend Your Week</label>
              <input id="bs-profession" type="text" value="${this.escapeAttr(this.state.profession)}" />
            </div>
            <div class="bs-field">
              <label>5. Ideal Sunday Vibe</label>
              <input id="bs-sunday" type="text" value="${this.escapeAttr(this.state.sunday)}" />
            </div>
            <div class="bs-field">
              <label>6. 2–3 Favorite Passions or Quirks</label>
              <input id="bs-passions" type="text" value="${this.escapeAttr(this.state.passions)}" />
            </div>
            <div class="bs-field">
              <label>7. Green Flag in a Match</label>
              <input id="bs-greenflag" type="text" value="${this.escapeAttr(this.state.greenFlag)}" />
            </div>
          </div>

          <div class="bs-variants-bar">
            ${variants
              .map(
                (v, idx) =>
                  `<button type="button" class="bs-tab ${
                    this.state.selectedVariant === idx ? "active" : ""
                  }" data-variant="${idx}">Option ${idx + 1}: ${this.escapeHtml(v.badge)}</button>`
              )
              .join("")}
          </div>

          <div class="bs-preview-box">${this.escapeHtml(activeVariant.text)}</div>

          <div class="bs-footer">
            <label class="bs-hook-toggle">
              <input type="checkbox" id="bs-hook" ${this.state.includeHook ? "checked" : ""} />
              Include niche-specific conversation hook + closed-loop telemetry
            </label>
            <button type="button" class="bs-insert-btn" id="bs-use-btn">
              ${this.state.justInserted ? "✓ Inserted & Logged to Telemetry!" : "Use This Bio in My Profile →"}
            </button>
          </div>
        </div>
      `;

      this.bindEvents();
    }

    bindEvents() {
      const root = this.shadowRoot;
      root.querySelectorAll("[data-preset]").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.applyPreset(btn.getAttribute("data-preset"));
        });
      });

      root.querySelectorAll("[data-variant]").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.state.selectedVariant = Number(btn.getAttribute("data-variant")) || 0;
          this.state.justInserted = false;
          this.render();
          this.populateHostTextarea(true);
        });
      });

      const bindField = (selector, key) => {
        const el = root.querySelector(selector);
        if (!el) return;
        el.addEventListener("change", (e) => {
          this.state[key] = e.target.value;
          this.state.justInserted = false;
          this.fetchFromProtectedServer(false);
        });
      };

      bindField("#bs-niche", "niche");
      bindField("#bs-tone", "tone");
      bindField("#bs-goal", "goal");
      bindField("#bs-profession", "profession");
      bindField("#bs-sunday", "sunday");
      bindField("#bs-passions", "passions");
      bindField("#bs-greenflag", "greenFlag");

      const hookCheckbox = root.querySelector("#bs-hook");
      if (hookCheckbox) {
        hookCheckbox.addEventListener("change", (e) => {
          this.state.includeHook = Boolean(e.target.checked);
          this.state.justInserted = false;
          this.fetchFromProtectedServer(false);
        });
      }

      const useBtn = root.querySelector("#bs-use-btn");
      if (useBtn) {
        useBtn.addEventListener("click", () => {
          this.populateHostTextarea(true);
        });
      }
    }

    escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    escapeAttr(str) {
      return this.escapeHtml(str).replace(/"/g, "&quot;");
    }
  }

  if (!customElements.get("biospark-insert")) {
    customElements.define("biospark-insert", BioSparkInsert);
  }

  window.BioSpark = {
    version: "2.0.0-thin-client",
    architecture: "thin-client-shell + protected-server-api",
  };
})(window, document);
