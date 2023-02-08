type ValueType = "text" | "file"

const base64Converter = () => {
  const allowedFileTypes = ["jpg", "jpeg", "png"];

  const toBase64 = (value: string): string => {
    const data = value;
    const base64 = Buffer.from(data, 'utf8').toString();
    return base64;
  }

  const fromBase64 = (value: string, valueType: ValueType) => {
    switch (valueType) {
      case 'text':
        return textDecodeFromBase64(value);
      case 'file':
        return fileDecodeFromBase64(value);
      default:
        throw new Error("Invalid value type");
    }
  }

  const textDecodeFromBase64 = (value: string) => {
    const data = value;
    const text = Buffer.from(data, "base64").toString("utf8");
    return text;
  }

  const fileDecodeFromBase64 = (value: string) => {
    const data = value;
    const type = data.split(';')[0].split('/')[1];
    if(!allowedFileTypes.includes(type)) {
      throw new Error("File type invalid");
    }
    const file = Buffer.from(data, "base64").toString("utf8");
    return file;
  }

  return { toBase64, fromBase64 };
}

export default base64Converter;