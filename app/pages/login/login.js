"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, Form, Input, Button, Checkbox } from "antd";

import styles from "./login.module.scss";
import { getAuthRoleTabKey } from "../../utils/auth-role-tabs.mjs";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabKey = getAuthRoleTabKey(searchParams.get("role"));
    const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8088";
  const onFinish = async (values) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      const result = await response.json();

      console.log(response.ok);
      document.cookie = "token="+result.token+"; path=/";
      const token = result.token;
      console.log("token", token);
      const userData = await fetch(`${API_BASE}/api/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data1 = await userData.json();
        console.log(data1)



      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      if (!userData.ok) {
        alert("Хэрэглэгчийн мэдээллийг уншиж чадсангүй.");
        return;
      }
      console.log(data1);

      if (data1.role === "STUDENT") {
        router.push("/pages/student/home");
      } else if (data1.role === "TEACHER") {
        router.push("/pages/teacher/home");
      } else if (data1.role === "COMPANY") {
        router.push("/pages/employer/home");
      } else {
        alert("Хэрэглэгчийн role олдсонгүй");
      }
    } catch (error) {
      console.error(error);
      alert("Сервертэй холбогдож чадсангүй.");
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
              <h2>Log In.</h2>
              <p>
                Dont have any account?{" "}
                <Link href="/pages/signup?role=student">Sign Up</Link>
              </p>
            </div>
          </div>

          <Form
            layout="vertical"
            onFinish={(values) => onFinish(values)}
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
              Log In
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
                Dont have any account?{" "}
                <Link href="/pages/signup?role=employer">Sign Up</Link>
              </p>
            </div>

          </div>

          <Form
            layout="vertical"
            onFinish={(values) => onFinish(values, "employer")}
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
              Log In
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
                <Link href="/pages/signup?role=teacher">Sign Up</Link>
              </p>
            </div>

          </div>

          <Form
            layout="vertical"
            onFinish={(values) => onFinish(values, "teacher")}
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
              Log In
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
          defaultActiveKey={activeTabKey}
          centered
          items={items}
        />
      </div>
    </div>
  );
}


