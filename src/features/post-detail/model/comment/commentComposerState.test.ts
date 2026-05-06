import { isCommentSendDisabled } from './commentComposerState';

describe('isCommentSendDisabled', () => {
  it('returns true when composer is not editable', () => {
    expect(isCommentSendDisabled('Тест', false)).toBe(true);
  });

  it('returns true when text is empty or whitespace', () => {
    expect(isCommentSendDisabled('', true)).toBe(true);
    expect(isCommentSendDisabled('   ', true)).toBe(true);
  });

  it('returns false when editable and has non-empty text', () => {
    expect(isCommentSendDisabled('Комментарий', true)).toBe(false);
  });
});
