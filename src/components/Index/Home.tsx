'use client'

import React from 'react';
import { Button, Form, Input } from 'antd';
import { redirect } from 'next/navigation';


const Login: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = async () => {
        const {email,password} = form.getFieldsValue()
        console.log('Success:', email,password);
        try{
            const res = await fetch('/api/auth/handleLogin',{
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({email:email,password:password})
            });
            if(res.ok) redirect('/home')
            alert("Credenciales inválidas")
        }catch{
            alert("Error procesando la solicitud")
        }
    };

    return(
        <div className='flex w-full h-[400px] justify-center items-center'>
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
                    label={<span className="text-white">Usuario</span>}
                    name="email"
                    rules={[{ required: true, message: 'Por favor introduzca su correo' }]}
                >
                    <Input
                        className="text-white placeholder-neutral-600 bg-transparent border-white"
                        placeholder="ejemplo@mail.com"
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="text-white">Contraseña</span>}
                    name="password"
                    rules={[{ required: true, message: 'Por favor introduzca su contraseña.' }]}
                >
                    <Input.Password
                        className="text-white placeholder-gray-700 bg-transparent border-white"
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
    )
};

export default Login;