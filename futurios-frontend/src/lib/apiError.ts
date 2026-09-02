const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!isRecord(error) || !isRecord(error.response)) return fallback;
  if (!isRecord(error.response.data)) return fallback;

  const detail = error.response.data.detail;

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) =>
        isRecord(item) && typeof item.msg === "string" ? item.msg : null
      )
      .filter(Boolean);

    return messages.length > 0 ? messages.join(", ") : fallback;
  }

  return fallback;
};
