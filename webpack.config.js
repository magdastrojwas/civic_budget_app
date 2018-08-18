module.exports = {
    entry: "./src/js/app.jsx",
    output: {
        filename: "./js/out.js"
    },
    devServer: {
        inline: true,
        contentBase: './',
        port: 3001
    },
    //watch: true,
    module: {
        loaders: [{
            test: /\.jsx$/,  exclude: /node_modules/,
            loader: 'babel-loader',
            query: { presets: [ 'es2015', 'stage-2', 'react'] }
        },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },
            {
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
        }, {
            test: /\.scss$/,
            use: [ 'style-loader', 'css-loader', 'sass-loader' ]
        }]
    }
};
