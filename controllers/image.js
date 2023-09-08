const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + "6ab21713210c4ef9b7b0c52f4ca6fa88");
const PAT = "6ab21713210c4ef9b7b0c52f4ca6fa88";
const USER_ID = "4xyp5oj5fq6t";
const APP_ID = "test";
const MODEL_ID = "face-detection";

const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      model_id: MODEL_ID,
      inputs: [
        { data: { image: { url: req.body.input, allow_duplicate_url: true } } },
      ],
    },
    metadata,
    (err, response) => {
      if (err) {
        throw new Error(err);
      }

      if (response.status.code !== 10000) {
        throw new Error(
          "Post model outputs failed, status: " + response.status.description
        );
      }

      // Since we have one input, one output will exist here
      const output = response.outputs[0];

      res.json(response);
    }
  );
};

const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage: handleImage,
  handleApiCall,
};
