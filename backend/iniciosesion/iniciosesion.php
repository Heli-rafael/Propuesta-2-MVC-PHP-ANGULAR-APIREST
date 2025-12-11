<?php
session_start();

if (isset($_SESSION['user'])) {
    header("Location: http://localhost:4200/pagos");
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login</title>
    <link rel="stylesheet" href="iniciosesion.css" />
</head>
<body>
    <div class="container">
        <!-- Contenedor del formulario -->
        <div class="login-box">
            <h2>Bienvenido</h2>
            <p class="subtitle">Ingresa tus credenciales para continuar</p>

            <form action="login.php" method="post">
                <div class="input-group">
                    <label for="correo">Correo electrónico</label>
                    <input type="correo" id="correo" name="correo" placeholder="ejemplo@correo.com" required>
                </div>

                <div class="input-group">
                    <label for="contraseña">Contraseña</label>
                    <input type="contraseña" id="contraseña" name="contraseña" placeholder="••••••••" required>
                </div>

                <button type="submit" class="btn">Iniciar sesión</button>

                <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
            </form>
        </div>

        <!-- Contenedor de la imagen -->
        <div class="image-box">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80" alt="Login Image">
        </div>
    </div>
</body>
</html>
