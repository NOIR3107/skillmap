import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const extractTextFromPDF = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function () {
      try {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        const pages = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          pages.push(content.items.map(s => s.str).join(' '));
        }
        resolve(pages.join('\n'));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const extractTextFromFile = async (file) => {
  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'pdf') {
    return extractTextFromPDF(file);
  }

  if (ext === 'txt') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  // .docx — read raw text (good enough for keyword extraction)
  if (ext === 'docx') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Extract printable ASCII text from the binary
        const arr = new Uint8Array(reader.result);
        let text = '';
        for (let i = 0; i < arr.length; i++) {
          const c = arr[i];
          if ((c >= 32 && c < 127) || c === 10 || c === 13) text += String.fromCharCode(c);
        }
        // Clean up non-printable residue
        resolve(text.replace(/[^\x20-\x7E\n]/g, ' ').replace(/ {3,}/g, ' '));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  throw new Error('Unsupported file type. Please use PDF, TXT, or DOCX.');
};
