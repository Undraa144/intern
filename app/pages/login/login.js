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

  const onFinish = async (values) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(result.message || "Login failed");
        return;
      }

      const userData = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "same-origin",
      });
      const data1 = await userData.json().catch(() => ({}));

      if (!userData.ok) {
        alert(data1.message || "Хэрэглэгчийн мэдээллийг уншиж чадсангүй.");
        return;
      }

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
      label: 'Оюутан',
      children: (
        <div className={styles.form}>
          <div className={styles.topRow}>
            <div>
              <h2>Нэвтрэх.</h2>
              <p>
                Бүртгэлгүй юу? {" "}
                <Link href="/pages/signup?role=student">Бүртгүүлэх</Link>
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
                  message: "Имэйл хаягаа оруулна уу!",
                },
                {
                  type: "email",
                  message: "Буруу имэйл!",
                },
              ]}
            >
              <Input placeholder="Имэйл хаяг" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Нууц үгээ оруулна уу!",
                },
              ]}
            >
              <Input.Password placeholder="Нууц үг" />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
            >
              <Checkbox>
                Сануулах
              </Checkbox>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              className={styles.submitBtn}
            >
              Нэвтрэх
            </Button>
          </Form>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Байгууллага',
      children: (
        <div className={styles.form}>
          <div className={styles.topRow}>
            <div>
              <h2>Нэвтрэх.</h2>
              <p>
                Бүртгэлгүй юу?{" "}
                <Link href="/pages/signup?role=employer">Бүртгүүлэх</Link>
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
                  message: "Имэйл хаягаа оруулна уу!",
                },
                {
                  type: "email",
                  message: "Буруу имэйл!",
                },
              ]}
            >
              <Input placeholder="Имэйл хаяг" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Нууц үгээ оруулна уу!",
                },
              ]}
            >
              <Input.Password placeholder="Нууц үг" />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
            >
              <Checkbox>
                Сануулах
              </Checkbox>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              className={styles.submitBtn}
            >
              Нэвтрэх
            </Button>
          </Form>
      </div>
      ),
  },
  {
    key: '3',
    label: 'Багш',
    children: (
      <div className={styles.form}>
          <div className={styles.topRow}>
            <div>
              <h2>Нэвтрэх.</h2>
              <p>
                Бүртгэлгүй юу?{" "}
                <Link href="/pages/signup?role=teacher">Бүртгүүлэх</Link>
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
                  message: "Имэйл хаягаа оруулна уу!",
                },
                {
                  type: "email",
                  message: "Буруу имэйл!",
                },
              ]}
            >
              <Input placeholder="Имэйл хаяг" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Нууц үгээ оруулна уу!",
                },
              ]}
            >
              <Input.Password placeholder="Нууц үг" />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
            >
              <Checkbox>
                Сануулах
              </Checkbox>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              className={styles.submitBtn}
            >
              Нэвтрэх
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


