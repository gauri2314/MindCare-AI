import {
  SafeSpaceCommunityPost,
  SafeSpacePeerRequest,
  SafeSpaceListenerProfile,
  SafeSpaceReactionType,
} from '../types';
import {
  INITIAL_COMMUNITY_POSTS,
  INITIAL_PEER_REQUESTS,
  DEFAULT_LISTENER_PROFILE,
} from '../data/safeSpaceData';

const STORAGE_KEYS = {
  POSTS: 'mindcare_safespace_posts_v1',
  REQUESTS: 'mindcare_safespace_requests_v1',
  LISTENER_PROFILE: 'mindcare_safespace_listener_v1',
  ACTIVE_SESSION: 'mindcare_safespace_active_session_v1',
};

export function getSafeSpacePosts(): SafeSpaceCommunityPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!raw) {
      saveSafeSpacePosts(INITIAL_COMMUNITY_POSTS);
      return INITIAL_COMMUNITY_POSTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load SafeSpace posts', e);
    return INITIAL_COMMUNITY_POSTS;
  }
}

export function saveSafeSpacePosts(posts: SafeSpaceCommunityPost[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save SafeSpace posts', e);
  }
}

export function addSafeSpacePost(
  authorName: string,
  authorAvatar: string,
  content: string,
  category: 'hope' | 'wins' | 'encouragement' | 'gratitude'
): SafeSpaceCommunityPost[] {
  const current = getSafeSpacePosts();
  const newPost: SafeSpaceCommunityPost = {
    id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    authorName,
    authorAvatar,
    authorBadge: 'Community Peer',
    authorColor: 'bg-teal-100 text-teal-800',
    content: content.trim(),
    timestamp: 'Just now',
    category,
    reactions: { heard: 1, support: 1, keepGoing: 1, notAlone: 1 },
    userReacted: ['heard'],
  };

  const updated = [newPost, ...current];
  saveSafeSpacePosts(updated);
  return updated;
}

export function toggleSafeSpaceReaction(
  postId: string,
  reaction: SafeSpaceReactionType
): SafeSpaceCommunityPost[] {
  const posts = getSafeSpacePosts();
  const updated = posts.map((post) => {
    if (post.id !== postId) return post;

    const userReacted = post.userReacted ? [...post.userReacted] : [];
    const alreadyReacted = userReacted.includes(reaction);
    const reactions = { ...post.reactions };

    if (alreadyReacted) {
      // Remove reaction
      reactions[reaction] = Math.max(0, reactions[reaction] - 1);
      const filtered = userReacted.filter((r) => r !== reaction);
      return { ...post, reactions, userReacted: filtered };
    } else {
      // Add reaction
      reactions[reaction] = (reactions[reaction] || 0) + 1;
      userReacted.push(reaction);
      return { ...post, reactions, userReacted };
    }
  });

  saveSafeSpacePosts(updated);
  return updated;
}

export function getSafeSpaceRequests(): SafeSpacePeerRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (!raw) {
      saveSafeSpaceRequests(INITIAL_PEER_REQUESTS);
      return INITIAL_PEER_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load SafeSpace peer requests', e);
    return INITIAL_PEER_REQUESTS;
  }
}

export function saveSafeSpaceRequests(requests: SafeSpacePeerRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save SafeSpace requests', e);
  }
}

export function removeSafeSpaceRequest(requestId: string): SafeSpacePeerRequest[] {
  const current = getSafeSpaceRequests();
  const filtered = current.filter((r) => r.id !== requestId);
  saveSafeSpaceRequests(filtered);
  return filtered;
}

export function getSafeSpaceListenerProfile(): SafeSpaceListenerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LISTENER_PROFILE);
    if (!raw) {
      saveSafeSpaceListenerProfile(DEFAULT_LISTENER_PROFILE);
      return DEFAULT_LISTENER_PROFILE;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load SafeSpace listener profile', e);
    return DEFAULT_LISTENER_PROFILE;
  }
}

export function saveSafeSpaceListenerProfile(profile: SafeSpaceListenerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LISTENER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save SafeSpace listener profile', e);
  }
}

export function recordCompletedListenerSession(minutes: number, hearts: number): SafeSpaceListenerProfile {
  const current = getSafeSpaceListenerProfile();
  const updated: SafeSpaceListenerProfile = {
    ...current,
    totalListenedMinutes: current.totalListenedMinutes + minutes,
    peopleSupportedCount: current.peopleSupportedCount + 1,
    appreciationHearts: current.appreciationHearts + hearts,
    level:
      current.peopleSupportedCount + 1 >= 10
        ? 'Empathetic Luminary 🌟'
        : current.peopleSupportedCount + 1 >= 5
        ? 'Trusted Listening Peer 💙'
        : 'Compassionate Guide 🌱',
  };
  saveSafeSpaceListenerProfile(updated);
  return updated;
}
