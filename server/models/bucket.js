var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BucketSchema = new mongoose.Schema({
	title: String,
	bucket_tasks: {type: Array, "default": []}
})

var UserSchema = new mongoose.Schema({
	facebookID: Number,
	displayName: String,
	givenName: String
});

var Bucket = mongoose.model('Buckets', BucketSchema);
var User = mongoose.model('Users', UserSchema);
