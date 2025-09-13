const mongoose = require("mongoose");

const authProviderSchema = new mongoose.Schema({
    provider: {
      type: String,
      enum: ['Google', 'GitHub'],
      required: true,
    },
    providerId: String
});

module.exports = mongoose.model("AuthProvider", authProviderSchema);
