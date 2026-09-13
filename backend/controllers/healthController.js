function getRoot(req, res) {
  res.json({ message: "VisioSoft API çalışıyor" });
}

function getHealth(req, res) {
  res.json({ status: "ok" });
}

export default {
  getRoot,
  getHealth,
};
