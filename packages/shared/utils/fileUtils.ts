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

export const convertFileDataIntoUint8Array = (file):Uint8Array => {
  return file instanceof Uint8Array ? file : new Uint8Array(file);
}

export const getSizeForUint8Array = (file: Uint8Array) => file?.length;

export const getSizeInMBForUint8Array = (file: Uint8Array) =>
  getSizeForUint8Array(file) / (1024 * 1024);
