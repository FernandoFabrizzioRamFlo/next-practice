"use client";

import React from "react";
import { Form, Input,Row,Col,Select,InputNumber,DatePicker } from "antd";



const Generar: React.FC = () => {
    
    return (
        <div className="flex flex-col w-full px-10 py-5">
            <Form>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item label="Fecha de inspección" name="inspection_date">
                            <DatePicker />
                        </Form.Item>
                    </Col>
                    <Col span={12} />
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Form.Item label="Número de parte" name="part_number">
                            <Select>{/* Opciones */}</Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item label="Descripción" name="description">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Hour Rate/ Tasa por Hora" name="hour_rate">
                            <InputNumber />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Form.Item label="Cliente" name="client">
                            <Select>{/* Opciones */}</Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Form.Item label="Instrucción de Trabajo" name="work_order">
                            <Select>{/* Opciones */}</Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item label="Fecha de Manufactura" name="mfg_date">
                            <DatePicker />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Serial" name="serial">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item label="Lote" name="lot">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Número de inspectores" name="inspectors">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item label="Horas trabajadas" name="worked_hours">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Semana" name="week">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item label="Piezas inspeccionadas" name="inspected_pieces">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Piezas aceptadas" name="accepted">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item label="Piezas Rechazadas" name="rejected">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Piezas Retrabajadas" name="reworked">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default Generar;
