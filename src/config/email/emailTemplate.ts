const generateEmailTemplate = (nombre: string, descripcion: string, url: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Guía de Signos Disponible</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 90%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #2c7be5;
            color: #ffffff;
            text-align: center;
            padding: 20px;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
        }
        .content p {
            font-size: 16px;
            color: #333333;
            line-height: 1.6;
        }
        .content a {
            background-color: #2c7be5;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            display: inline-block;
        }
        .footer {
            background-color: #f4f4f4;
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #777777;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Nueva Guía de Signos Disponible</h1>
        </div>
        <div class="content">
            <p>¡Hola! Se ha agregado una nueva guía de signos: <strong>${nombre}</strong></p>
            <p>${descripcion}</p>
            <p>Haz clic en el siguiente enlace para ver la imagen:</p>
            <a href="${url}">Ver Imagen</a>
        </div>
        <div class="footer">
            © ${new Date().getFullYear()} Mi App de Signos. Todos los derechos reservados.
        </div>
    </div>
</body>
</html>
`;

export default generateEmailTemplate;