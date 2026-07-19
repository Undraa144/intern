"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tabs } from 'antd';
import { Form, Input, Button, Checkbox } from "antd";

import styles from "./signup.module.scss";

export default function SignUp() {
  const [form] = Form.useForm();
    const [employerForm] = Form.useForm();
  const router = useRouter();

    const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8088";

  const onFinish = async (values, role) => {
    console.log("ыйбөйбыхбаөха")
    if (role === "student") {
        console.log("энэ тата3");
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
              lastName: values,
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
              industry: values.industry,
            }),
          }
        );


        const data = await response.json();
            console.log(data)
        if (response.ok) {
          alert("Амжилттай бүртгэгдлээ");
          router.push("/pages/employer/home");
        } else {
          alert("Бүртгэл амжилтгүй.");
        }
      } catch (error) {
        console.error(error);
        alert("Сервертэй холбогдож чадсангүй.");
      }

    }

    if (role === "teacher") {
      try {
          console.log("энэ тата4");
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
                alert(" Бүртгэл амжилтгүй.")
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
              <h2>Хаяг үүсгэх.</h2>
              <p>
                Хаял аль хэдийн үүссэн байна{" "}
                <Link href="/pages/login">Log In</Link>
              </p>
            </div>

          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => onFinish(values, "student")}>
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
                    message: "Please input your username1!",
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
              Хаяг үүсгэх
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
              <h2>Хаяг үүсгэх.</h2>
              <p>
                Хаял аль хэдийн үүссэн байна{" "}
                <Link href="/pages/login">Log In</Link>
              </p>
            </div>

          </div>

          <Form
            form={employerForm}
            layout="vertical"

            onFinish={(values) => {
                console.log("энэ дээр дарав");
                onFinish(values, "employer");
            }}
          >

            <div className={styles.row}>
              <Form.Item
                name="fullName"
                className={styles.half}
                rules={[
                  {
                    required: true,
                    message: "Байгууллагын нэрийг оруулна уу",
                  },
                ]}
              >
                <Input placeholder="Байгууллагын нэр" />
              </Form.Item>

            </div>

            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Имайл хаягаа оруулна уу",
                },
                {
                  type: "email",
                  message: "Имайл хаяг алдаатай байна",
                },
              ]}
            >
              <Input placeholder="Имайл хаяг" />
            </Form.Item>
              <Form.Item
                  name="industry"
                  rules={[
                      {
                          required: true,
                          whitespace: true,
                          message: "Салбараа оруулна уу",
                      },
                  ]}
              >
                  <Input placeholder="Салбар" />
              </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Нууц үгээ шалгана уу",
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
                  message: "Нууц үгээ шалгана уу",
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
                      new Error("Нууц үг таарахгүй байна!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Нууц үгээ давтан оруулах" />
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
                Би уншиж танилцсан{" "}
                <Link href="/">Үйлчилгээний нөхцөл</Link>
              </Checkbox>
            </Form.Item>

              <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className={styles.submitBtn}
              >
                  Хаяг үүсгэх
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
              <h2>Хаяг үүсгэх</h2>
              <p>
                Бүртгэлтэй хаяг байгаа{" "}
                <Link href="/pages/login">Бүртгүүлэх</Link>
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
              Хаяг үүсгэх
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