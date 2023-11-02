const { contentType } = require("express/lib/response");






// inside the schema type this code
image: {
    data: Buffer,
    contentType: String
}




// below the model type this
const storage = multer.memoryStorge()

const upload = multer({storage: storage})



// inside the post route type this code

app.post("/", upload.single("image"), async (req, res) => {

    image: {
        data: req.file.buffer,
        contentType: req.flie.minetype
    }
    
    
add the await image.save()
})
