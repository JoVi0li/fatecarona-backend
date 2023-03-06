import { createScheduler, createWorker } from "tesseract.js";

const useOCR = () => {

  const readFile = async (url: string) => {
    const worker = await createWorker();
    await worker.loadLanguage("por");
    await worker.initialize("por");
    const { data: { text } } = await worker.recognize(url);
    await worker.terminate();
    return text;
  }

  const readMultipleFiles = async (urls: string[]) => {
    const scheduler = createScheduler();
    const worker01 = await createWorker({logger: m => console.log(m),errorHandler: e => console.log(e)});
    const worker02 = await createWorker({logger: m => console.log(m),errorHandler: e => console.log(e)});
    await worker01.loadLanguage("por");
    await worker02.loadLanguage("por");
    scheduler.addWorker(worker01);
    scheduler.addWorker(worker02);
    const result = await Promise.all(urls.map((url) => (scheduler.addJob('recognize', url))));
    await scheduler.terminate();
    return result;
  }

  return { readFile, readMultipleFiles };
}

export default useOCR;