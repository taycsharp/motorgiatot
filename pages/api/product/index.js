import sessionChecker from "~/lib/sessionPermission";
import ProductModel from "../../../models/product";
import dbConnect from "../../../utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "product")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const products = await ProductModel.find({}).sort("-date").exec();
        //update product price to format like 1,980,000.5 VND
        const formattedproducts = products.map(pro => {
          const formattedPrice = pro.price.toLocaleString(undefined, { minimumFractionDigits: 0 });
          console.log(formattedPrice);
          return { ...pro._doc, price: formattedPrice }; // Use ._doc to access the product document in Mongoose
        })
        res.status(200).json({ success: true, product: formattedproducts});
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
