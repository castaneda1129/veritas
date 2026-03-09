export interface Verification {
  id: string;
  postId: string;
  model: string;
  result: "worked" | "didnt_work" | "partially_worked";
  comment: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  verifications: Verification[];
  bookmarks: string[]; // user IDs
  recommendations: string[]; // user IDs (only from users who verified)
}
