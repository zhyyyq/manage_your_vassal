export const a = "";

type newV3ConfigObj = [string, newV3ConfigObj | string | newV3ConfigObj[]];

export const parse_file = (fileContent: string): newV3ConfigObj[] => {
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
  const stack: ("=" | "{" | "}" | newV3ConfigObj)[] = [];
  lines.forEach((word) => {
    console.log(word);
    if (word === "add_ruling_interest_group") {
      console.log(word);
    }
    if (/\w/.test(word)) {
      const obj: newV3ConfigObj = [word, ""];
      if (stack[stack.length - 1] === "=") {
        stack.pop();
        const key = stack[stack.length - 1] as newV3ConfigObj;
        key[1] = obj;
      } else {
        stack.push(obj);
      }
    } else if (/=/.test(word)) {
      stack.push("=");
    } else if (/\{/.test(word)) {
      stack.push("{");
    } else if (/\}/.test(word)) {
      let t = stack.pop();
      while (t !== "{") {
        t = stack.pop();
      }
      stack.pop();
    } else {
      // exception
    }
  });
  console.log(stack);
  return stack as any;
};
