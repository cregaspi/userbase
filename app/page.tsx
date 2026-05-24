import { Hero } from "@/components/Hero";
import { PostsList } from "@/components/PostsList";
import { PostWithUser } from "@/types/user";

async function getPosts(): Promise<PostWithUser[]> {
  try {
    const res = await fetch("https://apimocker.com/posts/search?q=development", {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error("Failed to fetch posts:", res.status);
      return [];
    }
    const response = await res.json();
    
    // Extract posts from results array
    const posts = Array.isArray(response) ? response : response.results || [];
    
    // Map to PostWithUser format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedPosts: PostWithUser[] = posts.map((post: any) => ({
      id: post.id,
      userId: post.userId,
      title: post.title,
      body: post.body,
      user: post.user || null,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));
    
    return mappedPosts;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <>
      <Hero />
      <PostsList posts={posts} />
    </>
  );
}
