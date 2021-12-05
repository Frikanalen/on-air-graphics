const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const path = require("path")

const PROD = process.env.NODE_ENV === "production"

console.log(PROD)

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
    port: 9000,
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
  },
}
