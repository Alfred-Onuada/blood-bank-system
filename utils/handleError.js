/**
 * Transforms and send back a readable error message to the frontend client
 * @param {Error} error
 * @param {response} res
 */
export default function (error, res) {
  // process error from mongodb schema validation
  if (error.name === "ValidationError") {
    // get all validation errors
    const validationErrors = Object.values(error.errors).map((err) => {
      // identify and parse cast errors
      if (err.name === "CastError") {
        return `The value ${err.stringValue.replace(
          /\"/g,
          "'"
        )} doesn't match the required type for that field`;
      }

      return err.message;
    });

    // send error to client
    res.status(400).json({
      message: "Bad Request",
      errors: validationErrors,
    });
    return;
  }

  // process error from mongodb duplicate key
  if (error.code === 11000) {
    let duplicateField = Object.keys(error.keyPattern)[0];

    res.status(400).json({ message: `${duplicateField} already exists` });
    return;
  }

  res.status(500).json({ message: "Internal Server Error" });
};