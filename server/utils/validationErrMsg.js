module.exports = (error) => {
  if (error.name === "ValidationError") {
    let errors = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return errors;
  } else {
    return error;
  }
};

// module.exports = (error) => {
//     return error.split(':')[2].split(',')[0];
// };