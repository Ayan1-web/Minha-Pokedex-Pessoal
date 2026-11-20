/* =====================================================================
   META COMPETITIVO + MOTOR DE AVALIAÇÃO (dados e regras; sem acesso a DOM)
   Fontes (consultadas em 19/11/2026):
   • Singles: Smogon, "Usage-Based Tier Update for October 2026" (Showdown, OU).
   • Duplas: Pokémon Champions, VGC Regulação M-C — relatório de meta de 13/11/2026 (top 30) e Pikalytics.
   O "índice de presença" das estratégias é ESTIMADO a partir do uso dos Pokémon associados;
   não é uma estatística oficial de arquétipos.
   ===================================================================== */
const META = {
  singles: {
    id: "singles", rotulo: "Singles — Smogon Gen 9 OU", nivel: 100, sistema: "ev", tera: true,
    fonte: "Smogon — Usage-Based Tier Update, out/2026 (OU, Showdown)", atualizado: "out/2026",
    ranking: [["great-tusk", 33.1], ["kingambit", 28.1], ["gholdengo", 26.8], ["zamazenta", 21.2], ["dragonite", 19.6], ["ogerpon-wellspring-mask", 19.4],
      ["kyurem", 17.5], ["raging-bolt", 17.3], ["iron-valiant", 16.8], ["slowking-galar", 14.7], ["samurott-hisui", 13.8], ["cinderace", 13.7], ["glimmora", 13.5],
      ["hatterene", 12.8], ["landorus-therian", 12.4], ["gliscor", 12.2], ["iron-treads", 11.7], ["ting-lu", 11.4], ["dragapult", 10.7], ["corviknight", 10.3],
      ["darkrai", 9.5], ["pecharunt", 9.4], ["iron-moth", 9.3], ["alomomola", 9.0], ["ceruledge", 8.1], ["cresselia", 8.0]],
    estrategias: [
      { id: "balance", nome: "Balanceada", jogo: "Equilibra paredes, pivôs e atacantes: controla o ritmo com trocas (U-turn/Volt Switch) e hazards e fecha o jogo com um finalizador.",
        quebra: ["Varredores com setup (Kingambit com Swords Dance, Dragonite com Dragon Dance) que passam pelas paredes", "Hazards empilhados que desgastam o time a cada troca", "Taunt e Knock Off, que cortam recuperação e itens"],
        sinais: { golpes: ["u-turn", "volt-switch", "flip-turn", "stealth-rock", "rapid-spin", "defog", "toxic", "recover", "roost"], habs: ["intimidate", "regenerator"], itens: ["leftovers", "heavy-duty-boots", "rocky-helmet"] },
        pokemon: [["great-tusk", "hazard", "Rapid Spin e Stealth Rock com golpes fortes: remove hazards e abre caminho."], ["gholdengo", "pivo", "Imune a status (Good as Gold) e com Make It Rain forte; ótimo pivô ofensivo."],
          ["zamazenta", "parede", "Parede física que ainda machuca com Body Press e Close Combat."], ["landorus-therian", "pivo", "Intimidate + U-turn + Stealth Rock: pivô clássico."],
          ["corviknight", "parede", "Defog, Roost e U-turn: parede que cura e remove hazards."], ["slowking-galar", "pivo", "Regenerator e Chilly Reception: pivô resistente."],
          ["pecharunt", "pivo", "Parting Shot e Malignant Chain: pivô que enfraquece paredes."]] },
      { id: "bulky-offense", nome: "Ofensiva Resistente", jogo: "Ataca com Pokémon resistentes e pivôs: absorve golpes e devolve dano alto.",
        quebra: ["Unaware (Clodsire) ou Haze/Clear Smog, que anulam aumentos", "Taunt e hazards para impedir o setup", "Prioridade e Choice Scarf para finalizar"],
        sinais: { golpes: ["swords-dance", "calm-mind", "nasty-plot", "u-turn", "recover"], habs: [], itens: ["assault-vest", "leftovers", "life-orb", "sitrus-berry"] },
        pokemon: [["kingambit", "varredor", "Sucker Punch + Swords Dance; Supreme Overlord fica mais forte a cada aliado caído."], ["dragonite", "varredor", "Multiscale e Dragon Dance/Extreme Speed: resiste ao primeiro golpe e varre."],
          ["raging-bolt", "atacante", "Calm Mind + Thunderclap: ataque especial resistente."], ["kyurem", "atacante", "Ampla cobertura (Ice Beam, Draco Meteor, Earth Power)."],
          ["ogerpon-wellspring-mask", "varredor", "Ivy Cudgel de Água com Swords Dance: bate forte e resiste bem."], ["hatterene", "parede", "Magic Bounce reflete hazards e status; Calm Mind para fechar."]] },
      { id: "hyper-offense", nome: "Ofensiva Total", jogo: "Pressão máxima com atacantes rápidos e hazards, buscando nocautear antes de as paredes se estabilizarem.",
        quebra: ["Prioridade (Sucker Punch, Extreme Speed, Ice Shard) e Choice Scarf", "Paredes com Intimidate e itens como Rocky Helmet", "Pokémon resistentes que sobrevivem e retaliam"],
        sinais: { golpes: ["stealth-rock", "spikes", "swords-dance", "nasty-plot", "u-turn"], habs: [], itens: ["choice-scarf", "choice-band", "choice-specs", "focus-sash", "life-orb"] },
        pokemon: [["iron-valiant", "varredor", "Rápido e forte nos dois lados; Spirit Break e Close Combat."], ["cinderace", "atacante", "Pyro Ball e U-turn com muita Velocidade."],
          ["dragapult", "atacante", "Velocidade altíssima e golpes de cobertura (Dragon Darts, Shadow Ball)."], ["darkrai", "atacante", "Atacante especial veloz com ampla cobertura."],
          ["ceruledge", "varredor", "Bitter Blade + Swords Dance: muito dano com Flash Fire."], ["iron-moth", "atacante", "Ataque especial forte (Fiery Dance, Sludge Wave) contra paredes."],
          ["samurott-hisui", "atacante", "Ceaseless Edge coloca Spikes enquanto causa dano alto."]] },
      { id: "stall", nome: "Stall (defensiva)", jogo: "Desgasta o rival com hazards, status e dano residual enquanto recupera vida; vence pelo tempo.",
        quebra: ["Wallbreakers fortes (Kingambit, Gholdengo, Ogerpon, Kyurem)", "Taunt e Knock Off, que cortam recuperação e itens", "Hatterene (Magic Bounce) e Gholdengo (Good as Gold) ignoram hazards e status"],
        sinais: { golpes: ["toxic", "recover", "roost", "wish", "protect", "whirlwind", "roar", "haze", "slack-off", "soft-boiled", "toxic-spikes"], habs: ["poison-heal", "regenerator", "unaware"], itens: ["leftovers", "black-sludge"] },
        pokemon: [["gliscor", "parede", "Poison Heal + Toxic + Protect: dano constante e cura própria."], ["corviknight", "parede", "Defog e Roost com Body Press: parede que remove hazards."],
          ["ting-lu", "hazard", "Stealth Rock, Whirlwind e Ruination: parede física que força trocas."], ["slowking-galar", "parede", "Parede especial com Regenerator, Toxic e Slack Off."],
          ["alomomola", "suporte", "Wish + Protect + Regenerator: sustenta o time."], ["cresselia", "parede", "Parede mista com Moonlight e Lunar Dance."],
          ["clodsire", "parede", "Unaware + Toxic Spikes: anula setups e envenena."], ["blissey", "parede", "Parede especial clássica com muita HP."]] },
      { id: "hazard-stack", nome: "Hazards (Stealth Rock/Spikes)", jogo: "Empilha hazards para desgastar o rival a cada troca; o dano fixo viabiliza nocautes.",
        quebra: ["Hatterene (Magic Bounce) reflete hazards", "Remoção: Rapid Spin, Defog, Mortal Spin (ex.: Great Tusk, Corviknight)", "Heavy-Duty Boots e Pokémon Voadores/Levitate"],
        sinais: { golpes: ["stealth-rock", "spikes", "toxic-spikes", "sticky-web", "ceaseless-edge", "stone-axe", "whirlwind", "roar"], habs: [], itens: [] },
        pokemon: [["great-tusk", "hazard", "Stealth Rock e remoção com Rapid Spin; golpes fortes."], ["glimmora", "hazard", "Stealth Rock + Spikes + Toxic Spikes: líder de hazards."],
          ["landorus-therian", "hazard", "Stealth Rock + U-turn + Intimidate."], ["ting-lu", "hazard", "Stealth Rock/Spikes + Whirlwind para forçar trocas."],
          ["samurott-hisui", "hazard", "Ceaseless Edge coloca Spikes enquanto bate."], ["iron-moth", "hazard", "Toxic Spikes com ataque especial forte."]] },
      { id: "setup", nome: "Varredores com Setup", jogo: "Aumenta atributos (Swords Dance, Dragon Dance, Calm Mind) e varre o time rival.",
        quebra: ["Unaware (Clodsire, Dondozo), Haze e Clear Smog", "Phazing (Whirlwind, Roar, Dragon Tail) e Taunt", "Prioridade e Choice Scarf"],
        sinais: { golpes: ["swords-dance", "dragon-dance", "calm-mind", "nasty-plot", "bulk-up", "quiver-dance", "shell-smash", "belly-drum", "agility", "rock-polish", "coil", "curse"], habs: [], itens: ["life-orb", "lum-berry", "weakness-policy"] },
        pokemon: [["kingambit", "varredor", "Swords Dance + Sucker Punch: prioridade e força."], ["dragonite", "varredor", "Dragon Dance com Multiscale: varre depois de aguentar um golpe."],
          ["raging-bolt", "varredor", "Calm Mind + Thunderclap/Draco Meteor."], ["ceruledge", "varredor", "Swords Dance + Bitter Blade."],
          ["ogerpon-wellspring-mask", "varredor", "Swords Dance + Ivy Cudgel."], ["gholdengo", "varredor", "Nasty Plot + Make It Rain/Shadow Ball."],
          ["iron-valiant", "varredor", "Swords Dance + Close Combat/Knock Off."]] },
    ],
  },
  duplas: {
    id: "duplas", rotulo: "Duplas — Pokémon Champions VGC (Reg. M-C)", nivel: 50, sistema: "sp", tera: false,
    fonte: "Relatório de meta de duplas do Champions (13/11/2026) e Pikalytics (Reg. M-C)", atualizado: "nov/2026",
    ranking: [["sneasler"], ["garchomp"], ["rillaboom"], ["kingambit"], ["incineroar"], ["charizard"], ["indeedee-female"], ["raichu"], ["whimsicott"], ["basculegion-male"],
      ["archaludon"], ["pelipper"], ["staraptor"], ["farigiraf"], ["gholdengo"], ["tyranitar"], ["milotic"], ["golisopod"], ["salamence"], ["sinistcha"], ["sylveon"], ["volcarona"], ["dragonite"], ["froslass"]],
    estrategias: [
      { id: "fakeout-pivot", nome: "Fake Out + Intimidate", jogo: "Núcleo clássico: Fake Out e Intimidate controlam o ritmo enquanto Grassy Glide, Knock Off e U-turn pressionam.",
        quebra: ["Psychic Terrain (Indeedee-F) e Armor Tail (Farigiraf) bloqueiam Fake Out e prioridade", "Pokémon imunes a Intimidate (Inner Focus, Own Tempo, Oblivious, Scrappy)", "Tailwind ou Trick Room para reverter o controle de velocidade"],
        sinais: { golpes: ["fake-out", "parting-shot", "u-turn", "grassy-glide", "knock-off", "protect"], habs: ["intimidate"], itens: ["sitrus-berry", "rocky-helmet", "safety-goggles"] },
        pokemon: [["sneasler", "atacante", "Fake Out + Close Combat/Dire Claw: bate forte logo no início."], ["garchomp", "atacante", "Rough Skin e Earthquake/Rock Slide: pressão constante."],
          ["rillaboom", "pivo", "Grassy Glide com prioridade e Fake Out; terreno fortalece o time."], ["kingambit", "atacante", "Sucker Punch e Swords Dance: finaliza e pune Intimidate (Defiant)."],
          ["incineroar", "pivo", "Fake Out + Intimidate + Parting Shot: o pivô mais usado."], ["golisopod", "atacante", "First Impression e Liquidation; Emergency Exit ajuda a sair de situações ruins."]] },
      { id: "tailwind", nome: "Tailwind / Velocidade", jogo: "Dobra a Velocidade do time por 4 turnos para atacar primeiro; combina com atacantes rápidos.",
        quebra: ["Trick Room inverte a ordem de velocidade", "Icy Wind, Electroweb e Fake Out no setter", "Pokémon com mais Velocidade ou Choice Scarf"],
        sinais: { golpes: ["tailwind", "icy-wind", "electroweb", "protect"], habs: ["prankster"], itens: ["choice-scarf", "focus-sash"] },
        pokemon: [["whimsicott", "velocidade", "Prankster: Tailwind com prioridade e Encore/Taunt."], ["pelipper", "velocidade", "Tailwind e Hurricane; também liga a chuva."],
          ["salamence", "atacante", "Intimidate e golpes fortes de Dragão; Mega aumenta o dano."], ["staraptor", "atacante", "Intimidate e golpes fortes de Voador/Lutador; se beneficia de Tailwind."],
          ["archaludon", "atacante", "Electro Shot e Draco Meteor; bom parceiro de apoio de velocidade."]] },
      { id: "trick-room", nome: "Trick Room", jogo: "Inverte a ordem de ação por 5 turnos: Pokémon lentos e fortes agem primeiro.",
        quebra: ["Taunt e Imprison, ou Fake Out no setter, para impedir o Trick Room", "Pokémon lentos do rival ou Trick Room reverso", "Dano alto antes de o Trick Room ser ativado"],
        sinais: { golpes: ["trick-room", "follow-me", "rage-powder", "eruption", "protect"], habs: ["psychic-surge", "armor-tail"], itens: ["mental-herb", "sitrus-berry"] },
        pokemon: [["indeedee-female", "suporte", "Psychic Surge + Follow Me/Trick Room: terreno bloqueia prioridade."], ["farigiraf", "suporte", "Armor Tail bloqueia prioridade; Trick Room e Hyper Voice."],
          ["sinistcha", "suporte", "Rage Powder e Matcha Gotcha: protege os atacantes lentos."], ["torkoal", "atacante", "Eruption forte e baixíssima Velocidade: ideal sob Trick Room."]] },
      { id: "sun", nome: "Sol (Sun)", jogo: "Drought/Torkoal ligam o sol: Fire +50% e Chlorophyll dobra a Velocidade.",
        quebra: ["Chuva (Pelipper/Politoed) sobrescreve o sol", "Golpes de Rocha e Terrestre contra Charizard/Torkoal", "Tailwind e Velocidade maior que Chlorophyll"],
        sinais: { golpes: ["sunny-day", "solar-beam", "heat-wave", "eruption", "weather-ball"], habs: ["drought", "chlorophyll", "solar-power", "orichalcum-pulse"], itens: ["charizardite-y", "heat-rock"] },
        pokemon: [["charizard", "clima", "Mega Charizard Y (Drought) + Heat Wave: liga o sol e já ataca."], ["torkoal", "clima", "Drought + Eruption; combina com Trick Room."],
          ["venusaur", "atacante", "Chlorophyll e Solar Beam: rápido e forte sob sol."], ["delphox", "atacante", "Fogo/Psíquico com ataque especial alto; aproveita o sol."]] },
      { id: "rain", nome: "Chuva (Rain)", jogo: "Drizzle/Rain Dance: Water +50% e Swift Swim dobra a Velocidade.",
        quebra: ["Sol (Charizard Mega Y, Torkoal) sobrescreve a chuva", "Elétricos e Plantas punem Água/Voador (Pelipper é muito fraco a Elétrico)", "Tailwind/Trick Room para vencer Swift Swim"],
        sinais: { golpes: ["rain-dance", "hurricane", "thunder", "hydro-pump", "wave-crash", "muddy-water"], habs: ["drizzle", "swift-swim", "stamina"], itens: ["damp-rock"] },
        pokemon: [["pelipper", "clima", "Drizzle + Hurricane/Tailwind: liga a chuva e dá suporte."], ["basculegion-male", "atacante", "Swift Swim + Wave Crash: muito rápido na chuva."],
          ["archaludon", "atacante", "Electro Shot carrega mais rápido na chuva."], ["milotic", "suporte", "Competitive + Scald/Hypnosis: apoio resistente."], ["politoed", "clima", "Drizzle e suporte (Perish Song, Helping Hand)."]] },
      { id: "mega-ofensiva", nome: "Mega Ofensiva", jogo: "Constrói o time em torno de uma Mega Evolução (uma por partida) para pressão ofensiva e controle de campo.",
        quebra: ["Fake Out e controle de velocidade para atrasar a Mega", "Tipos Rocha, Terra e Água contra Mega de Fogo/Voador", "Prioridade e Intimidate para reduzir o dano"],
        sinais: { golpes: ["protect", "heat-wave", "draco-meteor", "hyper-voice"], habs: [], itens: ["charizardite-y", "charizardite-x", "garchompite", "salamencite", "venusaurite", "gardevoirite", "aerodactylite"] },
        pokemon: [["charizard", "atacante", "Mega Y é a Mega mais usada: Drought + Heat Wave."], ["garchomp", "atacante", "Mega Garchomp: velocidade e força de Dragão/Terrestre."],
          ["salamence", "atacante", "Mega Salamence: Aerilate/Hyper Voice e Draco Meteor."], ["raichu", "atacante", "Raichu (Mega) rápido com Elétrico forte."],
          ["gardevoir", "suporte", "Mega Gardevoir: Pixilate com Hyper Voice e apoio."], ["venusaur", "atacante", "Mega Venusaur: bulky com Venoshock/Giga Drain."]] },
    ],
  },
};

/* ---------- Ranking de uso e índice de presença das estratégias ---------- */
function posUso(formato, nome) { const i = META[formato].ranking.findIndex((r) => r[0] === nome); return i < 0 ? null : i + 1; }
function usoPct(formato, nome) { const r = META[formato].ranking.find((x) => x[0] === nome); return r && r[1] != null ? r[1] : null; }
function pontosUso(formato, nome) { const p = posUso(formato, nome), n = META[formato].ranking.length; return p ? n + 1 - p : 1; }
function ordemInterna(formato, est) {
  // ordena os indicados: primeiro os que estão no ranking de uso (por posição), depois os demais na ordem curada
  return est.pokemon.map((p, k) => ({ n: p[0], tag: p[1], motivo: p[2], pos: posUso(formato, p[0]), k }))
    .sort((a, b) => (a.pos ? a.pos : 999 + a.k) - (b.pos ? b.pos : 999 + b.k));
}
function indicePresenca(formato) {
  const linhas = META[formato].estrategias.map((e) => ({ id: e.id, nome: e.nome, pts: e.pokemon.map((p) => pontosUso(formato, p[0])).sort((a, b) => b - a).slice(0, 5).reduce((x, y) => x + y, 0) }));
  const max = Math.max(...linhas.map((l) => l.pts));
  return linhas.map((l) => Object.assign(l, { indice: Math.round(100 * l.pts / max) })).sort((a, b) => b.pts - a.pts);
}

/* ---------- Naturezas e itens ---------- */
const STAT_ORDEM = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];
const STAT_ROT = { "hp": "HP", "attack": "Atq", "defense": "Def", "special-attack": "Atq. Esp.", "special-defense": "Def. Esp.", "speed": "Vel" };
const NATUREZAS = {
  hardy: [null, null], docile: [null, null], serious: [null, null], bashful: [null, null], quirky: [null, null],
  lonely: ["attack", "defense"], brave: ["attack", "speed"], adamant: ["attack", "special-attack"], naughty: ["attack", "special-defense"],
  bold: ["defense", "attack"], relaxed: ["defense", "speed"], impish: ["defense", "special-attack"], lax: ["defense", "special-defense"],
  timid: ["speed", "attack"], hasty: ["speed", "defense"], jolly: ["speed", "special-attack"], naive: ["speed", "special-defense"],
  modest: ["special-attack", "attack"], mild: ["special-attack", "defense"], quiet: ["special-attack", "speed"], rash: ["special-attack", "special-defense"],
  calm: ["special-defense", "attack"], gentle: ["special-defense", "defense"], sassy: ["special-defense", "speed"], careful: ["special-defense", "special-attack"],
};
const ITENS_COMUNS = ["leftovers", "choice-scarf", "choice-band", "choice-specs", "life-orb", "focus-sash", "assault-vest", "sitrus-berry", "rocky-helmet", "heavy-duty-boots"];
const SINAIS = {
  hazard: ["stealth-rock", "spikes", "toxic-spikes", "sticky-web", "ceaseless-edge", "stone-axe"],
  remocao: ["rapid-spin", "defog", "mortal-spin", "tidy-up", "court-change"],
  recuperacao: ["recover", "roost", "slack-off", "soft-boiled", "moonlight", "morning-sun", "synthesis", "wish", "shore-up", "strength-sap", "rest", "heal-order", "milk-drink", "lunar-dance", "life-dew", "jungle-healing"],
  pivo: ["u-turn", "volt-switch", "flip-turn", "parting-shot", "teleport", "baton-pass", "chilly-reception", "shed-tail"],
  prioridade: ["sucker-punch", "extreme-speed", "aqua-jet", "ice-shard", "mach-punch", "bullet-punch", "quick-attack", "shadow-sneak", "grassy-glide", "first-impression", "accelerock", "jet-punch", "vacuum-wave"],
  velocidade: ["tailwind", "trick-room", "icy-wind", "electroweb", "thunder-wave", "glare", "nuzzle"],
  protect: ["protect", "detect", "spiky-shield", "baneful-bunker", "king-s-shield", "silk-trap", "obstruct"],
  redirect: ["follow-me", "rage-powder", "ally-switch"],
  area: ["earthquake", "rock-slide", "heat-wave", "hyper-voice", "muddy-water", "surf", "blizzard", "dazzling-gleam", "discharge", "eruption", "breaking-swipe", "icy-wind", "snarl", "electroweb", "make-it-rain", "origin-pulse"],
};
const tem = (lista, alvo) => lista.some((x) => alvo.includes(x));

/* ---------- Cálculo de atributos finais ---------- */
function calcAtributos(base, set, nivel, sistema) {
  const out = {}, nat = NATUREZAS[(set && set.natureza) || "hardy"] || [null, null];
  STAT_ORDEM.forEach((s) => {
    const b = base[s] || 0, iv = sistema === "sp" ? 31 : ((set && set.ivs && set.ivs[s] != null) ? set.ivs[s] : 31);
    const pt = (set && set.evs && set.evs[s]) || 0;
    const ev = sistema === "sp" ? 0 : pt;
    let v = Math.floor((2 * b + iv + Math.floor(ev / 4)) * nivel / 100);
    if (s === "hp") v += nivel + 10 + (sistema === "sp" ? pt : 0);
    else { v += 5 + (sistema === "sp" ? pt : 0); v = Math.floor(v * (nat[0] === s ? 1.1 : nat[1] === s ? 0.9 : 1)); }
    out[s] = v;
  });
  return out;
}
const evParaSp = (ev) => ev <= 0 ? 0 : Math.min(32, 1 + Math.floor((ev - 4) / 8));
const spParaEv = (sp) => sp <= 0 ? 0 : Math.min(252, 4 + 8 * (sp - 1));

/* ---------- Tabela de tipos ---------- */
function multAtaque(tabela, atk, defTipos) {
  const r = tabela[atk]; if (!r) return 1;
  let m = 1;
  defTipos.forEach((d) => {
    if (r.double_damage_to.some((x) => x.name === d)) m *= 2;
    else if (r.half_damage_to.some((x) => x.name === d)) m *= 0.5;
    else if (r.no_damage_to.some((x) => x.name === d)) m *= 0;
  });
  return m;
}
function papelPorStats(st) {
  const bulk = st.hp + st.defense + st["special-defense"], of = Math.max(st.attack, st["special-attack"]);
  if (bulk >= 280 && of < 110) return "parede";
  if (st.speed >= 100 && of >= 110) return "varredor";
  if (of >= 100) return "atacante";
  return "suporte";
}

/* ---------- Detecção de estratégia ---------- */
function detectarEstrategia(membros, formato) {
  const M = META[formato], pont = {};
  M.estrategias.forEach((e) => { pont[e.id] = 0; });
  membros.forEach((m) => {
    const golpes = (m.set && m.set.golpes || []).filter(Boolean), hab = m.set && m.set.habilidade, item = m.set && m.set.item;
    const st = m.stats, bulk = st ? st.hp + st.defense + st["special-defense"] : 0, of = st ? Math.max(st.attack, st["special-attack"]) : 0;
    M.estrategias.forEach((e) => {
      let s = 0;
      const k = e.pokemon.findIndex((p) => p[0] === m.nome || p[0] === m.especie);
      if (k >= 0) s += k < 3 ? 3 : 2;
      s += Math.min(6, 1.5 * golpes.filter((g) => e.sinais.golpes.includes(g)).length);
      if (hab && e.sinais.habs.includes(hab)) s += 2;
      if (item && e.sinais.itens.includes(item)) s += 1;
      if (st) {
        if (e.id === "stall" && bulk >= 290 && of < 100) s += 2;
        if ((e.id === "hyper-offense" || e.id === "mega-ofensiva") && st.speed >= 100 && of >= 110) s += 2;
        if (e.id === "bulky-offense" && bulk >= 250 && of >= 110) s += 2;
        if (e.id === "trick-room" && st.speed <= 50 && of >= 100) s += 2;
        if (e.id === "tailwind" && st.speed >= 100) s += 1;
      }
      pont[e.id] += s;
    });
  });
  const total = Object.values(pont).reduce((a, b) => a + b, 0);
  const lista = M.estrategias.map((e) => ({ id: e.id, nome: e.nome, pontos: pont[e.id], pct: total ? Math.round(100 * pont[e.id] / total) : 0 })).sort((a, b) => b.pontos - a.pontos);
  return { total, lista, principal: total >= 3 ? lista[0] : null };
}

/* ---------- Avaliação da equipe ---------- */
function avaliar(d, formato) {
  const M = META[formato], membros = d.membros, n = membros.length, T = d.tabela, notas = {};
  const comSets = membros.filter((m) => m.set && (m.set.item || (m.set.golpes || []).some(Boolean)));
  const golpesMem = (m) => (m.set && m.set.golpes || []).filter(Boolean);
  const todos = membros.flatMap(golpesMem);
  const est = detectarEstrategia(membros, formato);
  const estId = est.principal ? est.principal.id : null;

  // 1) Composição (15)
  const vistos = new Set(); let dup = 0;
  membros.forEach((m) => { if (vistos.has(m.especie)) dup++; vistos.add(m.especie); });
  notas.composicao = n === 0 ? 0 : Math.max(0, 15 - (6 - Math.min(6, n)) * 2.5 - dup * 4);

  // 2) Defesa (20)
  const tiposAtq = Object.keys(T); let pen = 0; const fracos = [];
  tiposAtq.forEach((t) => {
    let fraco = 0, res = 0;
    membros.forEach((m) => { const x = multAtaque(T, t, m.tipos); if (x >= 2) fraco++; else if (x < 1) res++; });
    if (fraco >= 3 && res <= 1) pen += 4; else if (fraco >= 2 && res === 0) pen += 3; else if (fraco >= 2 && res <= 1 && fraco > res) pen += 1.5; else if (fraco >= 4) pen += 3;
    if (fraco >= 2 && fraco > res) fracos.push({ tipo: t, fraco, res });
  });
  fracos.sort((a, b) => (b.fraco - b.res) - (a.fraco - a.res) || b.fraco - a.fraco);
  notas.defesa = n === 0 ? 0 : Math.max(0, Math.round(20 - pen));

  // 3) Cobertura ofensiva (15)
  const golpesDano = membros.flatMap((m) => (m.golpesInfo || []).filter((g) => g.classe !== "status" && g.poder !== 0));
  const tiposOf = new Set(golpesDano.map((g) => g.tipo));
  const stab = new Set(membros.flatMap((m) => m.tipos));
  const usaSets = golpesDano.length >= 4;
  const fonteTipos = usaSets ? tiposOf : stab;
  const faltam = tiposAtq.filter((def) => ![...fonteTipos].some((a) => multAtaque(T, a, [def]) >= 2));
  const cobertos = tiposAtq.length - faltam.length;
  notas.cobertura = n === 0 ? 0 : Math.round((usaSets ? 15 : 10) * Math.min(1, cobertos / 14));

  // 4) Papéis e funcionamento (20)
  const papeis = {}; let ptsPapeis = 0; const lacunas = [];
  if (comSets.length) {
    const checa = (chave, lista, pts, rotulo) => { const ok = tem(lista, todos); papeis[chave] = ok; if (ok) ptsPapeis += pts; else if (pts >= 3) lacunas.push(rotulo); };
    if (formato === "singles") {
      const defensiva = estId === "stall" || estId === "balance";
      const P = defensiva ? { hazard: 4, remocao: 5, recuperacao: 5, pivo: 3, vel: 3 } : { hazard: 5, remocao: 2, recuperacao: 2, pivo: 4, vel: 7 };
      checa("hazard", SINAIS.hazard, P.hazard, "hazards (Stealth Rock/Spikes)"); checa("remocao", SINAIS.remocao, P.remocao, "remoção de hazards (Rapid Spin/Defog)");
      checa("recuperacao", SINAIS.recuperacao, P.recuperacao, "recuperação de vida"); checa("pivo", SINAIS.pivo, P.pivo, "um pivô (U-turn/Volt Switch)");
      if (defensiva || tem(SINAIS.prioridade, todos) || membros.some((m) => (m.set && m.set.item) === "choice-scarf")) { ptsPapeis += P.vel; papeis.velocidade = true; } else { papeis.velocidade = false; lacunas.push("controle de velocidade (prioridade ou Choice Scarf)"); }
    } else {
      checa("fakeout", ["fake-out"], 4, "Fake Out"); checa("velocidade", SINAIS.velocidade, 5, "controle de velocidade (Tailwind/Trick Room/Icy Wind)");
      const nProt = membros.filter((m) => tem(SINAIS.protect, golpesMem(m))).length;
      papeis.protect = nProt >= 3; if (nProt >= 3) ptsPapeis += 3; else lacunas.push("Protect em pelo menos 3 Pokémon");
      checa("redirect", SINAIS.redirect, 3, "um redirecionador (Follow Me/Rage Powder)");
      checa("area", SINAIS.area, 2, "um golpe em área (Heat Wave/Rock Slide/Hyper Voice)");
      const inti = membros.some((m) => (m.set && m.set.habilidade) === "intimidate"); papeis.intimidate = inti; if (inti) ptsPapeis += 3; else lacunas.push("Intimidate");
    }
  } else {
    const fast = membros.some((m) => m.stats && m.stats.speed >= 100 && Math.max(m.stats.attack, m.stats["special-attack"]) >= 100);
    const bulky = membros.some((m) => m.stats && m.stats.hp + m.stats.defense + m.stats["special-defense"] >= 280);
    ptsPapeis = (fast ? 3 : 0) + (bulky ? 3 : 0);
    if (!fast) lacunas.push("um atacante rápido"); if (!bulky) lacunas.push("um Pokémon resistente");
    lacunas.push("golpes definidos (sem eles não dá para avaliar hazards, recuperação e pivôs)");
  }
  notas.papeis = Math.min(20, ptsPapeis);

  // 5) Itens e sets (15) — 2,5 pontos por Pokémon com set completo
  let sets = 0; const itensUsados = {}; let evRuim = 0;
  membros.forEach((m) => {
    const s = m.set; if (!s) return;
    const g = golpesMem(m).length, ev = Object.values(s.evs || {}).reduce((a, b) => a + (b || 0), 0), maxEv = Math.max(0, ...Object.values(s.evs || {}));
    sets += (s.item ? 1 : 0) + (s.habilidade ? 0.5 : 0) + (s.natureza ? 0.25 : 0) + (g >= 4 ? 0.5 : g >= 2 ? 0.25 : 0) + (ev > 0 ? 0.25 : 0);
    if (s.item) itensUsados[s.item] = (itensUsados[s.item] || 0) + 1;
    const lim = M.sistema === "sp" ? [66, 32] : [510, 252];
    if (ev > lim[0] || maxEv > lim[1]) evRuim++;
  });
  // itens repetidos só são proibidos em VGC (Item Clause); em OU são permitidos
  const itensRep = formato === "duplas" ? Object.entries(itensUsados).filter(([, c]) => c > 1).map(([i]) => i) : [];
  notas.sets = Math.max(0, Math.min(15, Math.round(sets)) - itensRep.length * 2 - evRuim * 3);

  // 6) Resposta às ameaças do meta (15): para cada Pokémon muito usado, alguém resiste a seus golpes STAB ou a equipe o acerta super eficaz
  const ameacas = [], semResposta = [];
  M.ranking.slice(0, 12).forEach(([nome]) => {
    const tt = d.tiposMeta && d.tiposMeta[nome]; if (!tt) return;
    ameacas.push(nome);
    const resiste = membros.some((m) => tt.every((a) => multAtaque(T, a, m.tipos) < 1));
    const acerta = [...fonteTipos].some((a) => multAtaque(T, a, tt) >= 2);
    if (!resiste && !acerta) semResposta.push(nome);
  });
  notas.ameacas = ameacas.length ? Math.round(15 * (ameacas.length - semResposta.length) / ameacas.length) : 8;

  const pontos = Math.round(notas.composicao + notas.defesa + notas.cobertura + notas.papeis + notas.sets + notas.ameacas);
  const nota = pontos >= 93 ? "S" : pontos >= 83 ? "A" : pontos >= 72 ? "B" : pontos >= 60 ? "C" : pontos >= 48 ? "D" : "F";
  const estDef = est.principal ? M.estrategias.find((e) => e.id === est.principal.id) : null;
  return { pontos, nota, notas, estrategia: est.principal, estrategias: est.lista, estDef, fracos, faltam, cobertos, usaSets, papeis, lacunas, itensRep, evRuim, dup, comSets: comSets.length, n, semResposta };
}

/* ---------- Texto do feedback + substituições ---------- */
const nomeBonito = (s) => String(s).split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
const TIPO_PT = { normal: "Normal", fire: "Fogo", water: "Água", electric: "Elétrico", grass: "Planta", ice: "Gelo", fighting: "Lutador", poison: "Veneno", ground: "Terrestre", flying: "Voador", psychic: "Psíquico", bug: "Inseto", rock: "Pedra", ghost: "Fantasma", dragon: "Dragão", dark: "Sombrio", steel: "Aço", fairy: "Fada" };
function feedback(av, d, formato) {
  const M = META[formato], linhas = [], e = av.estDef;
  const prin = av.estrategia;
  linhas.push({ t: "estrategia", txt: prin ? `Estratégia predominante: ${prin.nome} (${prin.pct}% dos sinais). ${e.jogo}` : "Estratégia indefinida: faltam sinais claros. Defina golpes, itens e habilidades para identificar o plano de jogo." });
  const comItem = d.membros.filter((m) => m.set && m.set.item);
  const itens = comItem.map((m) => nomeBonito(m.set.item)).slice(0, 6).join(", ");
  let ti = comItem.length ? `Itens: ${comItem.length}/${av.n} definidos (${itens}).` : "Itens: nenhum definido — itens decidem muitos confrontos (Leftovers/Sitrus em resistentes; Choice, Life Orb ou Focus Sash em atacantes).";
  if (av.itensRep.length) ti += ` Repetidos: ${av.itensRep.map(nomeBonito).join(", ")} (o VGC não permite itens repetidos).`;
  if (av.evRuim) ti += formato === "duplas" ? " Há Pokémon acima de 66 pontos (máx. 32 por atributo)." : " Há Pokémon acima de 510 EVs (máx. 252 por atributo).";
  linhas.push({ t: "itens", txt: ti });
  let tc = av.usaSets ? `Cobertura: golpes super eficazes contra ${av.cobertos}/18 tipos` : `Cobertura (estimada pelos tipos dos Pokémon, sem golpes definidos): ${av.cobertos}/18 tipos`;
  tc += av.faltam.length ? `; faltam respostas a ${av.faltam.slice(0, 4).map((t) => TIPO_PT[t]).join(", ")}.` : ".";
  if (av.fracos.length) { const f = av.fracos[0]; tc += ` Defesa: ${f.fraco} Pokémon fracos a ${TIPO_PT[f.tipo]} e só ${f.res} resistem.`; }
  linhas.push({ t: "cobertura", txt: tc });
  let tf = av.lacunas.length ? `Funcionamento: faltam ${av.lacunas.slice(0, 3).join(", ")}.` : "Funcionamento: papéis essenciais presentes.";
  linhas.push({ t: "funcionamento", txt: tf });
  const quebra = [];
  if (e) quebra.push(...e.quebra.slice(0, 2));
  if (av.fracos.length) {
    const t = av.fracos[0].tipo;
    const ameacas = M.ranking.slice(0, 15).map((r) => r[0]).filter((nm) => { const ti = d.tiposMeta && d.tiposMeta[nm]; return ti && ti.includes(t); }).slice(0, 3);
    if (ameacas.length) quebra.push(`Ataques de ${TIPO_PT[t]} (ex.: ${ameacas.map(nomeBonito).join(", ")}, muito usados no meta) exploram a fraqueza compartilhada`);
  }
  if (av.semResposta && av.semResposta.length) quebra.push(`Pokémon muito usados sem resposta clara na sua equipe: ${av.semResposta.slice(0, 4).map(nomeBonito).join(", ")}`);
  linhas.push({ t: "quebra", txt: "Pode ser quebrada por: " + (quebra.length ? quebra.join("; ") + "." : "sem ameaça específica identificada.") });
  return linhas;
}
function sugerirSubstitutos(av, d, formato) {
  const M = META[formato], est = av.estDef; if (!est) return [];
  const naEquipe = new Set(d.membros.flatMap((m) => [m.nome, m.especie]));
  const alvoTipo = av.fracos[0] && av.fracos[0].tipo, T = d.tabela;
  const lista = ordemInterna(formato, est).filter((c) => !naEquipe.has(c.n));
  // elos fracos: duplicados, fora da estratégia, ou que compartilham a pior fraqueza
  const pontuados = d.membros.map((m, i) => {
    const naLista = est.pokemon.some((p) => p[0] === m.nome || p[0] === m.especie);
    const fraco = alvoTipo ? multAtaque(T, alvoTipo, m.tipos) >= 2 : false;
    const duplicado = d.membros.findIndex((x) => x.especie === m.especie) !== i;
    return { m, valor: (naLista ? 2 : 0) + (fraco ? -1 : 0) + (duplicado ? -3 : 0) };
  }).sort((a, b) => a.valor - b.valor).filter((x) => x.valor <= 1).slice(0, 2);
  return pontuados.map(({ m }) => {
    const reg = est.pokemon.find((p) => p[0] === m.nome || p[0] === m.especie);
    const tag = reg ? reg[1] : (m.stats ? papelPorStats(m.stats) : "atacante");
    const mesmoPapel = lista.filter((c) => c.tag === tag || (tag === "atacante" && c.tag === "varredor") || (tag === "varredor" && c.tag === "atacante"));
    const base = mesmoPapel.length ? mesmoPapel : lista;
    const rank = (c) => (alvoTipo && d.tiposMeta && d.tiposMeta[c.n] && multAtaque(T, alvoTipo, d.tiposMeta[c.n]) < 1 ? -50 : 0) + (c.pos || 999);
    const sug = base.slice().sort((a, b) => rank(a) - rank(b)).slice(0, 3).map((c) => {
      const res = alvoTipo && d.tiposMeta && d.tiposMeta[c.n] && multAtaque(T, alvoTipo, d.tiposMeta[c.n]) < 1;
      return Object.assign({}, c, { resiste: !!res, alvo: res ? alvoTipo : null, mesmoPapel: mesmoPapel.includes(c) });
    });
    return { membro: m.nome, papel: tag, sugestoes: sug };
  }).filter((x) => x.sugestoes.length);
}

/* ---------- Texto no formato do Showdown ---------- */
function showdownTexto(equipe, formato) {
  const M = META[formato], cap = (s) => String(s).split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("-");
  return equipe.membros.map((m) => {
    const s = m.set || {}, L = [];
    L.push(cap(m.nome) + (s.item ? " @ " + nomeBonito(s.item) : ""));
    if (s.habilidade) L.push("Ability: " + nomeBonito(s.habilidade));
    L.push("Level: " + M.nivel);
    if (M.tera && s.tera) L.push("Tera Type: " + (TIPO_PT[s.tera] ? nomeBonito(s.tera) : s.tera));
    const evs = STAT_ORDEM.map((k) => [k, M.sistema === "sp" ? spParaEv((s.evs || {})[k] || 0) : ((s.evs || {})[k] || 0)]).filter((x) => x[1] > 0);
    const ab = { hp: "HP", attack: "Atk", defense: "Def", "special-attack": "SpA", "special-defense": "SpD", speed: "Spe" };
    if (evs.length) L.push("EVs: " + evs.map(([k, v]) => v + " " + ab[k]).join(" / "));
    if (s.natureza) L.push(nomeBonito(s.natureza) + " Nature");
    const ivs = STAT_ORDEM.map((k) => [k, (s.ivs || {})[k]]).filter((x) => x[1] != null && x[1] !== 31);
    if (ivs.length && M.sistema === "ev") L.push("IVs: " + ivs.map(([k, v]) => v + " " + ab[k]).join(" / "));
    (s.golpes || []).filter(Boolean).forEach((g) => L.push("- " + nomeBonito(g)));
    return L.join("\n");
  }).join("\n\n");
}
if (typeof module !== "undefined") module.exports = { META, NATUREZAS, ITENS_COMUNS, SINAIS, STAT_ORDEM, STAT_ROT, TIPO_PT, posUso, usoPct, pontosUso, ordemInterna, indicePresenca, calcAtributos, evParaSp, spParaEv, multAtaque, papelPorStats, detectarEstrategia, avaliar, feedback, sugerirSubstitutos, showdownTexto, nomeBonito };
