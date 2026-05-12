import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export const extractTextFromPDF = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function() {
      try {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let maxPages = pdf.numPages;
        let countPromises = [];
        for (let j = 1; j <= maxPages; j++) {
          let page = pdf.getPage(j);
          countPromises.push(page.then(function(page) {
            let textContent = page.getTextContent();
            return textContent.then(function(text) {
              return text.items.map(function(s) { return s.str; }).join(' ');
            });
          }));
        }
        const texts = await Promise.all(countPromises);
        resolve(texts.join('\n'));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
