import {
  ITextNode,
  MessageTemplate,
  NodeType,
} from "../service/message-template";

export const compileTemplate = (
  template: MessageTemplate,
  values: Record<string, string>
) => {
  let message = "";

  const parseText = (text: string) => {
    let parsedText = text;
    const variables = text.match(/{[^{}]+}/gm);
    if (variables) {
      variables.forEach((v) => {
        const varName = v.slice(1, -1);
        if (template.varNames.includes(varName)) {
          parsedText = parsedText.replace(v, values[varName] ?? "");
        }
      });
    }
    return parsedText;
  };

  const stack: Array<ITextNode> = [template.tree];
  while (stack.length) {
    const node = stack.pop();
    if (node) {
      if (!node.children) {
        const parsedText = parseText(node.text.value);
        switch (node.type) {
          case NodeType.text:
          case NodeType.else:
          case NodeType.then:
            message += parsedText;
            break;
          case NodeType.if:
            const thenNode = stack.pop();
            const elseNode = stack.pop();
            if (parsedText) {
              thenNode && stack.push(thenNode);
            } else {
              elseNode && stack.push(elseNode);
            }
            break;
        }
      } else {
        stack.push(...node.children.slice().reverse());
      }
    }
  }
  return message;
};
