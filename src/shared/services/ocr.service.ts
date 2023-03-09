import { createScheduler, createWorker } from "tesseract.js";

const OCRService = () => {

  const readFile = async (url: string) => {
    const worker = await createWorker();
    await worker.loadLanguage("por");
    await worker.initialize("por");
    const { data: { text } } = await worker.recognize(url);
    await worker.terminate();
    return text;
  }

  return { readFile };
}

export default OCRService;