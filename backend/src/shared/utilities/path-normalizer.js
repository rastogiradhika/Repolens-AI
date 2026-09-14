export function normalizePath(filePath) {
  return filePath.toLowerCase().replace(/\\/g, '/');
}

export function getFileName(filePath) {
  return filePath.split('/').pop();
}

export function getDirectory(filePath) {
  const parts = filePath.split('/');
  parts.pop();
  return parts.join('/');
}

/**
 * Checks if a file path matches a glob-like pattern.
 * Supports * (any chars except /) and ** (any chars including /).
 */
export function matchesPattern(filePath, pattern) {
  const normalized = normalizePath(filePath);
  const normalizedPattern = normalizePath(pattern);

  const regexStr = normalizedPattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '|||DS|||')
    .replace(/\*/g, '[^/]+')
    .replace(/\|\|\|DS\|\|\|/g, '.*');

  const regex = new RegExp(`^${regexStr}$`);
  return regex.test(normalized);
}
