import * as http from "http";

const PORT = 3000;

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

let posts: Post[] = [];

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    const { method, url } = req || "";
    // > Initial route
    if (method === "GET" && url === "/") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "Welcome to post api" }));
      res.end();
    }
    // > GET ALL POSTS
    else if (method === "GET" && url === "/posts") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(posts));
      res.end();
    }
    // > GET POST BY ID
    else if (method === "GET" && url?.startsWith("/posts/")) {
      const id = parseInt(url?.split("/")[2] || "0");
      const post = posts.find((p) => p.id === id);
      if (post) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(post));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "Post not found" }));
      }
      res.end();
    }
    // > POST
    else if (method === "POST" && url === "/posts") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        const data = JSON.parse(body);
        if (!data.userId || !data.title || !data.body) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: "Invalid post data" }));
          res.end();
          return;
        }

        const newPost: Post = {
          userId: data.userId,
          id: posts.length + 1,
          title: data.title,
          body: data.body,
        };

        posts.push(newPost);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.write(
          JSON.stringify({ message: "Post created successfully", post: data }),
        );
        res.end();
      });
    }
    // > PUT
    else if (method === "PUT" && url?.startsWith("/posts/")) {
      const id = parseInt(url?.split("/")[2] || "0");
      const post = posts.find((p) => p.id === id);
      if (post) {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          try {
            const data = JSON.parse(body);

            if (!data.userId || !data.title || !data.body) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Invalid post data" }));
              return;
            }

            post.userId = data.userId;
            post.title = data.title;
            post.body = data.body;

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Post updated successfully",
                post: post,
              }),
            );
          } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
          }
        });
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Post not found" }));
      }
    }
    // > PATCH
    else if (method === "PATCH" && url?.startsWith("/posts/")) {
      const id = parseInt(url?.split("/")[2] || "0");
      const post = posts.find((p) => p.id === id);
      if (post) {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          try {
            const data = JSON.parse(body);
            if (data.userId) post.userId = data.userId;
            if (data.title) post.title = data.title;
            if (data.body) post.body = data.body;
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Post updated successfully",
                post: post,
              }),
            );
          } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
          }
        });
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Post not found" }));
      }
    }
    // > DELETE
    else if (method === "DELETE" && url?.startsWith("/posts/")) {
      const id = parseInt(url?.split("/")[2] || "0");
      const post = posts.find((p) => p.id === id);

      if (post) {
        posts = posts.filter((p) => p.id !== id);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Post deleted successfully" }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Post not found" }));
      }
    }
    // > NOT FOUND
    else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "Endpoint not found" }));
      res.end();
    }
  },
);

server.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
