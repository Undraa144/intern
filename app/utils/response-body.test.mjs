import assert from "node:assert/strict";
import test from "node:test";

import { parseResponseBody } from "./response-body.mjs";

test("returns null for an empty response body", async () => {
  const data = await parseResponseBody(new Response(null));

  assert.equal(data, null);
});

test("returns parsed data for a JSON response body", async () => {
  const data = await parseResponseBody(
    new Response(JSON.stringify({ message: "Registered" }))
  );

  assert.deepEqual(data, { message: "Registered" });
});

test("returns null for a non-JSON response body", async () => {
  const data = await parseResponseBody(new Response("Registered"));

  assert.equal(data, null);
});
