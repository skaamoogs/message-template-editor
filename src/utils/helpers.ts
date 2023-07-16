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

  /*   const getTextFromNode = (node: ITextNode) => {
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
            const thenChidlren = children[nodeIndex + 1].children;
            if (thenChidlren) {
              thenChidlren.forEach((child) => {
                getTextFromNode(child);
              });
            } else {
              message += parseText(children[nodeIndex + 1].text.value);
            }
          } else {
            const elseChidlren = children[nodeIndex + 2].children;
            if (elseChidlren) {
              elseChidlren.forEach((child) => {
                getTextFromNode(child);
              });
            } else {
              message += parseText(children[nodeIndex + 2].text.value);
            }
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
  return message; */
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
