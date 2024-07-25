"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_1 = require("./data");
// initialize our app
const app = (0, express_1.default)();
app.get("/api/products", (req, res) => {
  res.json(data_1.sampleProducts);
});
const PORT = 8000;
// starting our server
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
