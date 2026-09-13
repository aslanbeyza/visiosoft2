function notFound(req, res) {
  res.status(404).json({ message: "Route bulunamadı" });
}

export default notFound;
