"use client";
import React from "react";
import { useState } from "react";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import HeaderLogin from "@/components/layout/HeaderLogin";

const Login: React.FC = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onFinish = async () => {
        setLoading(true);
        const { email, password } = form.getFieldsValue();
        console.log("Success:", email, password);
        try {
            const res = await fetch("/api/auth/handleLogin", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email, password: password }),
            });
            if (res.ok) {
                router.push("/home");
                return;
            }
            setLoading(false);
            alert("error en la solicitud");
            return;
        } catch (error) {
            console.log(error);
            alert("Error procesando la solicitud");
            setLoading(false);
        }
    };
    if (loading) {
        return <Loader message="Autenticando al usuario..." />;
    }
    return (
        <>
            <HeaderLogin />
            <div className="bg-[url('/herobanner.png')] h-[200px] w-full bg-cover bg-center flex justify-center items-center">
                <span className="text-3xl text-white">Login</span>
            </div>
            <div className="flex w-full h-[400px] justify-center items-center">
                <Form
                    form={form}
                    className="max-w-[600px]"
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label={<span className="text-black">Usuario</span>}
                        name="email"
                        rules={[
                            { required: true, message: "Por favor introduzca su correo" },
                        ]}
                    >
                        <Input
                            className="text-black placeholder-neutral-600 bg-transparent border-gray-700"
                            placeholder="ejemplo@mail.com"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-black">Contraseña</span>}
                        name="password"
                        rules={[
                            { required: true, message: "Por favor introduzca su contraseña." },
                        ]}
                    >
                        <Input.Password
                            className="text-black placeholder-neutral-600 bg-transparent border-gray-700"
                            placeholder="contraseña"
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="bg-white text-black hover:bg-gray-200"
                        >
                            Enviar
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default Login;
