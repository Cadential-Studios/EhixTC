// Jest test for crafting recipe skill badge rendering logic
const { getSkillBadgeColor } = require('../src/assets/js/ui/skillColors');

describe('Crafting Recipe Skill Badges', () => {
  function renderSkillBadge(skill, level) {
    return `<span class="inline-block rounded-full px-2 py-1 text-xs font-semibold mr-1 mb-1 ${getSkillBadgeColor(skill)}">${skill.charAt(0).toUpperCase() + skill.slice(1)} ${level}</span>`;
  }

  it('renders correct badge HTML for known skills', () => {
    expect(renderSkillBadge('alchemy', 2)).toContain('bg-purple-800');
    expect(renderSkillBadge('cooking', 1)).toContain('bg-yellow-700');
    expect(renderSkillBadge('herbalism', 3)).toContain('bg-green-800');
  });

  it('renders default badge for unknown skills', () => {
    expect(renderSkillBadge('unknown', 1)).toContain('bg-indigo-700');
  });

  it('capitalizes skill name and shows level', () => {
    expect(renderSkillBadge('alchemy', 2)).toContain('Alchemy 2');
    expect(renderSkillBadge('herbalism', 5)).toContain('Herbalism 5');
  });
});
