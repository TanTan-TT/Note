const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
let extractCss = new ExtractTextPlugin('[name].css?');
// const smartImport = require("postcss-smart-import")

const env = process.env.NODE_ENV;
const isDev = env === 'dev';
console.log(env);
console.log('isDev:' + isDev);



let vendor = [
  "react",
  "react-dom",
  'react-redux',
  'react-router',
  'react-router-redux',
  'redux',
  'redux-thunk',
  "immutable"
]

let app = [
  './src/index.tsx'
]

let entryMaker = (isDev) => {
  if(isDev){
    app.unshift('react-hot-loader/patch');
    return {
      vendor,
      app
    }
  }
  else {
    return {
      vendor,
      app
    }
  }
}

let output = {
  filename: "[name].js",
  publicPath: "/",
  path: path.resolve(__dirname, 'build')
}

let outputMaker = (env, isDev) => {
  if(isDev){
    return output;
  }
  else {
    output.publicPath = "/";
    return output;
  }
}

let plugin = [
  extractCss,
  new HtmlWebpackPlugin({
    template: './src/template.html',
    favicon: './src/style/image/favicon.ico',
    hash: true,
    cache: true
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: "vendor",
    filename: "vendor.js"
  }),
  new webpack.NamedModulesPlugin()
]

let pluginMaker = (isDev) => {
  if(isDev){
    //HMR loader
    plugin.push(new webpack.HotModuleReplacementPlugin());
    // plugin.push(new webpack.DefinePlugin({
    //   "process.env.API": JSON.stringify(api)
    // }))
  }
  else {
    //removes a lot of debugging code in React
    plugin.push(new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        // "API": JSON.stringify(api)
      }
    }))
    plugin.push(new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }))
    // minifies your code
    plugin.push(new webpack.optimize.UglifyJsPlugin({
      sourceMap:false,
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    }))


  }
  return plugin;
}

let tsloader = ["react-hot-loader/webpack","awesome-typescript-loader"];

let tsloaderMaker = (isDev) => {
  if(!isDev){
    tsloader.shift();
  }
  return tsloader;
}

module.exports = {
  entry: entryMaker(isDev),
  output: outputMaker(env, isDev),
  context: __dirname,
  // Enable sourcemaps for debugging webpack's output.
  devtool: isDev ? "eval" : false,

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ["webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },

  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'build'),
    historyApiFallback: true,
    publicPath: '/',
    https: true,
    proxy: {
      "/api": "http://localhost:3210"
    }
  },

  plugins: pluginMaker(isDev),

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3|\.eot$/,
        loader: 'file-loader?limit=30000&name=./[name]-[hash].[ext]'
      },
      {
        test: /\.s?css$/,
        loader: extractCss.extract([
          'css-loader',
          'postcss-loader?sourceMap=inline',
          "sass-loader"
          // 'less-loader'
        ]),
        // options: {
        //   plugins: function () {
        //     return [
        //       smartImport({
        //         addDependencyTo: webpack
        //       }),
        //       require('precss'),
        //       require('autoprefixer')
        //     ];
        //   }
        // }
      },
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: tsloaderMaker(isDev),
        exclude: /node_modules/
      }
    ]
  }
};
