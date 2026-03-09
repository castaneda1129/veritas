import { Post, Verification } from "./types";

const POSTS_KEY = "veritas_posts";
const USER_KEY = "veritas_user_id";
const SEEDED_KEY = "veritas_seeded";

function generateId(): string {
  return Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
}

export function getUserId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(USER_KEY);
  if (!id) {
    id = generateId();
    localStorage.setItem(USER_KEY, id);
  }
  return id;
}

export function getPosts(): Post[] {
  if (typeof window === "undefined") return [];
  seedIfNeeded();
  const raw = localStorage.getItem(POSTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function savePosts(posts: Post[]) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function createPost(title: string, content: string, category: string): Post {
  const post: Post = {
    id: generateId(),
    title,
    content,
    category,
    createdAt: new Date().toISOString(),
    verifications: [],
    bookmarks: [],
    recommendations: [],
  };
  const posts = getPosts();
  posts.unshift(post);
  savePosts(posts);
  return post;
}

export function toggleBookmark(postId: string): Post[] {
  const userId = getUserId();
  const posts = getPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return posts;
  const idx = post.bookmarks.indexOf(userId);
  if (idx === -1) {
    post.bookmarks.push(userId);
  } else {
    post.bookmarks.splice(idx, 1);
  }
  savePosts(posts);
  return posts;
}

export function addVerification(
  postId: string,
  model: string,
  result: Verification["result"],
  comment: string
): Post[] {
  const posts = getPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return posts;
  const verification: Verification = {
    id: generateId(),
    postId,
    model,
    result,
    comment,
    createdAt: new Date().toISOString(),
  };
  post.verifications.push(verification);
  savePosts(posts);
  return posts;
}

export function hasUserVerified(post: Post): boolean {
  const userId = getUserId();
  const key = `veritas_verified_${post.id}_${userId}`;
  return localStorage.getItem(key) === "true";
}

export function markUserVerified(postId: string) {
  const userId = getUserId();
  localStorage.setItem(`veritas_verified_${postId}_${userId}`, "true");
}

export function toggleRecommendation(postId: string): Post[] {
  const userId = getUserId();
  const posts = getPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return posts;
  const idx = post.recommendations.indexOf(userId);
  if (idx === -1) {
    post.recommendations.push(userId);
  } else {
    post.recommendations.splice(idx, 1);
  }
  savePosts(posts);
  return posts;
}

export function isBookmarked(post: Post): boolean {
  return post.bookmarks.includes(getUserId());
}

export function isRecommended(post: Post): boolean {
  return post.recommendations.includes(getUserId());
}

function makeSeedVerification(postId: string, model: string, result: Verification["result"], minutesAgo: number): Verification {
  return {
    id: generateId(),
    postId,
    model,
    result,
    comment: "Tested this technique and documenting results for the community.",
    createdAt: new Date(Date.now() - minutesAgo * 60000).toISOString(),
  };
}

function seedIfNeeded() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(SEEDED_KEY)) return;

  const id1 = generateId();
  const id2 = generateId();
  const id3 = generateId();
  const id4 = generateId();
  const id5 = generateId();

  const seeds: Post[] = [
    {
      id: id1,
      title: "Use 'Think step by step' for complex reasoning",
      content:
        'Adding "Let\'s think step by step" at the end of your prompt significantly improves reasoning accuracy for math, logic, and multi-step problems. This triggers chain-of-thought reasoning in most LLMs.',
      category: "Prompting",
      createdAt: new Date(Date.now() - 300000).toISOString(), // 5 min ago
      verifications: [
        makeSeedVerification(id1, "Claude Sonnet 4", "worked", 3),
        makeSeedVerification(id1, "GPT-4o", "worked", 45),
        makeSeedVerification(id1, "Gemini Pro", "worked", 120),
        makeSeedVerification(id1, "Claude Haiku", "partially_worked", 200),
      ],
      bookmarks: ["user_seed_1", "user_seed_2", "user_seed_3", "user_seed_5", "user_seed_6"],
      recommendations: ["user_seed_1", "user_seed_2", "user_seed_3"],
    },
    {
      id: id2,
      title: "XML tags improve structured output from Claude",
      content:
        "Wrapping different sections of your prompt in XML tags (like <context>, <instructions>, <examples>) helps Claude parse and follow complex prompts more accurately than plain text formatting.",
      category: "Prompting",
      createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
      verifications: [
        makeSeedVerification(id2, "Claude Opus 4", "worked", 15),
        makeSeedVerification(id2, "Claude Sonnet 4", "worked", 90),
      ],
      bookmarks: ["user_seed_1", "user_seed_4"],
      recommendations: ["user_seed_1", "user_seed_4"],
    },
    {
      id: id3,
      title: "Temperature 0 for deterministic code generation",
      content:
        "When using AI for code generation, set temperature to 0 (or as low as possible) to get more consistent and deterministic outputs. Higher temperatures introduce randomness that can cause subtle bugs.",
      category: "Technique",
      createdAt: new Date(Date.now() - 7200000).toISOString(), // 2h ago
      verifications: [
        makeSeedVerification(id3, "GPT-4o", "worked", 60),
      ],
      bookmarks: ["user_seed_2", "user_seed_3"],
      recommendations: [],
    },
    {
      id: id4,
      title: "Role prompting boosts domain-specific accuracy",
      content:
        'Starting your prompt with "You are an expert [domain] specialist" measurably improves the quality of responses in that domain. Works especially well for medical, legal, and technical topics.',
      category: "Prompting",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      verifications: [],
      bookmarks: [],
      recommendations: [],
    },
    {
      id: id5,
      title: "Few-shot examples outperform lengthy instructions",
      content:
        "Instead of writing long, detailed instructions, provide 2-3 concrete examples of input/output pairs. Models learn the pattern from examples more reliably than from descriptive rules, especially for formatting tasks.",
      category: "Technique",
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1h ago
      verifications: [
        makeSeedVerification(id5, "Claude Sonnet 4", "worked", 30),
        makeSeedVerification(id5, "GPT-4o", "partially_worked", 50),
      ],
      bookmarks: ["user_seed_1", "user_seed_4", "user_seed_5"],
      recommendations: ["user_seed_1"],
    },
  ];

  localStorage.setItem(POSTS_KEY, JSON.stringify(seeds));
  localStorage.setItem(SEEDED_KEY, "true");
}
