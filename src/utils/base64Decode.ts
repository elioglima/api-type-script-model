export default (str: string) => Buffer.from(str, "base64").toString("ascii")
