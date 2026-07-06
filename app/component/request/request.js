"use client";

import { useState } from "react";
import { Modal, Select, Input, Button } from "antd";

const { TextArea } = Input;

export default function Request() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Apply Now
      </Button>

      <Modal
        title="Apply Job: Senior UX Designer"
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <label>Choose Resume</label>
          <Select
            style={{ width: "100%", marginTop: 8 }}
            placeholder="Select"
            options={[
              { value: "resume1", label: "Resume 1" },
              { value: "resume2", label: "Resume 2" },
            ]}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>Cover Letter</label>
          <TextArea
            rows={6}
            placeholder="Write down your biography here..."
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button type="primary">
            Apply Now
          </Button>
        </div>
      </Modal>
    </>
  );
}