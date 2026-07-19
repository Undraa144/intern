import assert from "node:assert/strict";
import test from "node:test";

import {
  createApplicationPayload,
  getStudentIdFromResponse,
} from "./application-payload.mjs";

test("reads a numeric student ID from the myId response", () => {
  assert.equal(getStudentIdFromResponse(1), 1);
  assert.equal(getStudentIdFromResponse({ studentId: 2 }), 2);
  assert.equal(getStudentIdFromResponse({ id: 3 }), 3);
});

test("builds an application payload with validated IDs and cover letter", () => {
  const payload = createApplicationPayload({
    coverLetter: "  I am interested in this internship.  ",
    studentId: 1,
  });

  assert.deepEqual(payload, {
    coverLetter: "I am interested in this internship.",
    studentId: 1,
  });
});

test("rejects an empty cover letter or invalid identifiers", () => {
  assert.throws(
    () => createApplicationPayload({ coverLetter: "", studentId: 1 }),
    /cover letter/i
  );
  assert.throws(
    () => createApplicationPayload({ coverLetter: "Text", studentId: 0 }),
    /student/i
  );
});
