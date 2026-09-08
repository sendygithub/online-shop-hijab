import { NextRequest } from "next/server";
import { handleApiError, jsonOk } from "@/lib/api/http";
import { registerSchema } from "@/lib/validations/auth.validation";
import { registerUser } from "@/lib/services/auth.service";

// POST /api/register — daftar user baru (publik, role "user")
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.parse(body);

    const user = await registerUser(parsed);
    return jsonOk({ user }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
