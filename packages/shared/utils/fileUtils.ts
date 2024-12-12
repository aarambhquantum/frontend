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

export const getFileSizeInMB = (file: File) => {
  return file?.size / (1024 * 1024);
}

/**
 * Reads a chunk of a file from a specific offset.
 *
 * @param {File} file - The file to read.
 * @param {number} chunkSize - The size of the chunk in bytes.
 * @param {number} offset - The starting point (in bytes) from where to read the chunk.
 * @returns {Promise<ArrayBuffer>} - A promise that resolves to the chunk as an ArrayBuffer.
 */
export async function readFileChunk(file: File, chunkSize: number, offset: number) {
  if (!(file instanceof Blob)) {
    throw new Error('Input must be a Blob or File object.');
  }
  if (offset >= file.size) {
    throw new Error("Offset is beyond the end of the file.");
  }

  // Calculate the end point of the chunk
  const end = Math.min(offset + chunkSize, file.size);

  // Slice the chunk from the file
  const chunk = file.slice(offset, end);

  // Convert chunk to ArrayBuffer and return
  return await chunk.arrayBuffer();
}