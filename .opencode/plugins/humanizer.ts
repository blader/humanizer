import { readFileSync } from "node:fs";

const skill = readFileSync(new URL("../../SKILL.md", import.meta.url), "utf8");
const instructions = skill
  .replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "")
  .trim();

export default {
  id: "humanizer",

  async setup(ctx) {
    await ctx.session.hook("context", (event) => {
      event.system.push({ type: "text", text: instructions });
    });
  },

  async server() {
    return {
      "experimental.chat.system.transform": async (_input, output) => {
        output.system.push(instructions);
      },
    };
  },
};
