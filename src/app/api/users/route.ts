import { connectDB } from "@/src/db/connection";

export async function GET(req: any) {
  await connectDB();
  return Response.json({ message: "Hello from Next.js API!", success: true });
}
