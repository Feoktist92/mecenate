export const getAvatarInitial = (displayName: string): string => {
  const firstChar = displayName.trim().charAt(0);
  return firstChar ? firstChar.toUpperCase() : '?';
};
