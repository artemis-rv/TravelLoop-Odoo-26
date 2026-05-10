import dotenv from "dotenv";
dotenv.config();

import app from "./src/app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Traveloop] Server running on http://localhost:${PORT}`);
  console.log(`[Traveloop] API Docs: http://localhost:${PORT}/api-docs`);
});
