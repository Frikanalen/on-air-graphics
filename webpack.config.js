const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const path = require("path")

require("dotenv/config")

const PROD = process.env.NODE_ENV === "production"
const PORT = Number(process.env.PORT) || 8050

module.exports = {
  entry: "./src/index.tsx",
  mode: PROD ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        FK_API: JSON.stringify(process.env.FK_API),
      },
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
      publicPath: "/graphics",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "public",
          globOptions: {
            ignore: ["**/*index.html"],
          },
        },
      ],
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    publicPath: "/graphics",
    port: PORT,
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
  },
}
