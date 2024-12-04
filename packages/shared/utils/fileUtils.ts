export const convertFileToUint8Array = (file: File): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file); // Reads file as binary

    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result)); // Convert ArrayBuffer to Uint8Array
      } else {
        reject(new Error("Unexpected reader result type"));
      }
    };

    reader.onerror = (error) => reject(error);
  });
};