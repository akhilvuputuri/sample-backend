const fs = require('fs');
const User = require('./userModel');
const router = require('express').Router();
const multer = require('multer');
const csv = require('fast-csv');
const { privateEncrypt } = require('crypto');
const upload = multer({ dest: 'tmp/csv/' });


// get users
router.get('/users', async function (req, res) {
  console.log(req.query)
  sort = null
  min = 0
  if (req.query.min) {
    min = req.query.min
  }
  max = 4000
  if (req.query.max) {
    max = req.query.max
  }
  limit = 99999999999
  if (req.query.limit) {
    limit = parseInt(req.query.limit)
  }
  if (req.query.sort) {
    sort = req.query.sort.toLowerCase()
  }
  const result = await User.find()
  .select({ name: 1, salary: 1})
  .where('salary').gt(min).lt(max)
  .sort(sort)
  .skip(parseInt(req.query.offset, 0))
  .limit(limit)
  .exec();
  res.send({"results": result});
});

// upload a user
router.post("/upload", upload.single('file'), async function (req, res) {
  try {
    const fileRows = [];
    let rowNum = 0;
    let error = false
    // open uploaded file
    csv.parseFile(req.file.path)
      .on("data", async function (data) {
        if (data.length != 2 || (isNaN(parseFloat(data[1])) && rowNum != 0)) {
          error = true
        }
        if (!isNaN(parseFloat(data[1])) && data[1] >= 0) {
          fileRows.push({
            'name': data[0],
            'salary': parseFloat(data[1])
          });
        }
        rowNum += 1
      })
      .on("end", async function () {
        console.log(error)
        if (error) {
          res.status(400).send({
            status: "failure",
            message: 'Error with csv!',
            success: 0,
          })
        } else {
          for (var i = 1; i < fileRows.length; i++) {
            var newUser = new User(fileRows[i]);
            await newUser.save();
          }
          console.log(fileRows)
          fs.unlinkSync(req.file.path);
          res.status(200).json({
            status: "success",
            message: 'Users added!',
            success: 1,
            data: fileRows
          });
        }
      })

  } catch (err) {
    res.send(err);
  }
});

module.exports = router;