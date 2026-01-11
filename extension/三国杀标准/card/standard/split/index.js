import baseEffects from "./base_effects.js";
import basicCards from "./basic_cards.js";
import equipCards from "./equip_cards.js";
import trickCards from "./trick_cards.js";
import areaTricks from "./area_tricks.js";

export default { ...baseEffects, ...basicCards, ...equipCards, ...trickCards, ...areaTricks };
