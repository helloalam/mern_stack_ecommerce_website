const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const mongoose= require("mongoose");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/APIfeatures");
const cloudinary = require("cloudinary");


const getDataUri = require("../utils/dataUri.js");

// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    let images = [];

    if (req.files && req.files.length > 0) {
        images = req.files;
    } else if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else if (Array.isArray(req.body.images)) {
        images = req.body.images;
    } else {
        return next(new ErrorHandler("No images provided", 400));
    }

    const uploadPromises = images.map(async (image, index) => {
        let fileUri;

        if (image.buffer) {
            fileUri = getDataUri(image);
        } else if (typeof image === "string" && image.startsWith("data:image")) {
            fileUri = getDataUri({
                originalname: `image-${index}.png`,
                buffer: Buffer.from(image.split(",")[1], "base64"),
            });
        } else {
            throw new ErrorHandler("Unsupported image format", 400);
        }

        const result = await cloudinary.v2.uploader.upload(fileUri.content, {
            folder: "products",
        });

        return {
            public_id: result.public_id,
            url: result.secure_url,
        };
    });

    const imagesLinks = await Promise.all(uploadPromises);

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product,
    });
});



  
// GET ALL PRODUCTS
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 4;
    const currentPage = Number(req.query.page) || 1;
    const productsCount = await Product.countDocuments();

    // Apply search and filter
    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter();


    // Apply pagination
    apiFeature.pagination(resultPerPage);
    const products = await apiFeature.query;

    const filteredProductsCount = await Product.countDocuments(apiFeature.query.getQuery());


    // Calculate total pages based on filtered products count
    const totalPages = Math.ceil(filteredProductsCount / resultPerPage);

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
        totalPages,
        currentPage,
    });
});


// Get All Products (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products,
    });
});

// Update Product -- Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(new ErrorHandler('Product not found', 500));
    }

    const product = await Product.findByIdAndUpdate(productId, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product,
    });
});

// Delete Product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const productId = req.params.id;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(new ErrorHandler('Invalid product ID', 400));
    }

    // Find the product in the database
    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    // Delete the product from the database using deleteOne
    await Product.deleteOne({ _id: productId });

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
});

// Update Product -- Admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    // Images Start Here
    let images = [];
  
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    if (images !== undefined) {
      // Deleting Images From Cloudinary
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }
  
      const imagesLinks = [];
  
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
  
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
  
      req.body.images = imagesLinks;
    }
  
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
      product,
    });
  });
  

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(new ErrorHandler('Product not found', 500));
    }

    const product = await Product.findById(productId);

    res.status(200).json({
        success: true,
        product,
    });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // Add a check to ensure that `user` is defined before using `toString()`
    const isReviewed = product.reviews.find(
        (rev) => rev.user && rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user && rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

// Get All Reviews of a Product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // Check if the review exists before accessing .toString()
    const reviews = product.reviews.filter(
        (rev) => rev._id && rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = reviews.length === 0 ? 0 : avg / reviews.length;
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
    });
});