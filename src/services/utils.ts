import CryptoJS from "crypto-js";

// FIXED: now matches the backend key with correct escaping
export const key = "3)x3\\X\\BD}_Tc!\\!|`b[1xIxa0ehpinzo]]Zz=£Rek4MeS+U75";

export const decryptResponse = (response: any) => {
  try {
    if (!response?.data?.result) {
      response.data.result = null;
      return;
    }

    const bytes = CryptoJS.AES.decrypt(response.data.result, key);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      throw new Error(
        "Decryption failed — possibly wrong key or corrupted data."
      );
    }

    response.data.result = JSON.parse(decryptedString);
  } catch (decryptionError) {
    console.error("Decryption error:", decryptionError);
    throw new Error("Failed to decrypt response");
  }
};
