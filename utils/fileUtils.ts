
// Overload signatures
export function fileToBase64(file: File): Promise<string>;
export function fileToBase64(file: File, returnObject: true): Promise<{ base64Data: string; mimeType: string }>;

/**
 * Converts a File object to a base64 string.
 * @param file The file to convert.
 * @param returnObject If true, returns an object with base64 data and MIME type.
 * @returns A promise that resolves to the base64 string or an object.
 */
export function fileToBase64(file: File, returnObject?: boolean): Promise<string | { base64Data: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, base64Data] = result.split(',');

      if (!base64Data) {
        reject(new Error("Could not parse file data."));
        return;
      }
      
      if (returnObject) {
        const mimeType = header.split(':')[1].split(';')[0];
        resolve({ base64Data, mimeType });
      } else {
        resolve(result);
      }
    };
    reader.onerror = (error) => reject(error);
  });
}
