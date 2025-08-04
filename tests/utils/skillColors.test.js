// Jest test for skill badge color utility
const { getSkillBadgeColor, skillColorMap } = require('../src/assets/js/ui/skillColors');

describe('getSkillBadgeColor', () => {
  it('returns the correct Tailwind class for known skills', () => {
    expect(getSkillBadgeColor('alchemy')).toBe(skillColorMap.alchemy);
    expect(getSkillBadgeColor('cooking')).toBe(skillColorMap.cooking);
    expect(getSkillBadgeColor('herbalism')).toBe(skillColorMap.herbalism);
    expect(getSkillBadgeColor('smithing')).toBe(skillColorMap.smithing);
    expect(getSkillBadgeColor('enchanting')).toBe(skillColorMap.enchanting);
    expect(getSkillBadgeColor('tailoring')).toBe(skillColorMap.tailoring);
    expect(getSkillBadgeColor('woodworking')).toBe(skillColorMap.woodworking);
    expect(getSkillBadgeColor('fishing')).toBe(skillColorMap.fishing);
    expect(getSkillBadgeColor('mining')).toBe(skillColorMap.mining);
    expect(getSkillBadgeColor('hunting')).toBe(skillColorMap.hunting);
    expect(getSkillBadgeColor('leatherworking')).toBe(skillColorMap.leatherworking);
  });

  it('returns the default class for unknown skills', () => {
    expect(getSkillBadgeColor('unknown_skill')).toBe('bg-indigo-700 text-indigo-100');
  });
});
