const posts = [
  { title: "post1", body: "this is post one" },
  { title: "post2", body: "this is post two" },
];
function getPosts() {
  setTimeout(() => {
    output = "";
    posts.forEach((post, index) => {
      output += `<li>${post.title}</li>`;
    });
    document.body.innerHTML = output;
  }, 1000);
}

function createPost(post) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      posts.push(post);

      const error = false;
      if (!error) {
        resolve();
      } else {
        reject("Error: Something went Wrong");
      }
    }, 2000);
  });
}
createPost({ title: "post 3", body: "This is post 3" })
  .then(getPosts)
  .catch((err) => console.log(err));
