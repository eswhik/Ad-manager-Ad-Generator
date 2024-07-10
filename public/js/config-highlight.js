hljs.addPlugin(
    new CopyButtonPlugin({
        hook: (text, el) => {
            let {
                replace,
                replacewith
            } = el.dataset;
            if (replace && replacewith) {
                return text.replace(replace, replacewith);
            }
            return text;
        },
        callback: (text, el) => {
            /* logs `gretel configure --key grtf32a35bbc...` */
            console.log(text);
        },
    })
);
hljs.highlightAll();