import React, { useContext, useState } from "react";
import {Form, Button, Alert} from "react-bootstrap";
import { useFormik } from 'formik';
import * as yup from 'yup';
import {xhr, Loading} from "../components/";
import {Context} from "../providers/mainProvider";
import {useHistory} from "react-router-dom";
import Cookies from "../components/cookies";

export default function Login() {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const {setValue, fullName, locale} = useContext(Context);
    const history = useHistory();

    yup.setLocale({
        mixed: {
            default: locale.wrong_value_message,
            required: locale.required_value_message
        },
    });

    const formik = useFormik({
        initialValues: {
            mobile: '',
            password: '',
        },
        validationSchema: yup.object({
            mobile: yup.string().required(locale.enter_username),
            password: yup.string().required(locale.enter_password)
        }),
        onSubmit: values => {
            setLoading(true);
            values.code = '+98';
            new xhr({
                url: 'login',
                data: values,
                no_locale: true,
            }).Post(response => {
                setLoading(false);
                if(response.status){
                    setValue({
                        auth: true,
                        user_id: response.data.item.id
                    });
                    const CookieObj = new Cookies();
                    CookieObj.setCookieBatch([
                        {
                            name: "token",
                            value: response.token,
                            days: 7
                        },
                        {
                            name: "UID",
                            value: response.data.item.id,
                            days: 7
                        },
                        {
                            name: "UNAME",
                            value: fullName(response.data.item.name, response.data.item.family),
                            days: 7
                        }
                    ]);
                    history.push("/");
                }else{
                    setMessage(<Alert variant="danger">{response.note}</Alert>);
                }
            });
        }
    });

    return <>
        <div className="login-box centered">
            {message}
            <Form noValidate onSubmit={formik.handleSubmit}>
                <Form.Group controlId="mobile">
                    <Form.Label>{locale.mobile}</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        name="mobile"
                        value={formik.values.mobile}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        bsPrefix="form-control ltr"
                        isValid={formik.touched.mobile && !formik.errors.mobile}
                        isInvalid={!!formik.errors.mobile}
                    />
                    <Form.Control.Feedback>{locale.correct}</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">{formik.errors.mobile}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>{locale.password}</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        bsPrefix="form-control ltr"
                        isValid={formik.touched.password && !formik.errors.password}
                        isInvalid={!!formik.errors.password}
                    />
                    <Form.Control.Feedback>{locale.correct}</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="submit">
                    <Button type="submit" disabled={loading}>{loading ? <Loading theme="light"/> : locale.login}</Button>
                </Form.Group>
            </Form>
        </div>
    </>;
}