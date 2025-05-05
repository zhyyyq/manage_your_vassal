export const a = "";
type ParsedObject = {
  content: string;
  children: ParsedObject[];
};
export const parse_file = (fileContent: string): ParsedObject[] => {
  // paradox's file is simple base on indent which means we can parse it using stack

  // filter code remark
  const filtered = fileContent
    .split("\n")
    .map((item) => {
      const notationReg = /\#.*$/;
      return item.replace(notationReg, "");
    })
    .filter((item) => item);
  const lines = filtered
    .join(" ")
    .split(/\s/)
    .filter((item) => item);

  let res: ParsedObject[] = [];
  let stack: any[] = [];
  for (let item of lines) {
    switch (item) {
      case "?=":
        stack.push("=");
        continue;
      case "=":
        stack.push("=");
        continue;
      case "{":
        stack.push("{");
        continue;
      case "}":
        let lastIndex = stack.lastIndexOf("=");
        // flush the items into stack[lastIndex-1]
        stack[lastIndex - 1].children = stack.slice(lastIndex + 2);
        stack.splice(lastIndex);
        continue;
      default:
        if (stack[stack.length - 1] == "=") {
          stack.pop();
          stack[stack.length - 1].children.push({
            content: item,
            children: [],
          });
        } else {
          stack.push({
            content: item,
            children: [],
          });
        }
        continue;
    }
  }
  res = stack as ParsedObject[];
  return res;
};
