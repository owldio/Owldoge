export function isContactSuccess(body: unknown): body is { status: 'success' } {
  return typeof body === 'object' && body !== null && !Array.isArray(body) &&
    'status' in body && body.status === 'success';
}

export async function isContactResponseSuccessful(response: Response): Promise<boolean> {
  if (!response.ok) return false;

  try {
    return isContactSuccess(await response.json());
  } catch {
    return false;
  }
}
