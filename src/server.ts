import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRouter from "./routes/users.routes.js";
import authRouter from "./routes/auth.routes.js";
// import categoryRouter from "./routes/category.routes.js";
// import productRouter from "./routes/product.routes.js";
// import addressRouter from "./routes/address.routes.js";
// import orderRouter from "./routes/order.routes.js";
// import mercadoPagoRouter from "./routes/mercadopago.routes.js";
// import stripeRouter from "./routes/stripe.routes.js";
// import { errorHandler } from './middlewares/errorHandler.js';
import path from "path";
import { fileURLToPath } from 'url';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()

app.use(cors())
app.use(express.json())

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.get("/", (req, res)=>{
    res.json({
        message : "API with node.js"
    });
});

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use(errorHandler)

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});

// app.listen(PORT, ()=>{
//     console.log(`Server running port: ${PORT}`);
// });