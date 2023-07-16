import {
  ITextNode,
  NodeType,
  MessageTemplate,
} from "../service/message-template";

export const classnames = (...names: string[]) => names.join(" ");

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

  const getTextFromNode = (node: ITextNode) => {
    if (!node.children) {
      const parsedText = parseText(node.text.value);
      if (node.type === NodeType.text) {
        message += parsedText;
      } else if (node.type === NodeType.if) {
        const children = node?.parent?.children;
        if (children) {
          const nodeIndex = children.findIndex(
            (child) => child.id === node?.id
          );
          if (parsedText) {
            message += parseText(children[nodeIndex + 1].text.value);
          } else {
            message += parseText(children[nodeIndex + 2].text.value);
          }
        }
      }
    } else {
      node.children.forEach((child) => {
        getTextFromNode(child);
      });
    }
  };

  getTextFromNode(template.tree);
  return message;
};
