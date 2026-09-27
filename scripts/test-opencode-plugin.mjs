import assert from "node:assert/strict";
import test from "node:test";

import plugin from "../.opencode/plugins/humanizer.ts";

test("V1 system transform adds the Humanizer instructions without frontmatter", async () => {
  const hooks = await plugin.server();
  const output = { system: [] };

  await hooks["experimental.chat.system.transform"]({}, output);

  assert.equal(output.system.length, 1);
  assert.match(output.system[0], /# Humanizer: remove AI writing patterns/);
  assert.doesNotMatch(output.system[0], /^---/);
});

test("V2 context hook appends the Humanizer instructions as a text block", async () => {
  let contextHook;
  await plugin.setup({
    session: {
      hook: async (name, callback) => {
        assert.equal(name, "context");
        contextHook = callback;
      },
    },
  });
  const event = { system: [] };

  await contextHook(event);

  assert.equal(event.system.length, 1);
  assert.deepEqual(event.system[0].type, "text");
  assert.match(event.system[0].text, /# Humanizer: remove AI writing patterns/);
  assert.doesNotMatch(event.system[0].text, /^---/);
});
