import { NextResponse } from "next/server";
import { UserDetail } from "@/types/user";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const res = await fetch(`https://apimocker.com/users/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "User not found" },
        { status: res.status }
      );
    }

    const user: UserDetail = await res.json();
    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
