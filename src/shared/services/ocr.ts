import { createScheduler, createWorker } from "tesseract.js";

const useOCR = () => {

  const readFile = async (file: string) => {
    const worker = await createWorker();
    await worker.loadLanguage("pt-br");
    await worker.initialize();
    const { data: { text } } = await worker.recognize(file);
    await worker.terminate();
    return text;
  }

  const readMultipleFiles = async (files: string[]) => {
    const scheduler = createScheduler();
    const worker01 = await createWorker();
    const worker02 = await createWorker();
    scheduler.addWorker(worker01);
    scheduler.addWorker(worker02);
    const result = await Promise.all(files.map((file) => (scheduler.addJob('recognize', file))));
    await scheduler.terminate();
    return result;
  }

  return { readFile, readMultipleFiles };
}

export default useOCR;