export function parseFileSize(fileSize: string): number | null {
  const units: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
  };
  const sizePattern = /^(\d+(?:\.\d+)?)\s?(B|KB|MB|GB|TB)$/i;
  const match = fileSize.match(sizePattern);

  if (!match) {
    throw new Error('Invalid file size format provided ' + fileSize);
  }

  const [, size, unit] = match;
  return parseFloat(size) * units[unit.toUpperCase()];
}
