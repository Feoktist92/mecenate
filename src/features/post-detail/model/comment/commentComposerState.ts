export const isCommentSendDisabled = (
  value: string,
  editable: boolean
): boolean => !editable || !value.trim();
