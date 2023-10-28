const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    if (req.method == "GET" && req.url == "/") {
        res.write("<div>Home</div>");
        return res.end();
    } else if (req.method == "GET" && req.url == "/form") {
        res.write("<div>");
        res.write("<form method='POST' action='/form-submit'>");
        res.write("<input placeholder='message' type='text' name='message'/>");
        res.write("<button type='submit'>Submit</button>");
        res.write("</form>");
        res.write("</div>");
        return res.end();
    } else if (req.method == "POST" && req.url == "/form-submit") {
        const buffer = [];
        req.on("data", (chunk) => {
            buffer.push(chunk);
        });
        req.on("end", () => {
            const parsedData = Buffer.concat(buffer).toString();
            const message = parsedData.split("=")[1];
            fs.writeFileSync("message.txt", message);
        });
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
    }
    res.write("<div>Error</div>");
    res.end();
});

server.listen(8080);
