"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tabs, Form, Input, Button, Checkbox } from "antd";

import styles from "./login.module.scss";

export default function Login() {
  const router = useRouter();

/*const onFinish = async (values, role) => {
    if (role === "student") {
      router.push("/pages/student/home");
    }

    if (role === "employer") {
      router.push("/pages/employer/home");
    }

    if (role === "teacher") {
      router.push("/pages/teacher/home");
    }
  };*/
  const API_BASE = process.env.BASE || "http://localhost:8088";

  const onFinish = async (values) => {
    try {
      const response = await fetch("/api/auth/login", {
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

      console.log(result.token);
      localStorage.setItem("token", result.token);
      const token = localStorage.getItem("token");

      const userData = await fetch(`${API_BASE}/api/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data1 = await userData.json();
        console.log(data1)

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data1.role === "STUDENT") {
        router.push("/pages/student/home");
      } else if (data1.role === "TEACHER") {
        router.push("/pages/teacher/home");
      } else if (data1.role === "COMPANY") {
        router.push("/pages/employer/home");
      }
      else{
        alert("хэрэглэгчийн role олдсонгүй")
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
                Dont have  any account?{" "}
                <Link href="/pages/signup">Sign Up</Link>
              </p>
            </div>

          </div>

          <Form
            layout="vertical"
            onFinish={(values) => onFinish(values, "student")}

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
                Dont have  any account?{" "}
                <Link href="/pages/signup">Sign Up</Link>
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
                <Link href="/pages/signup">Sign Up</Link>
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
        defaultActiveKey="1"
        centered
        items={items}
        />
      </div>
    </div>
  );
}
