import { NextResponse } from "next/server";
import { PostWithUser } from "@/types/user";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "development";

  try {
    const res = await fetch(
      `https://apimocker.com/posts/search?q=${encodeURIComponent(q)}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch posts" },
        { status: res.status }
      );
    }

    const response = await res.json();
    const posts = Array.isArray(response) ? response : response.results || response.data || response.posts || [];

    // Transform posts to include only required fields and ensure proper structure
    const formattedPosts: PostWithUser[] = posts.map((post: Record<string, unknown>) => ({
      id: post.id,
      userId: post.userId,
      title: post.title,
      body: post.body,
      user: post.user || null,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    return NextResponse.json(formattedPosts);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
