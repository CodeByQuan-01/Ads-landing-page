import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export interface WhatsAppSettings {
  whatsappLink: string;
  updatedAt: Date;
}

const SETTINGS_DOC_ID = "whatsapp-settings";

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

// Validate WhatsApp link format
export function isValidWhatsAppLink(link: string): boolean {
  const whatsappRegex = /^https:\/\/wa\.me\/\d+(\?text=.*)?$/;
  return whatsappRegex.test(link);
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
