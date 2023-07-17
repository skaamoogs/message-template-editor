import { storageService } from "./storage";

export type NodeProps = {
  type: NodeType;
  id: number;
  text?: string;
  label?: string;
  parentId: number | null;
};

export interface ITextNode extends Omit<NodeProps, "text"> {
  text: { value: string; caretPosition: number };
  children: Array<ITextNode> | null;
}

export interface ITemplate {
  tree: ITextNode;
  countNode: number;
}

export const enum NodeType {
  text = "text",
  if = "IF",
  then = "THEN",
  else = "ELSE",
}

export class MessageTemplate {
  protected _tree: ITextNode;
  protected _countNode: number;
  protected _varNames: string[];

  constructor(template: ITemplate | null, varNames: string[]) {
    this._tree =
      template?.tree ??
      this.createNode({
        type: NodeType.text,
        id: 0,
        text: "",
        parentId: null,
      });
    this._countNode = template?.countNode ?? 0;
    this._varNames = varNames;
  }

  protected createNode(props: NodeProps) {
    return {
      id: props.id,
      type: props.type,
      label: props.label,
      text: { value: props.text ?? "", caretPosition: 0 },
      parentId: props.parentId,
      children: null,
    };
  }

  findNode(id: number): ITextNode | undefined {
    const find = (id: number, node: ITextNode) => {
      if (id === node.id) return node;
      if (!node.children) return;

      let textNode: ITextNode | undefined;
      node.children.every((child) => {
        textNode = find(id, child);
        return textNode ? false : true;
      });
      return textNode;
    };
    return find(id, this._tree);
  }

  addNewNode(id: number) {
    const node = this.findNode(id);
    if (node) {
      const block = [
        this.createNode({
          type: NodeType.text,
          id: ++this._countNode,
          text: node.text.value.slice(0, node.text.caretPosition),
          label: node.label,
          parentId: node.parentId,
        }),
        this.createNode({
          type: NodeType.if,
          id: ++this._countNode,
          label: NodeType.if,
          parentId: node.parentId,
        }),
        this.createNode({
          type: NodeType.then,
          id: ++this._countNode,
          label: NodeType.then,
          parentId: node.parentId,
        }),
        this.createNode({
          type: NodeType.else,
          id: ++this._countNode,
          label: NodeType.else,
          parentId: node.parentId,
        }),
        this.createNode({
          type: NodeType.text,
          id: ++this._countNode,
          text: node.text.value.slice(node.text.caretPosition),
          label: node.label,
          parentId: node.parentId,
        }),
      ];
      if (node.type === NodeType.text && node.parentId) {
        const parent = this.findNode(node.parentId);
        if (parent?.children) {
          const nodeIndex = parent.children.findIndex(
            (child) => child.id === node.id
          );
          parent.children = [
            ...parent?.children.slice(0, nodeIndex),
            ...block,
            ...parent?.children.slice(nodeIndex + 1),
          ];
        }
      } else {
        block.forEach((el) => {
          el.parentId = node.id;
        });
        node.children = block;
      }
    }
  }

  deleteConditionBlock(id: number) {
    const block = this.findNode(id);
    if (block && block.parentId) {
      const parent = this.findNode(block.parentId);
      let children = parent?.children;
      if (children) {
        const nodeIndex = children.findIndex((child) => child.id === block?.id);
        children[nodeIndex - 1].text.value +=
          children[nodeIndex + 3].text.value;
        children.splice(nodeIndex, 4);
        return children[nodeIndex - 1].id;
      }
    }
  }

  get tree() {
    return this._tree;
  }

  get varNames() {
    return this._varNames;
  }

  get countNode() {
    return this._countNode;
  }
}

const defaultVarNames = ["firstname", "lastname", "company", "position"];
const arrVarNames: string[] =
  storageService.get("arrVarNames") ?? defaultVarNames;
const template: ITemplate | null = storageService.get("template");

export const callbackSave = () => {
  const newTemplate: ITemplate = {
    tree: messageTemplate.tree,
    countNode: messageTemplate.countNode,
  };
  storageService.set("template", newTemplate);
};

export const messageTemplate = new MessageTemplate(template, arrVarNames);
