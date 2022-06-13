import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    images: [],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

const productSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    parentid: {
      type: String,
      default: 'parent'
    },
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'CategoryModel',
    },
    subcategory: [String],
    thumbnailImage: {
      type: String,
    },
    images: [String],
    slug: {
      type: String,
    },
    description: {
      type: String,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
       type: Number,
       required: true,
    },
    offerPrice: {
       type: Number,
    },
     qty: {
      type: Number,
       required: true,
     },
    availableVariants: [String],
    variant: {
      type: Object
    },
    availableVariantOption:{
      type: Object,
    },
    sold: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    },
    active:{
      type: Boolean,
      default: false
    },
    dimensions: {
      type: Object,
      required: false
    },
    hasReturnOption: {
      type: Boolean,
      default: false
    },
    returnDays: {
      type: Number
    },
    specs: []
  
  },
  {
    timestamps: true,
  },
  {strict: false}
)

const Product = mongoose.model('Product', productSchema)

export default Product
