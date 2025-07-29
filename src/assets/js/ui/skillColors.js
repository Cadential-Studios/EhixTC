// Skill badge color mapping for Edoria: The Triune Convergence
// Each skill gets a unique, consistent Tailwind color class

const skillColorMap = {
  alchemy: 'bg-purple-800 text-purple-100', // magical, mystical
  cooking: 'bg-amber-700 text-amber-100', // warmth, food
  herbalism: 'bg-green-700 text-green-100', // nature, plants
  smithing: 'bg-red-800 text-red-100', // fire, metal
  enchanting: 'bg-blue-800 text-blue-100', // arcane
  tailoring: 'bg-pink-700 text-pink-100', // fabric, thread
  woodworking: 'bg-lime-800 text-lime-100', // forest, wood
  fishing: 'bg-cyan-700 text-cyan-100', // water
  mining: 'bg-slate-700 text-slate-100', // stone, earth
  hunting: 'bg-rose-800 text-rose-100', // wild, blood
  arcana: 'bg-fuchsia-800 text-fuchsia-100', // mystical
  weaponcraft: 'bg-orange-800 text-orange-100', // metal, craft
  leatherworking: 'bg-yellow-800 text-yellow-100', // animal, earth
  survival: 'bg-teal-700 text-teal-100', // outdoors
  medicine: 'bg-emerald-700 text-emerald-100', // healing
  tinkering: 'bg-slate-700 text-slate-100', // gadgets
  // Add more as needed
};

// Remove all borders for badges
const skillBorderColorMap = {
  alchemy: '',
  cooking: '',
  herbalism: '',
  smithing: '',
  enchanting: '',
  tailoring: '',
  woodworking: '',
  fishing: '',
  mining: '',
  hunting: '',
  arcana: '',
  weaponcraft: '',
  leatherworking: '',
  // Add more as needed
};

function getSkillBadgeColor(skill) {
  return skillColorMap[skill] || 'bg-indigo-700 text-indigo-100';
}
function getSkillBadgeBorder(skill) {
  return skillBorderColorMap[skill] || '';
}

// Browser global support
if (typeof window !== 'undefined') {
  window.skillColorMap = skillColorMap;
  window.skillBorderColorMap = skillBorderColorMap;
  window.getSkillBadgeColor = getSkillBadgeColor;
  window.getSkillBadgeBorder = getSkillBadgeBorder;
}

// Jest/node export support
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    skillColorMap,
    skillBorderColorMap,
    getSkillBadgeColor,
    getSkillBadgeBorder
  };
}
