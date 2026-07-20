"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tabs } from 'antd';
import { Form, Input, Button, Checkbox, Select } from "antd";

import styles from "./signup.module.scss";
import { responsiveArray } from "antd/es/_util/responsiveObserver";

export default function SignUp() {
  const [form] = Form.useForm();
  const router = useRouter();
  
const onFinish = async (values, role) => {
    if (role === "student") {
      router.push("/pages/student/home");
    }

    if (role === "employer") {
      router.push("/pages/employer/home");
    }

    if (role === "teacher") {
      router.push("/pages/teacher/home");
    }
  };
  /*const API_BASE = process.env.BASE || "http://localhost:8088";

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
          alert(data.message || "Бүртгэл амжилтгүй.");
        }
      } catch (error) {
        console.error(error);
        alert("Сервертэй холбогдож чадсангүй.");
      }

    }
  };*/

  const items = [
    {
      key: '1',
      label: 'Оюутан',
      children: (
        <div className={styles.form}>
          <div className={styles.topRow}>
            <div>
              <h2>Бүртгэл үүсгэх.</h2>
              <p>
                Аль хэдийн бүртгэлтэй юу?{" "}
                <Link href="/pages/login">Нэвтрэх</Link>
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
                    message: "Овог бичнэ үү!",
                  },
                ]}
              >
                <Input placeholder="Овог" />
              </Form.Item>

              <Form.Item
                name="username"
                className={styles.half}
                rules={[
                  {
                    required: true,
                    message: "Нэрээ бичнэ үү!",
                  },
                ]}
              >
                <Input placeholder="Нэр" />
              </Form.Item>
            </div>

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
                  message: "Нууц үг оруулна уу!",
                },
              ]}
            >
              <Input.Password placeholder="Нууц үг" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Нууц үгээ давтаж бичнэ үү!",
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
                      new Error("Нууц үг буруу байна!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Нууц үг давтах" />
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
                <a href="/"> Үйлчилгээний нөхцөл </a>
                {" "} -тэй танилцаж зөвшөөрөв
              </Checkbox>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              className={styles.submitBtn}
            >
              Бүртгүүлэх
            </Button>
          </Form>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Ажилтан',
      children: (
        <div className={styles.form}>
          <div className={styles.topRow}>
            <div>
              <h2>Бүртгэл үүсгэх.</h2>
              <p>
                Аль хэдийн бүртгэлтэй юу?{" "}
                <Link href="/pages/login">Нэвтрэх</Link>
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
                    message: "Компани нэрээ бичнэ үү!",
                  },
                ]}
              >
                <Input placeholder="Компани нэр" />
              </Form.Item>

            </div>

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
                  message: "Нууц үг оруулна уу!",
                },
              ]}
            >
              <Input.Password placeholder="Нууц үг" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Нууц үгээ давтаж бичнэ үү!",
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
                      new Error("Нууц үг буруу байна!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Нууц үг давтах" />
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
                <a href="/"> Үйлчилгээний нөхцөл </a>
                {" "} -тэй танилцаж зөвшөөрөв
              </Checkbox>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              className={styles.submitBtn}
            >
              Бүртгүүлэх
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
              <h2>Бүртгэл үүсгэх.</h2>
              <p>
                Аль хэдийн бүртгэлтэй юу?{" "}
                <Link href="/pages/login">Нэвтрэх</Link>
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
                    message: "Овог бичнэ үү!",
                  },
                ]}
              >
                <Input placeholder="Овог" />
              </Form.Item>

              <Form.Item
                name="username"
                className={styles.half}
                rules={[
                  {
                    required: true,
                    message: "Нэрээ бичнэ үү!",
                  },
                ]}
              >
                <Input placeholder="Нэр" />
              </Form.Item>
            </div>

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
                  message: "Нууц үг оруулна уу!",
                },
              ]}
            >
              <Input.Password placeholder="Нууц үг" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Нууц үгээ давтаж бичнэ үү!",
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
                      new Error("Нууц үг буруу байна!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Нууц үг давтах" />
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
                <a href="/"> Үйлчилгээний нөхцөл </a>
                {" "} -тэй танилцаж зөвшөөрөв
              </Checkbox>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              className={styles.submitBtn}
            >
              Бүртгүүлэх
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