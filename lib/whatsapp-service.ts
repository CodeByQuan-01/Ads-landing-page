import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface WhatsAppSettings {
  whatsappLink: string;
  updatedAt: Date;
}

export interface ClickAnalytics {
  totalClicks: number;
  lastClickedAt: Date;
  clicksToday: number;
  clicksThisWeek: number;
  clicksThisMonth: number;
}

const SETTINGS_DOC_ID = "whatsapp-settings";
const ANALYTICS_DOC_ID = "click-analytics";

// Get WhatsApp link from Firestore
export async function getWhatsAppLink(): Promise<string> {
  try {
    const docRef = doc(db, "settings", SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as WhatsAppSettings;
      return data.whatsappLink || "https://wa.me/1234567890";
    } else {
      // Return default WhatsApp link if no document exists
      return "https://wa.me/1234567890";
    }
  } catch (error) {
    console.error("Error fetching WhatsApp link:", error);
    // Return default link on error
    return "https://wa.me/1234567890";
  }
}

// Update WhatsApp link in Firestore
export async function updateWhatsAppLink(newLink: string): Promise<boolean> {
  try {
    // Validate WhatsApp link format
    if (!isValidWhatsAppLink(newLink)) {
      throw new Error("Invalid WhatsApp link format");
    }

    const docRef = doc(db, "settings", SETTINGS_DOC_ID);
    await setDoc(
      docRef,
      {
        whatsappLink: newLink,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error("Error updating WhatsApp link:", error);
    return false;
  }
}

// Subscribe to real-time WhatsApp link changes
export function subscribeToWhatsAppLink(
  callback: (link: string) => void
): () => void {
  const docRef = doc(db, "settings", SETTINGS_DOC_ID);

  return onSnapshot(
    docRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() as WhatsAppSettings;
        callback(data.whatsappLink || "https://wa.me/1234567890");
      } else {
        callback("https://wa.me/1234567890");
      }
    },
    (error) => {
      console.error("Error listening to WhatsApp link changes:", error);
      callback("https://wa.me/1234567890");
    }
  );
}

export function isValidWhatsAppLink(link: string): boolean {
  // Accept any non-empty string - allows URLs, phone numbers, or any text
  return link.trim().length > 0;
}

export function normalizeWhatsAppLink(link: string): string {
  // If it's already a wa.me link, return as is
  if (link.includes("wa.me/")) {
    return link;
  }

  // Extract phone number from api.whatsapp.com or web.whatsapp.com links
  const phoneMatch = link.match(/phone=(\d+)/);
  const textMatch = link.match(/text=([^&]*)/);

  if (phoneMatch) {
    let normalizedLink = `https://wa.me/${phoneMatch[1]}`;
    if (textMatch) {
      normalizedLink += `?text=${textMatch[1]}`;
    }
    return normalizedLink;
  }

  // Return original link if can't normalize
  return link;
}

// Format phone number for WhatsApp link
export function formatWhatsAppLink(
  phoneNumber: string,
  message?: string
): string {
  // Remove all non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, "");

  let link = `https://wa.me/${cleanNumber}`;

  if (message) {
    const encodedMessage = encodeURIComponent(message);
    link += `?text=${encodedMessage}`;
  }

  return link;
}

export async function trackWhatsAppClick(): Promise<boolean> {
  try {
    const docRef = doc(db, "analytics", ANALYTICS_DOC_ID);
    const now = new Date();

    // Get current analytics to calculate daily/weekly/monthly increments
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as ClickAnalytics;
      const lastClick =
        data.lastClickedAt instanceof Date ? data.lastClickedAt : new Date(0);

      // Check if it's a new day, week, or month
      const isNewDay = now.toDateString() !== lastClick.toDateString();
      const isNewWeek = getWeekNumber(now) !== getWeekNumber(lastClick);
      const isNewMonth =
        now.getMonth() !== lastClick.getMonth() ||
        now.getFullYear() !== lastClick.getFullYear();

      await updateDoc(docRef, {
        totalClicks: increment(1),
        lastClickedAt: now,
        clicksToday: isNewDay ? 1 : increment(1),
        clicksThisWeek: isNewWeek ? 1 : increment(1),
        clicksThisMonth: isNewMonth ? 1 : increment(1),
      });
    } else {
      // Create initial analytics document
      await setDoc(docRef, {
        totalClicks: 1,
        lastClickedAt: now,
        clicksToday: 1,
        clicksThisWeek: 1,
        clicksThisMonth: 1,
      });
    }

    return true;
  } catch (error) {
    console.error("Error tracking WhatsApp click:", error);
    return false;
  }
}

export async function getClickAnalytics(): Promise<ClickAnalytics> {
  try {
    const docRef = doc(db, "analytics", ANALYTICS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as ClickAnalytics;
    } else {
      // Return default analytics if no document exists
      return {
        totalClicks: 0,
        lastClickedAt: new Date(),
        clicksToday: 0,
        clicksThisWeek: 0,
        clicksThisMonth: 0,
      };
    }
  } catch (error) {
    console.error("Error fetching click analytics:", error);
    return {
      totalClicks: 0,
      lastClickedAt: new Date(),
      clicksToday: 0,
      clicksThisWeek: 0,
      clicksThisMonth: 0,
    };
  }
}

export function subscribeToClickAnalytics(
  callback: (analytics: ClickAnalytics) => void
): () => void {
  const docRef = doc(db, "analytics", ANALYTICS_DOC_ID);

  return onSnapshot(
    docRef,
    (doc) => {
      if (doc.exists()) {
        callback(doc.data() as ClickAnalytics);
      } else {
        callback({
          totalClicks: 0,
          lastClickedAt: new Date(),
          clicksToday: 0,
          clicksThisWeek: 0,
          clicksThisMonth: 0,
        });
      }
    },
    (error) => {
      console.error("Error listening to analytics changes:", error);
      callback({
        totalClicks: 0,
        lastClickedAt: new Date(),
        clicksToday: 0,
        clicksThisWeek: 0,
        clicksThisMonth: 0,
      });
    }
  );
}

function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
