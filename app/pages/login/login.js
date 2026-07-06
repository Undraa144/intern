"use client";

import Link from "next/link";
import {Tabs} from 'antd';
import { Form, Input, Button, Checkbox, Select } from "antd";

import styles from "./login.module.scss";

export default function Login() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const items = [
  {
    key: '1',
    label: 'Student',
    children: (
      <div className={styles.form}>
          <div className={styles.topRow}>
            <div>
              <h2>Log In.</h2>
              <p>
                Dont have  any account?{" "}
                <Link href="/pages/login">Sign Up</Link>
              </p>
            </div>

          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >

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
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "Remember me"
                          )
                        ),
                },
              ]}
            >
              <Checkbox>
                Remember me
              </Checkbox>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              className={styles.submitBtn}
            >
              <Link href="/pages/student/home">Log In</Link> 
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
              <h2>Log In.</h2>
              <p>
                Dont have  any account?{" "}
                <Link href="/pages/login">Sign Up</Link>
              </p>
            </div>

          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >

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
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "Remember me"
                          )
                        ),
                },
              ]}
            >
              <Checkbox>
                Remember me
              </Checkbox>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              className={styles.submitBtn}
            >
              <Link href="/pages/student/home">Log In</Link> 
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
              <h2>Log In.</h2>
              <p>
                Dont have  any account?{" "}
                <Link href="/pages/login">Sign Up</Link>
              </p>
            </div>

          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >

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
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "Remember me"
                          )
                        ),
                },
              ]}
            >
              <Checkbox>
                Remember me
              </Checkbox>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              className={styles.submitBtn}
            >
              <Link href="/pages/student/home">Log In</Link> 
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