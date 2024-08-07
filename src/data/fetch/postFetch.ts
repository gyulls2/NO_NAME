import { ApiRes, SingleItem, Post, MultiItem } from '@/types';

const SERVER = process.env.NEXT_PUBLIC_API_SERVER;
const LIMIT = process.env.NEXT_PUBLIC_LIMIT;
const DELAY = process.env.NEXT_PUBLIC_DELAY;

// 게시판 타입, 제목으로 게시물 조회
export async function fetchPosts(
  type: string | undefined,
  page?: string | undefined,
  keyword?: string,
): Promise<Post[]> {
  const queryString = `type=${type}${page ? `&page=${page}` : ''}${keyword ? `&keyword=${keyword}` : ''}&limit=${LIMIT}&delay=${DELAY}`;

  const url = `${SERVER}/posts?${queryString}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'client-id': '04-Foomee',
      },
    });

    const resJson: ApiRes<MultiItem<Post>> = await res.json();

    if (!resJson.ok) {
      throw new Error(`API error: ${resJson.error || 'Unknown error'}`);
    }

    return resJson.item;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function fetchPost(_id: string) {
  const url = `${SERVER}/posts/${_id}`;
  const res = await fetch(url);
  const resJson: ApiRes<SingleItem<Post>> = await res.json();
  if (!resJson.ok) {
    return null;
  }
  return resJson.item;
}