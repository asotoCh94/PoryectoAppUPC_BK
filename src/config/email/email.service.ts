import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export async function sendEmail(to: string[], subject: string, text: string, html: string) {
    try {
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: { name: 'Mi App de Signos', email: process.env.EMAIL_FROM },
                to: to.map(email => ({ email })),
                subject: subject,
                textContent: text,
                htmlContent: html,
            },
            {
                headers: {
                    'api-key': process.env.BREVO_API_KEY,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("Correo enviado:", response.data);
    } catch (error) {
        console.error("Error al enviar correo:", error.message);
        throw new Error("Error al enviar correo: " + error.message);
    }
}