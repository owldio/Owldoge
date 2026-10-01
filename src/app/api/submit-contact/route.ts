import { submitContact } from '@/lib/submit-contact';

export async function POST(request: Request) {
  return submitContact(request, process.env.GOOGLE_SCRIPT_URL);
}
