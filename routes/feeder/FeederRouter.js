const express = require("express");
const FeederService = require("../../service/feeder/FeederService");
const router = express.Router();

router.get("/getFeederComparisonData", async (_, res) => {
  try {
    const result = await FeederService.Get();
    res.render("table.pug", { data: result });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
