var mongoose = require('mongoose');


var fileSchema = mongoose.Schema({// making file model to store the enquery form information into database
    file_title :String,    
    file_name :String,

});


module.exports = mongoose.model('File', fileSchema); //use outside this model
