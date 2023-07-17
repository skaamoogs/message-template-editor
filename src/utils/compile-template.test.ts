import { MessageTemplate } from "../service/message-template";
import { compileTemplate } from "./compile-template";

describe("compile string from empty template", () => {
  const template = new MessageTemplate(null, [
    "firstname",
    "lastname",
    "company",
    "position",
  ]);

  test("with given all used values", () => {
    const testCompileFn = jest.fn(compileTemplate);
    const values = {
      firstname: "John",
      lastname: "Wayne",
      company: "Google",
      position: "engineer",
    };

    expect(testCompileFn(template, values)).toEqual("");
  });
});

describe("compile string from simple template", () => {
  const template = new MessageTemplate(null, [
    "firstname",
    "lastname",
    "company",
    "position",
  ]);
  template.addNewNode(0);
  template.tree!.children![0].text.value = "Hello, {firstname} {lastname}!\n";
  template.tree!.children![1].text.value = "{company}";
  template.tree!.children![2].text.value = "I know you work at {company}.\n";
  template.tree!.children![3].text.value = "Where do you work?\n";
  template.tree!.children![4].text.value = "Good Bye!";

  test("with given all used values", () => {
    const testCompileFn = jest.fn(compileTemplate);
    const values = {
      firstname: "John",
      lastname: "Wayne",
      company: "Google",
      position: "engineer",
    };

    expect(testCompileFn(template, values)).toEqual(
      "Hello, John Wayne!\nI know you work at Google.\nGood Bye!"
    );
  });

  test("with given no values", () => {
    const testCompileFn = jest.fn(compileTemplate);
    const values = {};

    expect(testCompileFn(template, values)).toEqual(
      "Hello,  !\nWhere do you work?\nGood Bye!"
    );
  });

  test("with given not used values", () => {
    const testCompileFn = jest.fn(compileTemplate);
    const values = {
      name: "John",
      address: "1st street, 29",
    };

    expect(testCompileFn(template, values)).toEqual(
      "Hello,  !\nWhere do you work?\nGood Bye!"
    );
  });
});

describe("compile string from more deep template", () => {
  const template = new MessageTemplate(null, [
    "firstname",
    "lastname",
    "company",
    "position",
  ]);
  template.addNewNode(0);
  template.addNewNode(3);
  template.tree!.children![0].text.value = "Hello, {firstname} {lastname}!\n";
  template.tree!.children![1].text.value = "{company}";
  template.tree!.children![2].children![0].text.value =
    "I know you work at {company}";
  template.tree!.children![2].children![1].text.value = "{position}";
  template.tree!.children![2].children![2].text.value = " as {position}.\n";
  template.tree!.children![2].children![3].text.value =
    ". But what is your role?\n";
  template.tree!.children![2].children![4].text.value =
    "Do you consider job offers?\n";
  template.tree!.children![3].text.value = "Where do you work?\n";
  template.tree!.children![4].text.value = "Good Bye!";

  test("with given all used values", () => {
    const testCompileFn = jest.fn(compileTemplate);
    const values = {
      firstname: "John",
      lastname: "Wayne",
      company: "Google",
      position: "",
    };

    expect(testCompileFn(template, values)).toEqual(
      "Hello, John Wayne!\nI know you work at Google. But what is your role?\nDo you consider job offers?\nGood Bye!"
    );
  });
});

describe("compile string from template with incorrect input data", () => {
  test("with incorrect varuable name", () => {
    const template = new MessageTemplate(null, [
      "firstname",
      "lastname",
      "company",
      "position",
    ]);

    template.addNewNode(0);
    template.tree!.children![0].text.value = "Hello, {firstname1} {lastname}!";

    const testCompileFn = jest.fn(compileTemplate);
    const values = {
      firstname: "John",
      lastname: "Wayne",
    };

    expect(testCompileFn(template, values)).toEqual(
      "Hello, {firstname1} Wayne!"
    );
  });

  test("with operators in IF block", () => {
    const template = new MessageTemplate(null, [
      "firstname",
      "lastname",
      "company",
      "position",
    ]);

    template.addNewNode(0);
    template.tree!.children![0].text.value = "Hello, {firstname} {lastname}!\n";
    template.tree!.children![1].text.value = "{company}&&{position}";
    template.tree!.children![2].text.value =
      "I know you work at {company} as {position}.\n";
    template.tree!.children![3].text.value = "Where do you work?\n";
    template.tree!.children![4].text.value = "Good Bye!";

    const testCompileFn = jest.fn(compileTemplate);
    const values = {
      firstname: "John",
      lastname: "Wayne",
    };

    expect(testCompileFn(template, values)).toEqual(
      "Hello, John Wayne!\nI know you work at  as .\nGood Bye!"
    );
  });
});
