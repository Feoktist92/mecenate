export const PREVIEW_MAX_LENGTH = 120;

export const getCollapsedPreview = (value: string): string => {
  if (value.length <= PREVIEW_MAX_LENGTH) {
    return value;
  }

  return `${value.slice(0, PREVIEW_MAX_LENGTH).trimEnd()}...`;
};
