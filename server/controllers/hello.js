exports.hello = (req, res) => {
  res.json({
    'hello': ["bob", "jim"]
  })
}