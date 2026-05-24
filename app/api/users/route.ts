import { NextResponse } from "next/server";
import { User } from "@/types/user";

export async function GET() {
  try {
    const res = await fetch("https://apimocker.com/users", {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: res.status }
      );
    }

    const response = await res.json();
    const users: User[] = Array.isArray(response) ? response : response.data || [];
    return NextResponse.json(users);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
