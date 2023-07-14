import { useState } from "react";
import { storageService } from "../../service/storage";
import { Button, ButtonVariations } from "../button/button";
import styles from "./template-editor.module.scss";
import { Template } from "../template/template";
import { useForceUpdate } from "../../hooks/forceUpdate";

interface ITemplateEditorProps {
  onHide: () => void;
}

type NodeProps = {
  type: NodeType;
  id: number;
  text?: string;
  label?: string;
  parent: ITextNode | null;
};

export interface ITextNode extends Omit<NodeProps, "text"> {
  text: { value: string; caretPosition: number };
  children: Array<ITextNode> | null;
}

const enum NodeType {
  text = "text",
  if = "IF",
  then = "THEN",
  else = "ELSE",
}

const defaultVarNames = ["firstname", "lastname", "company", "position"];
const arrVarNames: string[] =
  storageService.get("arrVarNames") ?? defaultVarNames;
const template: string | null = storageService.get("template");

const createNode = (props: NodeProps) => ({
  id: props.id ?? 0,
  type: props.type,
  label: props.label,
  text: { value: props.text ?? "", caretPosition: 0 },
  parent: props.parent,
  children: null,
});

const textTree = createNode({
  type: NodeType.text,
  id: 0,
  text: template ?? "",
  parent: null,
});

const findNode = (id: number, tree: ITextNode): ITextNode | undefined => {
  if (id === tree.id) return tree;
  if (!tree.children) return;

  tree.children.forEach((child) => {
    const node = findNode(id, child);
    if (node) return node;
  });
};

const addNewNode = (id: number, countNode: number) => {
  const node = findNode(id, textTree);
  if (node) {
    const block = [
      createNode({
        type: NodeType.text,
        id: ++countNode,
        text: node.text.value.slice(0, node.text.caretPosition),
        label: node.label,
        parent: node,
      }),
      createNode({
        type: NodeType.if,
        id: ++countNode,
        label: "IF",
        parent: node,
      }),
      createNode({
        type: NodeType.then,
        id: ++countNode,
        label: "THEN",
        parent: node,
      }),
      createNode({
        type: NodeType.else,
        id: ++countNode,
        label: "ELSE",
        parent: node,
      }),
      createNode({
        type: NodeType.text,
        id: ++countNode,
        text: node.text.value.slice(node.text.caretPosition),
        label: node.label,
        parent: node,
      }),
    ];
    if (node.type === NodeType.text && node.parent?.children) {
      const nodeIndex = node.parent.children.findIndex(
        (child) => child.id === node.id
      );
      node.parent.children = [
        ...node.parent.children.slice(0, nodeIndex),
        ...block,
        ...node.parent.children.slice(nodeIndex + 1),
      ];
    } else {
      node.children = block;
    }
  }
  return countNode;
};

export const TemplateEditor = (props: ITemplateEditorProps) => {
  const { onHide } = props;

  const [activeNode, setActiveNode] = useState<ITextNode>(textTree);
  const [countNode, setCountNode] = useState(0);
  const forceUpdate = useForceUpdate();

  const divideBlock = () => {
    console.log(activeNode?.id);
    setCountNode(addNewNode(activeNode.id, countNode));
  };

  const addVariable = (varName: string) => {
    const node = findNode(activeNode.id, textTree);
    if (node) {
      const { value, caretPosition } = node.text;
      node.text.value = `${value.slice(
        0,
        caretPosition
      )}{${varName}}${value.slice(caretPosition)}`;
      console.log(textTree);
      forceUpdate();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Message Template Editor</h1>
        <div className={styles.controlArea}>
          <div className={styles.variables}>
            {arrVarNames.map((name) => (
              <Button
                variation={ButtonVariations.Variable}
                key={name}
                onClick={() => addVariable(name)}
              >
                &#123;{name}&#125;
              </Button>
            ))}
          </div>
          <Button
            variation={ButtonVariations.Light}
            onClick={() => console.log(textTree)}
          >
            Show Tree
          </Button>
          <Button variation={ButtonVariations.Light} onClick={divideBlock}>
            IF-THEN-ELSE
          </Button>
        </div>
        <div className={styles.template}>
          <Template
            node={textTree}
            getActiveNode={(node) => setActiveNode(node)}
          />
        </div>
        <div className={styles.buttons}>
          <Button
            variation={ButtonVariations.Secondary}
            onClick={() => console.log(textTree)}
          >
            Preview
          </Button>
          <Button variation={ButtonVariations.Primary}>Save</Button>
          <Button variation={ButtonVariations.Danger} onClick={onHide}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
