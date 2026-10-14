import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import {
  NewsArticle,
  NewsComment,
  NewsBookmark,
  NewsCategory,
  ReactionType,
  ArticleReactions,
  PortalSettings,
  ContactInquiry,
  MediaAsset,
  LiveBlogEvent,
} from '../types/news';
import { INITIAL_NEWS } from '../data/seedNews';
import {
  DEFAULT_PORTAL_SETTINGS,
  INITIAL_MEDIA_ASSETS,
  INITIAL_LIVE_BLOGS,
} from '../data/portalDefaults';

const ARTICLES_COLLECTION = 'articles';
const COMMENTS_COLLECTION = 'comments';
const BOOKMARKS_COLLECTION = 'bookmarks';
const SETTINGS_COLLECTION = 'settings';
const INQUIRIES_COLLECTION = 'inquiries';
const MEDIA_COLLECTION = 'media';
const LIVE_BLOGS_COLLECTION = 'live_blogs';

/**
 * Seed initial articles if the collection is empty AND user is authenticated.
 */
export async function seedInitialArticlesIfEmpty(): Promise<NewsArticle[]> {
  try {
    const q = query(collection(db, ARTICLES_COLLECTION), limit(1));
    const snap = await getDocs(q);
    
    // Only attempt to write seed data if user is logged in (as required by Firestore rules)
    if (snap.empty && auth.currentUser) {
      const seeded: NewsArticle[] = [];
      for (const item of INITIAL_NEWS) {
        const articleRef = doc(db, ARTICLES_COLLECTION, item.id);
        const articlePayload: NewsArticle = {
          ...item,
          authorUid: auth.currentUser.uid,
          authorEmail: auth.currentUser.email || item.authorEmail || 'khabridost.com@gmail.com',
        };
        await setDoc(articleRef, articlePayload);
        seeded.push(articlePayload);
      }
      return seeded;
    }
    return snap.empty ? INITIAL_NEWS : [];
  } catch (error) {
    // If not authenticated or error, return INITIAL_NEWS in memory so portal always renders cleanly
    return INITIAL_NEWS;
  }
}

/**
 * Fetch all articles or by category.
 */
export async function fetchArticles(category: NewsCategory = 'all'): Promise<NewsArticle[]> {
  try {
    const colRef = collection(db, ARTICLES_COLLECTION);
    const snap = await getDocs(colRef);
    
    if (snap.empty) {
      return sortAndFilterArticles(INITIAL_NEWS, category);
    }

    const items: NewsArticle[] = [];
    snap.forEach(docSnap => {
      items.push(docSnap.data() as NewsArticle);
    });

    return sortAndFilterArticles(items, category);
  } catch (error) {
    // If permission or network issue, fallback to INITIAL_NEWS
    return sortAndFilterArticles(INITIAL_NEWS, category);
  }
}

function sortAndFilterArticles(items: NewsArticle[], category: NewsCategory): NewsArticle[] {
  let list = items;
  if (category !== 'all') {
    list = list.filter(a => a.category === category);
  }
  // Sort descending by createdAt
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Subscribe to real-time articles updates.
 */
export function subscribeToArticles(
  onArticles: (articles: NewsArticle[]) => void,
  category: NewsCategory = 'all'
) {
  const colRef = collection(db, ARTICLES_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: NewsArticle[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as NewsArticle);
      });
      if (items.length === 0) {
        onArticles(sortAndFilterArticles(INITIAL_NEWS, category));
      } else {
        onArticles(sortAndFilterArticles(items, category));
      }
    },
    (error) => {
      onArticles(sortAndFilterArticles(INITIAL_NEWS, category));
      try {
        handleFirestoreError(error, OperationType.LIST, ARTICLES_COLLECTION);
      } catch {
        // gracefully logged
      }
    }
  );
}

/**
 * Create a new article.
 */
export async function publishArticle(data: Omit<NewsArticle, 'id' | 'viewsCount' | 'likesCount' | 'createdAt'>): Promise<NewsArticle> {
  const newId = 'art_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const now = new Date().toISOString();
  const currentUser = auth.currentUser;
  const article: NewsArticle = {
    ...data,
    id: newId,
    authorUid: currentUser?.uid || data.authorUid || 'admin_super_01',
    authorEmail: currentUser?.email || data.authorEmail || 'khabridost.com@gmail.com',
    authorName: data.authorName || currentUser?.displayName || 'मुख्य व्यवस्थापक',
    viewsCount: 1,
    likesCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const docRef = doc(db, ARTICLES_COLLECTION, newId);
    await setDoc(docRef, article);
    return article;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${ARTICLES_COLLECTION}/${newId}`);
    throw error;
  }
}

/**
 * Update an existing article.
 */
export async function updateArticle(articleId: string, updates: Partial<NewsArticle>): Promise<void> {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ARTICLES_COLLECTION}/${articleId}`);
    throw error;
  }
}

/**
 * Delete an article.
 */
export async function deleteArticle(articleId: string): Promise<void> {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${ARTICLES_COLLECTION}/${articleId}`);
    throw error;
  }
}

/**
 * Increment views count for an article.
 */
export async function incrementArticleViews(articleId: string, currentViews: number = 0): Promise<void> {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    await updateDoc(docRef, {
      viewsCount: (currentViews || 0) + 1,
    });
  } catch (error) {
    // Silently ignore or report error
    console.warn('Could not increment view count', error);
  }
}

/**
 * Increment likes count for an article.
 */
export async function incrementArticleLikes(articleId: string, currentLikes: number): Promise<number> {
  const nextLikes = (currentLikes || 0) + 1;
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    await updateDoc(docRef, {
      likesCount: nextLikes,
    });
    return nextLikes;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ARTICLES_COLLECTION}/${articleId}`);
    return currentLikes;
  }
}

export const likeArticle = incrementArticleLikes;

/**
 * Increment or toggle emoji reaction for an article (Like, Love, Insightful, Funny).
 */
export async function updateArticleReaction(
  articleId: string,
  reactionType: ReactionType,
  currentReactions?: ArticleReactions,
  previousReaction?: ReactionType | null
): Promise<ArticleReactions> {
  const updated: ArticleReactions = {
    like: currentReactions?.like || 0,
    love: currentReactions?.love || 0,
    insightful: currentReactions?.insightful || 0,
    funny: currentReactions?.funny || 0,
  };

  // If user had a different reaction, decrement previous
  if (previousReaction && previousReaction !== reactionType) {
    updated[previousReaction] = Math.max(0, (updated[previousReaction] || 0) - 1);
  }

  // If clicking same reaction again, toggle off
  if (previousReaction === reactionType) {
    updated[reactionType] = Math.max(0, (updated[reactionType] || 0) - 1);
  } else {
    updated[reactionType] = (updated[reactionType] || 0) + 1;
  }

  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    await updateDoc(docRef, {
      reactions: updated,
      likesCount: updated.like,
    });
  } catch (error) {
    console.warn('Could not persist reaction to Firestore', error);
  }

  return updated;
}

/**
 * Fetch comments for an article once.
 */
export async function fetchComments(articleId: string): Promise<NewsComment[]> {
  try {
    const q = query(
      collection(db, COMMENTS_COLLECTION),
      where('articleId', '==', articleId)
    );
    const snap = await getDocs(q);
    const items: NewsComment[] = [];
    snap.forEach((docSnap) => {
      items.push(docSnap.data() as NewsComment);
    });
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    return [];
  }
}

/**
 * Subscribe to comments for an article.
 */
export function subscribeToComments(
  articleId: string,
  onComments: (comments: NewsComment[]) => void
) {
  const q = query(
    collection(db, COMMENTS_COLLECTION),
    where('articleId', '==', articleId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: NewsComment[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as NewsComment);
      });
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onComments(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, COMMENTS_COLLECTION);
    }
  );
}

/**
 * Post a comment to an article.
 */
export async function postComment(
  articleId: string,
  content: string,
  user: { uid: string; name: string; email?: string; photoURL?: string }
): Promise<NewsComment> {
  const newId = 'com_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const now = new Date().toISOString();
  const comment: NewsComment = {
    id: newId,
    articleId,
    authorUid: user.uid,
    authorName: user.name || 'पाठक',
    authorEmail: user.email || '',
    authorPhoto: user.photoURL || '',
    content: content.trim(),
    likesCount: 0,
    createdAt: now,
  };

  try {
    const docRef = doc(db, COMMENTS_COLLECTION, newId);
    await setDoc(docRef, comment);
    return comment;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COMMENTS_COLLECTION}/${newId}`);
    throw error;
  }
}

/**
 * Delete a comment.
 */
export async function deleteComment(commentId: string): Promise<void> {
  try {
    const docRef = doc(db, COMMENTS_COLLECTION, commentId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COMMENTS_COLLECTION}/${commentId}`);
    throw error;
  }
}

/**
 * Subscribe to user bookmarks.
 */
export function subscribeToUserBookmarks(
  userId: string,
  onBookmarks: (bookmarks: NewsBookmark[]) => void
) {
  const q = query(
    collection(db, BOOKMARKS_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: NewsBookmark[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as NewsBookmark);
      });
      onBookmarks(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, BOOKMARKS_COLLECTION);
    }
  );
}

/**
 * Toggle bookmark for a user.
 */
export async function toggleBookmark(
  userId: string,
  article: NewsArticle,
  isCurrentlyBookmarked: boolean
): Promise<boolean> {
  // Format bookmark ID safely matching regex ^[a-zA-Z0-9_\-]+$
  const safeArticleId = article.id.replace(/[^a-zA-Z0-9_\-]/g, '_');
  const safeUserId = userId.replace(/[^a-zA-Z0-9_\-]/g, '_');
  const bookmarkId = `bm_${safeUserId.slice(0, 40)}_${safeArticleId.slice(0, 40)}`;

  try {
    const docRef = doc(db, BOOKMARKS_COLLECTION, bookmarkId);
    if (isCurrentlyBookmarked) {
      await deleteDoc(docRef);
      return false;
    } else {
      const bookmark: NewsBookmark = {
        id: bookmarkId,
        userId,
        articleId: article.id,
        articleTitle: article.title,
        articleCategory: article.category,
        articleImageUrl: article.imageUrl,
        createdAt: new Date().toISOString(),
      };
      await setDoc(docRef, bookmark);
      return true;
    }
  } catch (error) {
    const op = isCurrentlyBookmarked ? OperationType.DELETE : OperationType.CREATE;
    handleFirestoreError(error, op, `${BOOKMARKS_COLLECTION}/${bookmarkId}`);
    throw error;
  }
}

/**
 * Fetch portal settings from Firestore with local fallback.
 */
export async function fetchPortalSettings(): Promise<PortalSettings> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'portal_config');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as PortalSettings;
      return {
        ...DEFAULT_PORTAL_SETTINGS,
        ...data,
      };
    }
  } catch (err) {
    console.warn('Could not fetch portal settings from Firestore, using local fallback:', err);
  }

  try {
    const saved = localStorage.getItem('kd_portal_settings');
    if (saved) {
      return {
        ...DEFAULT_PORTAL_SETTINGS,
        ...JSON.parse(saved),
      };
    }
  } catch {}

  return DEFAULT_PORTAL_SETTINGS;
}

/**
 * Real-time listener for portal settings changes across all readers.
 */
export function subscribeToPortalSettings(
  onSettings: (settings: PortalSettings) => void
) {
  const docRef = doc(db, SETTINGS_COLLECTION, 'portal_config');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as PortalSettings;
        const merged: PortalSettings = {
          ...DEFAULT_PORTAL_SETTINGS,
          ...data,
        };
        try {
          localStorage.setItem('kd_portal_settings', JSON.stringify(merged));
        } catch {}
        onSettings(merged);
      }
    },
    (err) => {
      console.warn('Portal settings subscription error:', err);
    }
  );
}

/**
 * Save portal settings to Firestore and local storage.
 */
export async function savePortalSettings(settings: PortalSettings): Promise<void> {
  // Always update local cache first for instant feedback
  try {
    localStorage.setItem('kd_portal_settings', JSON.stringify(settings));
  } catch {}

  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'portal_config');
    await setDoc(docRef, settings, { merge: true });
  } catch (error) {
    console.warn('Could not save settings to Firestore:', error);
    handleFirestoreError(error, OperationType.UPDATE, `${SETTINGS_COLLECTION}/portal_config`);
  }
}

/**
 * Submit contact inquiry to Firestore.
 */
export async function submitContactInquiry(
  inquiry: Omit<ContactInquiry, 'id' | 'submittedAt' | 'status'>
): Promise<ContactInquiry> {
  const newId = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const item: ContactInquiry = {
    ...inquiry,
    id: newId,
    submittedAt: new Date().toISOString(),
    status: 'new',
  };

  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, newId);
    await setDoc(docRef, item);
  } catch (error) {
    console.warn('Saved inquiry locally:', error);
  }

  // Update local storage for immediate admin view
  try {
    const saved = localStorage.getItem('kd_contact_inquiries');
    const list: ContactInquiry[] = saved ? JSON.parse(saved) : [];
    localStorage.setItem('kd_contact_inquiries', JSON.stringify([item, ...list]));
  } catch {}

  return item;
}

/**
 * Subscribe to contact inquiries for administrators.
 */
export function subscribeToContactInquiries(
  onInquiries: (inquiries: ContactInquiry[]) => void
) {
  const colRef = collection(db, INQUIRIES_COLLECTION);
  const q = query(colRef, orderBy('submittedAt', 'desc'), limit(100));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: ContactInquiry[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as ContactInquiry);
      });
      if (items.length > 0) {
        try {
          localStorage.setItem('kd_contact_inquiries', JSON.stringify(items));
        } catch {}
        onInquiries(items);
      }
    },
    (err) => {
      console.warn('Inquiries subscription error (falling back to local):', err);
    }
  );
}

/**
 * Ensure portal settings document exists in Firestore.
 */
export async function seedPortalSettingsIfEmpty(): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'portal_config');
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      await setDoc(docRef, DEFAULT_PORTAL_SETTINGS);
    }
  } catch (error) {
    // Non-admin or offline, safe to skip
  }
}

/**
 * Update contact inquiry status and optional admin notes.
 */
export async function updateContactInquiryStatus(
  inquiryId: string,
  status: ContactInquiry['status'],
  adminNotes?: string
): Promise<void> {
  const updatePayload: Record<string, any> = { status };
  if (adminNotes !== undefined) {
    updatePayload.adminNotes = adminNotes;
  }

  // Update local storage cache immediately
  try {
    const saved = localStorage.getItem('kd_contact_inquiries');
    if (saved) {
      const list: ContactInquiry[] = JSON.parse(saved);
      const updated = list.map((i) => (i.id === inquiryId ? { ...i, ...updatePayload } : i));
      localStorage.setItem('kd_contact_inquiries', JSON.stringify(updated));
    }
  } catch {}

  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, inquiryId);
    await updateDoc(docRef, updatePayload);
  } catch (err) {
    console.warn('Updated inquiry status locally:', err);
  }
}

/**
 * Delete contact inquiry from Firestore and local cache.
 */
export async function deleteContactInquiry(inquiryId: string): Promise<void> {
  try {
    const saved = localStorage.getItem('kd_contact_inquiries');
    if (saved) {
      const list: ContactInquiry[] = JSON.parse(saved);
      const updated = list.filter((i) => i.id !== inquiryId);
      localStorage.setItem('kd_contact_inquiries', JSON.stringify(updated));
    }
  } catch {}

  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, inquiryId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Could not delete inquiry from Firestore:', err);
  }
}

/**
 * -------------------------------------------------------------
 * MEDIA LIBRARY CLOUD PERSISTENCE (ISSUE-03)
 * -------------------------------------------------------------
 */

/**
 * Subscribe to real-time media assets from Firestore /media collection.
 */
export function subscribeMediaAssets(
  callback: (assets: MediaAsset[]) => void
): () => void {
  const colRef = collection(db, MEDIA_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const remote = snapshot.docs.map((docSnap) => ({
          ...(docSnap.data() as MediaAsset),
          id: docSnap.id,
        }));
        // Sort newest first
        remote.sort(
          (a, b) =>
            new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime()
        );
        try {
          localStorage.setItem('kd_media_assets', JSON.stringify(remote));
        } catch {}
        callback(remote);
      } else {
        // Fall back to local or initial assets
        try {
          const saved = localStorage.getItem('kd_media_assets');
          if (saved) {
            callback(JSON.parse(saved));
            return;
          }
        } catch {}
        callback(INITIAL_MEDIA_ASSETS);
      }
    },
    (err) => {
      console.warn('Media subscription error (falling back to cache):', err);
      try {
        const saved = localStorage.getItem('kd_media_assets');
        if (saved) {
          callback(JSON.parse(saved));
          return;
        }
      } catch {}
      callback(INITIAL_MEDIA_ASSETS);
    }
  );
}

/**
 * Save new media asset to Firestore /media and update local storage.
 */
export async function saveMediaAsset(media: MediaAsset): Promise<void> {
  try {
    const saved = localStorage.getItem('kd_media_assets');
    const list: MediaAsset[] = saved ? JSON.parse(saved) : INITIAL_MEDIA_ASSETS;
    const updated = [media, ...list.filter((m) => m.id !== media.id)];
    localStorage.setItem('kd_media_assets', JSON.stringify(updated));
  } catch {}

  try {
    const docRef = doc(db, MEDIA_COLLECTION, media.id);
    await setDoc(docRef, media);
  } catch (err) {
    console.warn('Saved media locally, Firestore sync pending:', err);
  }
}

/**
 * Update media asset metadata (Alt text, SEO title, caption, keywords).
 */
export async function updateMediaAssetRecord(
  mediaUpdate: Partial<MediaAsset> & { id: string }
): Promise<void> {
  try {
    const saved = localStorage.getItem('kd_media_assets');
    if (saved) {
      const list: MediaAsset[] = JSON.parse(saved);
      const updated = list.map((m) =>
        m.id === mediaUpdate.id ? { ...m, ...mediaUpdate } : m
      );
      localStorage.setItem('kd_media_assets', JSON.stringify(updated));
    }
  } catch {}

  try {
    const docRef = doc(db, MEDIA_COLLECTION, mediaUpdate.id);
    await updateDoc(docRef, mediaUpdate as any);
  } catch (err) {
    console.warn('Updated media locally, Firestore sync pending:', err);
  }
}

/**
 * Delete media asset from Firestore and local cache.
 */
export async function deleteMediaAssetRecord(mediaId: string): Promise<void> {
  try {
    const saved = localStorage.getItem('kd_media_assets');
    if (saved) {
      const list: MediaAsset[] = JSON.parse(saved);
      const updated = list.filter((m) => m.id !== mediaId);
      localStorage.setItem('kd_media_assets', JSON.stringify(updated));
    }
  } catch {}

  try {
    const docRef = doc(db, MEDIA_COLLECTION, mediaId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Deleted media locally, Firestore sync pending:', err);
  }
}

/**
 * -------------------------------------------------------------
 * LIVE BLOGS & BREAKING COVERAGE CLOUD PERSISTENCE
 * -------------------------------------------------------------
 */

/**
 * Subscribe to real-time live blogs from Firestore /live_blogs collection.
 */
export function subscribeLiveBlogs(
  callback: (blogs: LiveBlogEvent[]) => void
): () => void {
  const colRef = collection(db, LIVE_BLOGS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const remote = snapshot.docs.map((docSnap) => ({
          ...(docSnap.data() as LiveBlogEvent),
          id: docSnap.id,
        }));
        remote.sort(
          (a, b) =>
            new Date(b.lastUpdatedAt || b.startedAt || 0).getTime() -
            new Date(a.lastUpdatedAt || a.startedAt || 0).getTime()
        );
        try {
          localStorage.setItem('kd_live_blogs', JSON.stringify(remote));
        } catch {}
        callback(remote);
      } else {
        try {
          const saved = localStorage.getItem('kd_live_blogs');
          if (saved) {
            callback(JSON.parse(saved));
            return;
          }
        } catch {}
        callback(INITIAL_LIVE_BLOGS);
      }
    },
    (err) => {
      console.warn('Live blogs subscription error (falling back to cache):', err);
      try {
        const saved = localStorage.getItem('kd_live_blogs');
        if (saved) {
          callback(JSON.parse(saved));
          return;
        }
      } catch {}
      callback(INITIAL_LIVE_BLOGS);
    }
  );
}

/**
 * Save new live blog event to Firestore.
 */
export async function saveLiveBlogRecord(blog: LiveBlogEvent): Promise<void> {
  try {
    const saved = localStorage.getItem('kd_live_blogs');
    const list: LiveBlogEvent[] = saved ? JSON.parse(saved) : INITIAL_LIVE_BLOGS;
    const updated = [blog, ...list.filter((b) => b.id !== blog.id)];
    localStorage.setItem('kd_live_blogs', JSON.stringify(updated));
  } catch {}

  try {
    const docRef = doc(db, LIVE_BLOGS_COLLECTION, blog.id);
    await setDoc(docRef, blog);
  } catch (err) {
    console.warn('Saved live blog locally, Firestore sync pending:', err);
  }
}

/**
 * Update live blog event (e.g. append updates, toggle isLive).
 */
export async function updateLiveBlogRecord(
  blogUpdate: Partial<LiveBlogEvent> & { id: string }
): Promise<void> {
  try {
    const saved = localStorage.getItem('kd_live_blogs');
    if (saved) {
      const list: LiveBlogEvent[] = JSON.parse(saved);
      const updated = list.map((b) =>
        b.id === blogUpdate.id ? { ...b, ...blogUpdate } : b
      );
      localStorage.setItem('kd_live_blogs', JSON.stringify(updated));
    }
  } catch {}

  try {
    const docRef = doc(db, LIVE_BLOGS_COLLECTION, blogUpdate.id);
    await updateDoc(docRef, blogUpdate as any);
  } catch (err) {
    console.warn('Updated live blog locally, Firestore sync pending:', err);
  }
}

/**
 * Delete live blog event from Firestore and local cache.
 */
export async function deleteLiveBlogRecord(blogId: string): Promise<void> {
  try {
    const saved = localStorage.getItem('kd_live_blogs');
    if (saved) {
      const list: LiveBlogEvent[] = JSON.parse(saved);
      const updated = list.filter((b) => b.id !== blogId);
      localStorage.setItem('kd_live_blogs', JSON.stringify(updated));
    }
  } catch {}

  try {
    const docRef = doc(db, LIVE_BLOGS_COLLECTION, blogId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Deleted live blog locally, Firestore sync pending:', err);
  }
}

/**
 * -------------------------------------------------------------
 * AUTOMATED SCHEDULED PUBLISHING PROCESSOR
 * -------------------------------------------------------------
 * Promotes articles with status: 'scheduled' to status: 'published'
 * when their scheduled release timestamp arrives.
 */
export async function checkAndPublishScheduledArticles(
  articles: NewsArticle[]
): Promise<{ updatedArticles: NewsArticle[]; publishedCount: number }> {
  const now = Date.now();
  const toPublish = articles.filter(
    (a) =>
      a.status === 'scheduled' &&
      a.scheduledFor &&
      new Date(a.scheduledFor).getTime() <= now
  );

  if (toPublish.length === 0) {
    return { updatedArticles: articles, publishedCount: 0 };
  }

  const updatedArticles = articles.map((a) => {
    if (
      a.status === 'scheduled' &&
      a.scheduledFor &&
      new Date(a.scheduledFor).getTime() <= now
    ) {
      return {
        ...a,
        status: 'published' as const,
        updatedAt: new Date().toISOString(),
      };
    }
    return a;
  });

  // Promote in Firestore in parallel
  await Promise.allSettled(
    toPublish.map(async (article) => {
      try {
        const articleRef = doc(db, ARTICLES_COLLECTION, article.id);
        await updateDoc(articleRef, {
          status: 'published',
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn(`Could not promote scheduled article ${article.id}:`, err);
      }
    })
  );

  return { updatedArticles, publishedCount: toPublish.length };
}
