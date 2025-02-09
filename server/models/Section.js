const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
	sectionName: {
		type: String,
	},
	subSection: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "SubSection",
		},
	],
});

sectionSchema.pre('findOneAndDelete', async function (next) {
	try {
	  const section = await this.model.findOne(this.getFilter());
	  if (section) {
		await mongoose.model('SubSection').deleteMany({ _id: { $in: section.subSection } });
	  }
	  next();
	} catch (err) {
	  next(err);
	}
});

module.exports = mongoose.model("Section", sectionSchema);
