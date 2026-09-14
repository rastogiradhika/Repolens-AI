export function buildErrorResponse(code, message, details = null) {
  const response = {
    success: false,
    error: { code, message },
  };
  if (details && process.env.NODE_ENV !== 'production') {
    response.error.details = details;
  }
  return response;
}

export function buildSuccessResponse(data) {
  return { success: true, data };
}
