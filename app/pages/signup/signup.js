"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tabs } from 'antd';
import { Form, Input, Button, Checkbox } from "antd";

import styles from "./signup.module.scss";


export default function SignUp() {
  const [form] = Form.useForm();
  const router = useRouter();


  const API_BASE = process.env.BASE || "http://localhost:8088";

  const onFinish = async (values, role) => {
    if (role === "student") {
      try {
        const response = await fetch(
          `${API_BASE}/api/auth/register/student`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              baseRequest: {
                email: values.email,
                password: values.password,
                role: "STUDENT",
                isActive: true,
              },
              firstName: values.fullName,
              lastName: values.username,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          alert("Амжилттай бүртгэгдлээ");
          router.push("/pages/student/home");
        } else {
          alert(data.message || "Бүртгэл амжилтгүй.");
        }
      } catch (error) {
        console.error(error);
        alert("Сервертэй холбогдож чадсангүй.");
      }
    }

    if (role === "employer") {
      try {
        const response = await fetch(
          `${API_BASE}/api/auth/register/organization`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              baseRequest: {
                email: values.email,
                password: values.password,
                role: "COMPANY",
                isActive: true
              },
              organizationName: values.fullName,
              industry: values.username,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          alert("Амжилттай бүртгэгдлээ");
          router.push("/pages/employer/home");
        } else {
          alert(data.message || "Бүртгэл амжилтгүй.");
        }
      } catch (error) {
        console.error(error);
        alert("Сервертэй холбогдож чадсангүй.");
      }

    }

    if (role === "teacher") {
      try {
        const response = await fetch(
          `${API_BASE}/api/auth/register/teacher`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              baseRequest: {
                email: values.email,
                password: values.password,
                role: "TEACHER",
                isActive: true
              },
              firstName: values.fullName,
              lastName: values.username,
            }),
          }
        );
        const text = await response.text();

        let data = null;
        if (text) {
          data = JSON.parse(text);
        }

        if (response.ok) {
          alert("Амжилттай бүртгэгдлээ");
          router.push("/pages/teacher/home");
        } else {
            if (data == null) {
                alert(data.message+" Бүртгэл амжилтгүй.")
            }
        }
      } catch (error) {
        console.error(error);
        alert("Сервертэй холбогдож чадсангүй.");
      }

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
                I&apos;ve read and agree with your{" "}
                  <Link href="/">Terms of Services</Link>
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
                <Input placeholder="Company Name" />
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
                I&apos;ve read and agree with your{" "}
                <Link href="/">Terms of Services</Link>
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
                I&apos;ve read and agree with your{" "}
                <Link href="/">Terms of Services</Link>
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