const { showConfirmationModal } = require('../src/assets/js/utils/save.js');

describe('showConfirmationModal', () => {
  test('creates modal and handles confirmation', () => {
    document.body.innerHTML = '';
    const cb = jest.fn();
    showConfirmationModal('Confirm?', cb);
    const modal = document.querySelector('.confirmation-modal');
    expect(modal).not.toBeNull();
    modal.querySelector('.confirm-btn').click();
    expect(cb).toHaveBeenCalledWith(true);
  });
});
