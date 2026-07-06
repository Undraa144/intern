"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {Tabs} from 'antd';
import { Form, Input, Button, Checkbox, Select } from "antd";

import styles from "./signup.module.scss";

export default function SignUp() {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = (values, role) => {
  console.log(values);

  if (role === "student") {
    router.push("/pages/student/home");
  }

  if (role === "employer") {
    router.push("/pages/employer/home");
  }

  if (role === "teacher") {
    router.push("pages/teacher/home");
  }
};

  const items = [
  {
    key: '1',
    label: 'Student',
    children: (
      <div className={styles.form}>
          <div className={styles.topRow}>
            <div>
              <h2>Create account.</h2>
              <p>
                Already have account?{" "}
                <Link href="/pages/login">Log In</Link>
              </p>
            </div>

          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => onFinish(values, "student")}
          >
            <div className={styles.row}>
              <Form.Item
                name="fullName"
                className={styles.half}
                rules={[
                  {
                    required: true,
                    message: "Please input your full name!",
                  },
                ]}
              >
                <Input placeholder="Full Name" />
              </Form.Item>

              <Form.Item
                name="username"
                className={styles.half}
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input placeholder="Username" />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "Invalid email!",
                },
              ]}
            >
              <Input placeholder="Email address" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      !value ||
                      getFieldValue("password") === value
                    ) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error("Passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "Please accept Terms of Services"
                          )
                        ),
                },
              ]}
            >
              <Checkbox>
                I've read and agree with your{" "}
                <a href="/">Terms of Services</a>
              </Checkbox>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              className={styles.submitBtn}
            >
              Create Account
            </Button>
          </Form>
      </div>
    ),
  },
  {
    key: '2',
    label: 'Employer',
    children: (
      <div className={styles.form}>
          <div className={styles.topRow}>
            <div>
              <h2>Create account.</h2>
              <p>
                Already have account?{" "}
                <Link href="/pages/login">Log In</Link>
              </p>
            </div>

          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => onFinish(values, "employer")}
          >
            <div className={styles.row}>
              <Form.Item
                name="fullName"
                className={styles.half}
                rules={[
                  {
                    required: true,
                    message: "Please input your full name!",
                  },
                ]}
              >
                <Input placeholder="Full Name" />
              </Form.Item>

              <Form.Item
                name="username"
                className={styles.half}
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input placeholder="Username" />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "Invalid email!",
                },
              ]}
            >
              <Input placeholder="Email address" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      !value ||
                      getFieldValue("password") === value
                    ) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error("Passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "Please accept Terms of Services"
                          )
                        ),
                },
              ]}
            >
              <Checkbox>
                I've read and agree with your{" "}
                <a href="/">Terms of Services</a>
              </Checkbox>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              className={styles.submitBtn}
            >
              Create Account 
            </Button>
          </Form>
      </div>
      ),
  },
  {
    key: '3',
    label: 'Teacher',
    children: (
      <div className={styles.form}>
          <div className={styles.topRow}>
            <div>
              <h2>Create account.</h2>
              <p>
                Already have account?{" "}
                <Link href="/pages/login">Log In</Link>
              </p>
            </div>

          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => onFinish(values, "teacher")}
          >
            <div className={styles.row}>
              <Form.Item
                name="fullName"
                className={styles.half}
                rules={[
                  {
                    required: true,
                    message: "Please input your full name!",
                  },
                ]}
              >
                <Input placeholder="Full Name" />
              </Form.Item>

              <Form.Item
                name="username"
                className={styles.half}
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input placeholder="Username" />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "Invalid email!",
                },
              ]}
            >
              <Input placeholder="Email address" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      !value ||
                      getFieldValue("password") === value
                    ) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error("Passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "Please accept Terms of Services"
                          )
                        ),
                },
              ]}
            >
              <Checkbox>
                I've read and agree with your{" "}
                <a href="/">Terms of Services</a>
              </Checkbox>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              className={styles.submitBtn}
            >
              Create Account 
            </Button>
          </Form>
      </div>
    ),
  },
];

  return (
    <div className={styles.main}>
      <div className={styles.left}></div>

      <div className={styles.right}>
        <Tabs
        defaultActiveKey="1"
        centered
        items={items}
        />
      </div>
    </div>
  );
}